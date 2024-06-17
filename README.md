# single-spa-solid (inspired by single-spa-preact)

https://www.npmjs.com/package/@nathanld/single-spa-solid

Generic lifecycle hooks for Solid applications that are registered as [applications](https://github.com/single-spa/single-spa/blob/master/docs/applications.md#registered-applications) of [single-spa](https://github.com/single-spa/single-spa).

[Full documentation for Preact](https://single-spa.js.org/docs/ecosystem-preact.html)

Instead of:

```
import preact from "preact";
import rootComponent from "./path-to-root-component.js";
import singleSpaPreact from "single-spa-preact";

const preactLifecycles = singleSpaPreact({
preact,
rootComponent,
domElementGetter: () => document.getElementById("main-content"),
});

export const bootstrap = preactLifecycles.bootstrap;
export const mount = preactLifecycles.mount;
export const unmount = preactLifecycles.unmount;
```

do something like:

```
import App from "./App";
import { render } from 'solid-js/web';
import singleSpaSolid from '@nathanld/single-spa-solid';

const solidLifecycles = singleSpaSolid({
    solid: {render: render},
    rootComponent: App,
    domElementGetter: () => document.getElementById('root')
});


export const bootstrap = solidLifecycles.bootstrap;
export const mount = solidLifecycles.mount;
export const unmount = solidLifecycles.unmount;
```
