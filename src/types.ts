export type HandledResponse = Promise<Response>;
export type HTTPMethod = "GET" | "POST" | "OPTIONS" | "HEAD" | "PUT" | "DELETE";
export type Env = any;
export type ExecutionContext = any;
export type RouteInfo = {
  params: Record<string, string>;
  path: string;
  query: URLSearchParams;
};
export type RouteHandler = (
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  routeInfo?: RouteInfo
) => HandledResponse;
export type RouteParams = { [key: string]: string };
export type RouteToken = {
  type: "static" | "parameter" | "catchAll";
  value: string;
};
export type ParsedRoute = {
  raw: string;
  parsed: RouteToken[];
  matchParams: (url: string) => RouteParams | null;
  isMatch: (url: string) => boolean;
};
type JSONResponseObjectValuePrimitive = string | number | boolean | null;
type JSONResponseObjectValue =
  | JSONResponseObjectValuePrimitive
  | JSONResponseObjectValuePrimitive[]
  | Record<string, JSONResponseObjectValuePrimitive>;
export type JSONResponseObject = Record<string, JSONResponseObjectValue>;
