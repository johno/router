# WIP

Descriptions of features that are not yet implemented.

### Transforming route args

If desired, you can transform the route args before they are passed to your handler. This is useful for moving between
edge environments, or if you want to use your own API.

```js
import { Router } from "@johno/router";

const router = new Router({
  transformRouteArgs: (req, res, routeInfo) => {
    return [
      req,
      {
        ...routeInfo,
        params: {
          ...routeInfo.params,
          name: routeInfo.params.name.toUpperCase(),
        },
      },
    ];
  },
});
```

### Composing routers

You can compose routers together to create a single router. This is useful for creating a router that handles multiple versions, resources, or child apps.

```js
import { Router, text } from "@johno/router";

const router = new Router();

const v1 = new Router();
v1.get("/hello", () => {
  text("Hello v1!");
});

const v2 = new Router();
v2.get("/hello", () => {
  text("Hello v2!");
});

router.mount("/v1", v1);
router.mount("/v2", v2);
```
