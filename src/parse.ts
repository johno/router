import {
  CATCH_ALL_TYPE,
  PARAMETER_TYPE,
  STATIC_TYPE,
  URL_SLASH,
} from "./constants";
import { tokenize } from "./tokenize";
import { RouteParams, ParsedRoute } from "./types";
import { cleanURLPath, getURLPath } from "./util";

export function parse(route: string): ParsedRoute {
  const routeTokens = tokenize(route);

  const matchParams = (url: string) => {
    const urlParts = cleanURLPath(url).split(URL_SLASH).filter(Boolean);
    let params: RouteParams = {};

    if (
      routeTokens.length !== urlParts.length &&
      !routeTokens.some((token) => token.type === CATCH_ALL_TYPE)
    ) {
      return null;
    }

    for (let i = 0; i < routeTokens.length; i++) {
      const token = routeTokens[i];

      if (token.type === CATCH_ALL_TYPE) {
        return params;
      }

      if (token.type === PARAMETER_TYPE) {
        params[token.value] = urlParts[i];
      } else if (token.type === STATIC_TYPE && token.value !== urlParts[i]) {
        return null;
      }
    }

    return params;
  };

  function isMatch(providedUrl: string) {
    const url = cleanURLPath(providedUrl);

    if (matchParams(url)) {
      return true;
    }

    return getURLPath(url) === route;
  }

  return {
    raw: route,
    parsed: routeTokens,
    matchParams: matchParams,
    isMatch,
  };
}
