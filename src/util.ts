export function getRequestPath(request: Request) {
  return getURLPath(request.url);
}

export function getURLPath(str: string) {
  if (str.startsWith("/")) {
    return str;
  }

  const url = new URL(str);
  return url.pathname;
}

export function cleanURLPath(str: string) {
  const path = getURLPath(str);

  if (path === "/") {
    return path;
  }

  return path.replace(/\/$/, "").replace(/\/{2,}/, "/");
}
