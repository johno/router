import { test, expect, beforeEach } from "bun:test";

import { Router, json } from "./router";

let router: Router;

beforeEach(() => {
  router = new Router();
});

test("routes to a path", async () => {
  router.get("/test", async () => new Response("test"));

  const response = await router.handle(
    new Request("https://example.com/test"),
    {} as any,
    {} as any
  );

  expect(await response.text()).toEqual("test");
});

test("returns a 404 for a missing path", async () => {
  const response = await router.handle(
    new Request("https://example.com/missing"),
    {} as any,
    {} as any
  );

  expect(response.status).toEqual(404);
});

test("returns a 405 for a missing method", async () => {
  router.get("/test", async () => new Response("test"));

  const response = await router.handle(
    new Request("https://example.com/test", { method: "POST" }),
    {} as any,
    {} as any
  );

  expect(response.status).toEqual(405);
});

test("returns a 500 for an error", async () => {
  router.get("/test", async () => {
    throw new Error("test");
  });

  const response = await router.handle(
    new Request("https://example.com/test"),
    {} as any,
    {} as any
  );

  expect(response.status).toEqual(500);
});

test("sets headers and stringifies a JSON response", async () => {
  router.get("/test", async () => json({ test: true }));

  const response = await router.handle(
    new Request("https://example.com/test"),
    {} as any,
    {} as any
  );

  const result = await response.json();

  expect(response.headers.get("content-type")).toEqual("application/json");
  expect(result).toEqual({ test: true });
});

test("handles CORS preflight requests", async () => {
  router.get("/test", async () => new Response("test"));

  const response = await router.handle(
    new Request("https://example.com/test", {
      method: "OPTIONS",
      headers: {
        Origin: "https://example.com",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "Content-Type",
      },
    }),
    {} as any,
    {} as any
  );

  expect(response.status).toEqual(204);
  expect(response.headers.get("access-control-allow-origin")).toEqual("*");
  expect(response.headers.get("access-control-allow-methods")).toEqual(
    "GET, POST, DELETE"
  );
  expect(response.headers.get("access-control-allow-headers")).toEqual(
    "Content-Type"
  );
});

test("matches HTTP methods", async () => {
  router.get("/test", async () => new Response("test GET"));
  router.post("/test", async () => new Response("test POST"));
  router.delete("/test", async () => new Response("test DELETE"));

  const getResponse = await router.handle(
    new Request("https://example.com/test"),
    {} as any,
    {} as any
  );
  const postResponse = await router.handle(
    new Request("https://example.com/test", { method: "POST" }),
    {} as any,
    {} as any
  );
  const deleteResponse = await router.handle(
    new Request("https://example.com/test", { method: "DELETE" }),
    {} as any,
    {} as any
  );

  expect(await getResponse.text()).toEqual("test GET");
  expect(await postResponse.text()).toEqual("test POST");
  expect(await deleteResponse.text()).toEqual("test DELETE");
});

test("passes route params to the handler", async () => {
  router.get("/test/:id", async (_request, _env, _ctx, routeInfo) =>
    json(routeInfo?.params ?? {})
  );

  const response = await router.handle(
    new Request("https://example.com/test/123"),
    {} as any,
    {} as any
  );

  const result = await response.json();

  expect(result).toEqual({ id: "123" });
});

test("ignores duplicate and trailing slashes", async () => {
  router.get("/test///foo/", async (_request, _env, _ctx) =>
    json({ hello: "world" })
  );

  const response = await router.handle(
    new Request("https://example.com/test/foo"),
    {} as any,
    {} as any
  );

  const result = await response.json();

  expect(result).toEqual({ hello: "world" });
});
