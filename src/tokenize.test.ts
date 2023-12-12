import { test, expect } from "bun:test";

import { tokenize } from "./tokenize";

test("tokenizes a static route", () => {
  expect(tokenize("/test")).toEqual([{ type: "static", value: "test" }]);
});

test("tokenizes a route with a named parameter", () => {
  expect(tokenize("/:test")).toEqual([{ type: "parameter", value: "test" }]);
});

test("tokenizes a route with a catch-all parameter", () => {
  expect(tokenize("/*")).toEqual([{ type: "catchAll", value: "*" }]);
});

test("tokenizes a route with multiple parameters", () => {
  expect(tokenize("/:test/:another")).toEqual([
    { type: "parameter", value: "test" },
    { type: "parameter", value: "another" },
  ]);
});

test("tokenizes a route with multiple parameters and a catch-all", () => {
  expect(tokenize("/:test/:another/*")).toEqual([
    { type: "parameter", value: "test" },
    { type: "parameter", value: "another" },
    { type: "catchAll", value: "*" },
  ]);
});

test("tokenizes a route with a static segment after a parameter", () => {
  expect(tokenize("/:test/static")).toEqual([
    { type: "parameter", value: "test" },
    { type: "static", value: "static" },
  ]);
});

test("tokenizes a route with multiple static segments wrapping a parameter", () => {
  expect(tokenize("/another/:test/here")).toEqual([
    { type: "static", value: "another" },
    { type: "parameter", value: "test" },
    { type: "static", value: "here" },
  ]);
});
