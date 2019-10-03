# decoupled-data-json

JSON data-source for decoupled

## Usage

In `config/SITE/router.js` use:

```js
import { decoupledJsonHandler } from 'decoupled-data-json';

module.exports.router = {
    routes: [
        {
            method: 'GET',
            route: '(.*)',
            handler: decoupledJsonHandler,
        },
    ]
};
```
