import { test, expect } from "bun:test";

import { parse } from "./parse";

test("parses a static route", () => {
  const result = parse("/test");

  expect(result).toEqual({
    raw: "/test",
    parsed: [{ type: "static", value: "test" }],
    matchParams: expect.any(Function),
    isMatch: expect.any(Function),
  });

  expect(result.matchParams("/test")).toEqual({});
  expect(result.isMatch("/test")).toEqual(true);
  expect(result.isMatch("/test/bar")).toEqual(false);
});

test("parses a route with a named parameter", () => {
  const result = parse("/foo/:bar");

  expect(result).toEqual({
    raw: "/foo/:bar",
    parsed: [
      { type: "static", value: "foo" },
      { type: "parameter", value: "bar" },
    ],
    matchParams: expect.any(Function),
    isMatch: expect.any(Function),
  });

  expect(result.matchParams("/foo/test")).toEqual({ bar: "test" });
  expect(result.isMatch("/foo/test")).toEqual(true);
  expect(result.isMatch("/foo")).toEqual(false);
});

test("parses a route with a catch all", () => {
  const result = parse("/foo/*");

  expect(result).toEqual({
    raw: "/foo/*",
    parsed: [
      { type: "static", value: "foo" },
      { type: "catchAll", value: "*" },
    ],
    matchParams: expect.any(Function),
    isMatch: expect.any(Function),
  });

  expect(result.matchParams("/foo/test")).toEqual({});
  expect(result.isMatch("/foo/test/bar")).toEqual(true);
  expect(result.isMatch("/foo")).toEqual(true);
});

test("parses a route with a named parameter and ignores trailing slashes", () => {
  const result = parse("/foo/:bar");

  expect(result).toEqual({
    raw: "/foo/:bar",
    parsed: [
      { type: "static", value: "foo" },
      { type: "parameter", value: "bar" },
    ],
    matchParams: expect.any(Function),
    isMatch: expect.any(Function),
  });

  expect(result.matchParams("/foo/test/")).toEqual({ bar: "test" });
  expect(result.isMatch("/foo/test/")).toEqual(true);
  expect(result.isMatch("/foo")).toEqual(false);
});
