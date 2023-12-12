export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const mimeTypes = {
  plain: "text/plain",
  json: "application/json",
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
  png: "image/png",
  jpg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  webm: "video/webm",
  webp: "image/webp",
  ico: "image/x-icon",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf",
  xml: "application/xml",
  pdf: "application/pdf",
  zip: "application/zip",
};

export const statusCodes = {
  ok: 200,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  internalServerError: 500,
};

export const URL_SLASH = "/";
export const NAMED_PARAM_TOKEN = ":";
export const CATCH_ALL_TOKEN = "*";

export const STATIC_TYPE = "static";
export const PARAMETER_TYPE = "parameter";
export const CATCH_ALL_TYPE = "catchAll";

export const DEFAULT_PARAMS = {};
