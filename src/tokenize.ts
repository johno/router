import {
  CATCH_ALL_TOKEN,
  CATCH_ALL_TYPE,
  NAMED_PARAM_TOKEN,
  PARAMETER_TYPE,
  STATIC_TYPE,
  URL_SLASH,
} from "./constants";
import { RouteToken } from "./types";

export function tokenize(route: string): RouteToken[] {
  const pathParts = route.split(URL_SLASH).filter(Boolean);
  const tokens: RouteToken[] = [];

  for (const segment of pathParts) {
    if (segment.startsWith(NAMED_PARAM_TOKEN)) {
      tokens.push({ type: PARAMETER_TYPE, value: segment.substring(1) });
    } else if (segment === CATCH_ALL_TOKEN) {
      tokens.push({ type: CATCH_ALL_TYPE, value: CATCH_ALL_TOKEN });
    } else {
      tokens.push({ type: STATIC_TYPE, value: segment });
    }
  }

  return tokens;
}
