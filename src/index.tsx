import 'core-js';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';
import './index.css';


ReactDOM.render(
  <App/>,
  document.getElementById('root') as HTMLElement
);

console.info("App is running from a "+process.env.NODE_ENV+" build");


let dev_override = true;
if (process.env.NODE_ENV === "production" || dev_override) {
  console.info("Service Worker will be registered if not already");
  serviceWorker.register();
}
else serviceWorker.unregister();
