import './style.css'
import workerUrl from 'worker:./worker';

document.querySelector('#app').innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`

console.log(workerUrl);
new Worker(workerUrl);
