import {
  DEFAULT_PARAMS,
  corsHeaders,
  mimeTypes,
  statusCodes,
} from "./constants";
import { parse } from "./parse";
import {
  Env,
  ExecutionContext,
  HTTPMethod,
  JSONResponseObject,
  ParsedRoute,
  RouteHandler,
  RouteInfo,
} from "./types";
import { getRequestPath } from "./util";

export function json(obj: JSONResponseObject) {
  return new Response(JSON.stringify(obj) + "\n", {
    status: statusCodes.ok,
    headers: {
      "Content-Type": mimeTypes.json,
    },
  });
}

export function text(str: string) {
  return new Response(str, {
    status: statusCodes.ok,
    headers: {
      "Content-Type": mimeTypes.plain,
    },
  });
}

export function error(status: number, message?: string) {
  return new Response(
    JSON.stringify({
      error: true,
      message: message ?? "An error occurred",
    }) + "\n",
    { status }
  );
}

class Route {
  constructor(
    private method: HTTPMethod,
    private route: ParsedRoute,
    private handler: RouteHandler
  ) {}

  matches(request: Request): boolean {
    return request.method === this.method && this.hasMatchingPath(request);
  }

  hasMatchingPath(request: Request): boolean {
    return this.route.isMatch(getRequestPath(request));
  }

  routeInfo(request: Request): RouteInfo {
    const url = new URL(request.url);

    return {
      params: this.route.matchParams(url.pathname) || DEFAULT_PARAMS,
      path: url.pathname,
      query: url.searchParams,
    };
  }

  async execute(request: Request, env: Env, ctx: ExecutionContext) {
    const routeInfo = this.routeInfo(request);
    return await this.handler(request, env, ctx, routeInfo);
  }
}

export class MiniRouter {
  private routes: Route[] = [];

  get(path: string, handler: RouteHandler) {
    this.addRoute("GET", path, handler);
    return this;
  }

  post(path: string, handler: RouteHandler) {
    this.addRoute("POST", path, handler);
    return this;
  }

  put(path: string, handler: RouteHandler) {
    this.addRoute("PUT", path, handler);
    return this;
  }

  delete(path: string, handler: RouteHandler) {
    this.addRoute("DELETE", path, handler);
    return this;
  }

  head(path: string, handler: RouteHandler) {
    this.addRoute("HEAD", path, handler);
    return this;
  }

  async handle(request: Request, env: Env, ctx: ExecutionContext) {
    let hasMissingMethod = false;

    const corsResponse = this.handleCORS(request);
    if (corsResponse.status !== 200) {
      return corsResponse;
    }

    try {
      for (const route of this.routes) {
        if (route.matches(request)) {
          return await route.execute(request, env, ctx);
        } else if (route.hasMatchingPath(request)) {
          hasMissingMethod = true;
        }
      }
    } catch (e) {
      return error(statusCodes.internalServerError, "Internal server error");
    }

    if (hasMissingMethod) {
      return error(statusCodes.methodNotAllowed, "Method not allowed");
    }

    return error(statusCodes.notFound, "Not found");
  }

  private addRoute(method: HTTPMethod, path: string, handler: RouteHandler) {
    const parsedRoute = parse(path);
    this.routes.push(new Route(method, parsedRoute, handler));
    return this;
  }

  private handleCORS(request: Request): Response {
    const origin = request.headers.get("Origin");

    if (origin !== null) {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: statusCodes.noContent,
          headers: corsHeaders,
        });
      }

      return new Response(null, {
        headers: { ...corsHeaders, "Content-Type": mimeTypes.plain },
        status: statusCodes.noContent,
      });
    }

    return new Response(null);
  }
}
