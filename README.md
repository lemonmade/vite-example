# Vite does not handle `this.watchFile()` as expected

This repo demonstrates that `this.watchFile()` doesn’t work as expected in a situation where we replace a module with content that isn’t directly tied to the module itself.

In this example, I am building a rollup plugin that will create a separate worker bundle from every import specifier with a `worker:` import specifier prefix (e.g., `import workerUrl from 'worker:./worker';`). The import itself will be replaced with a URL that references a built file in the file system, since I can’t use `emitFile()` (I need different output settings) — in the example as written, the import is turned into `/@fs/.../dist/workers/worker.js`. I call `this.addWatchFile()` for each file that was part of the resulting build.

> Note: I know Vite supports workers, but that support is very limited and not sufficient for my use case.

If you run `yarn && yarn dev`, `localhost:3000` will have the basic Vite landing page with the addition of logging the worker URL and initializing the worker from it. This works as expected, but when you edit `worker.js` (the source file for the worker), the change is never actually built until you restart the server. I would have expected the changes in the worker to invalidate `worker:./worker.js`, causing my `load()` plugin to be run again.
