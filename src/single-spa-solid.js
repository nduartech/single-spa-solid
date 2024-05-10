const defaultOpts = {
  // required opts
  solid: null,
  rootComponent: null,

  // optional opts
  domElementGetter: null,
};

export default function singleSpaSolid(userOpts: any) {
  if (typeof userOpts !== "object") {
    throw new Error(`single-spa-solid requires a configuration object`);
  }

  const opts = {
    ...defaultOpts,
    ...userOpts,
  };

  if (!opts.solid) {
    throw new Error(`single-spa-solid must be passed opts.solid`);
  }

  if (!opts.rootComponent) {
    throw new Error(`single-spa-solid must be passed opts.rootComponent`);
  }

  return {
    bootstrap: bootstrap.bind(null, opts),
    mount: mount.bind(null, opts),
    unmount: unmount.bind(null, opts),
  };
}

function bootstrap(opts: any) {
  return Promise.resolve();
}

function mount(opts: any, props: any) {
  return new Promise<void>((resolve, reject) => {
    const domElementGetter = chooseDomElementGetter(opts, props);

    if (typeof domElementGetter !== "function") {
      throw new Error(
        `single-spa-solid: the domElementGetter for solid application '${
          props.appName || props.name
        }' is not a function`
      );
    }

    opts.renderedNode = opts.solid.render(
      () => opts.rootComponent(props),
      getRootDomEl(domElementGetter, props)
    );

    resolve();
  });
}

function unmount(opts: any, props: any) {
  return new Promise<void>((resolve, reject) => {
    const domElementGetter = chooseDomElementGetter(opts, props);

    opts.solid.render(
      () => null, // equivalent to empty component
      getRootDomEl(domElementGetter, opts),
      opts.renderedNode
    );

    delete opts.renderedNode;

    resolve();
  });
}

function getRootDomEl(domElementGetter: any, props: any) {
  const el = domElementGetter(props);

  if (!el) {
    throw new Error(
      `single-spa-solid: domElementGetter function did not return a valid dom element`
    );
  }

  return el;
}

function chooseDomElementGetter(opts: any, props: any) {
  if (props.domElement) {
    return () => props.domElement;
  } else if (props.domElementGetter) {
    return props.domElementGetter;
  } else if (opts.domElementGetter) {
    return opts.domElementGetter;
  } else {
    return defaultDomElementGetter(props);
  }
}

function defaultDomElementGetter(props: any) {
  const appName = props.appName || props.name;
  if (!appName) {
    throw Error(
      `single-spa-solid was not given an application name as a prop, so it can't make a unique dom element container for the solid application`
    );
  }
  const htmlId = `single-spa-application:${appName}`;

  return function defaultDomEl() {
    let domElement = document.getElementById(htmlId);
    if (!domElement) {
      domElement = document.createElement("div");
      domElement.id = htmlId;
      document.body.appendChild(domElement);
    }

    return domElement;
  };
}
