# router

A miniaturized (and fast af) router for the edge, and everywhere else.

```js
import { Router, text, json } from "@johno/router";

const router = new Router();

router
  .get("/", (req) => text("Hello world!"))
  .get("/hello/:name", (req, env, ctx, routeInfo) => {
    json({ name: routeInfo.params.name });
  });
```

## Features

- Simple, declarative API
- Built for the edge
- Standards-based (Request/Response/URL)
- Zero dependencies
- Tiny footprint
- ESM-only
- Written in TypeScript

## Motivation

`@johno/router` is built for edge environments including Cloudflare Workers, Lambda, Netlify Functions, Next.js, etc.
What makes `@johno/router` interesting is what it doesn't do.

**`@johno/router` _does not_:**

- Monkey patch the global `Request` and `Response` objects
- Route match with regex, it uses a custom parser
- Implement a bespoke handler API
- Use middleware, we recommend using lib functions
- Minify or obfuscate code (readable and debuggable output)

## Handler API

`@johno/router` uses a simple handler API that is compatible with the [Request][] and [Response][] objects. It _augments_
edge function handlers with an additional argument, `routeInfo`. This means you can drop in `@johno/router` to any serverless
function environment and you will work with their existing APIs.

## TODO

`@johno/router` is a work in progress. Here are some additional features that are planned:

- [x] Named path params
- [x] Wildcard (catchall) routes
- [ ] Query params
- [ ] Base URL config
- [ ] Transform route args
- [ ] JSDoc comments

## Installation

Use your favorite package manager to install `@johno/router`:

```sh
npm install @johno/router

# pnpm add @johno/router
# yarn add @johno/router
# bun add @johno/router
```

## Usage

```js
import { Router, text } from "@johno/router";

const router = new Router();

router.get("/", (req, res) => {
  text("Hello world!");
});

router.get("/hello/:name", (req, res, routeInfo) => {
  text(`Hello ${routeInfo.params.name}!`);
});
```

## Development

To learn about how to contribute to this project, please read the [contributing guide](.github/contributing.md).

---

> Built by [johno](https://johno.com)
