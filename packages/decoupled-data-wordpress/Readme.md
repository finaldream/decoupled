# decoupled-data-wordpress

Wordpress API data-source for decoupled and general usage.

Fetch data from WordPress RESTful API

## Features

## Use-cases

* Allow Decoupled to use Wordpress API as RESTful data source

## Usage

In `config/SITE/router.js` use:

```js
import { decoupledWordpressHandler } from 'decoupled-data-wordpress';

module.exports.router = {
    routes: [
        {
            method: 'GET',
            route: '(.*)',
            handler: decoupledWordpressHandler,
        },
    ]
};
```
