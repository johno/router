import { test, expect } from "bun:test";

import { cleanURLPath, getRequestPath, getURLPath } from "./util";

test("cleanURLPath removes trailing slashes", () => {
  expect(cleanURLPath("/test/")).toEqual("/test");
});

test("cleanURLPath removes duplicate slashes", () => {
  expect(cleanURLPath("/test//foo")).toEqual("/test/foo");
});

test("cleanURLPath removes trailing slashes and duplicate slashes", () => {
  expect(cleanURLPath("/test//foo/")).toEqual("/test/foo");
});

test("cleanURLPath does not remove a single slash", () => {
  expect(cleanURLPath("/")).toEqual("/");
});

test("getRequestPath returns the pathname from a Request", () => {
  const request = new Request("https://example.com/test");

  expect(getRequestPath(request)).toEqual("/test");
});

test("getURLPath returns the pathname from a string", () => {
  expect(getURLPath("https://example.com/test")).toEqual("/test");
});

test("getURLPath returns the pathname from a string with a path", () => {
  expect(getURLPath("/test")).toEqual("/test");
});

test("getURLPath returns the pathname from a string with a path and query", () => {
  expect(getURLPath("/test?foo=bar")).toEqual("/test?foo=bar");
});

test("getURLPath returns the pathname from a string with a path and hash", () => {
  expect(getURLPath("/test#foo")).toEqual("/test#foo");
});

test("getURLPath returns the pathname from a string with a path, query, and hash", () => {
  expect(getURLPath("/test?foo=bar#baz")).toEqual("/test?foo=bar#baz");
});
