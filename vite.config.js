import * as path from 'path';
import {rollup} from 'rollup';

export default {
  plugins: [
    {
      name: 'my-worker-plugin',
      async resolveId(source, importer) {
        if (!source.startsWith('worker:')) return null;

        const workerId = source.replace('worker:', '');
        const resolvedWorker = await this.resolve(workerId, importer, {
          skipSelf: true,
        });

        if (resolvedWorker == null) return null;

        return `worker:${resolvedWorker.id}`;
      },
      async load(id) {
        if (!id.startsWith('worker:')) return null;

        const workerId = id.replace('worker:', '');

        const bundle = await rollup({
          input: workerId,
        });

        const buildDirectory = path.resolve('dist/workers');

        const result = await bundle.write({
          dir: buildDirectory,
          format: 'iife',
        });

        const firstChunk = result.output.find((output) => output.type === 'chunk');

        for (const module of Object.keys(firstChunk.modules)) {
          console.log(`Watching additional module: ${module}`);
          this.addWatchFile(module);
        }

        return `export default ${JSON.stringify(`/@fs${path.join(buildDirectory, firstChunk.fileName)}`)};`;
      },
    }
  ]
}
