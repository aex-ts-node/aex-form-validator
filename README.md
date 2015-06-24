#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> form,validator,node,json,object


## Install

```sh
$ npm install --save node-form-validator
```


## Usage

```js
var validator = require('node-form-validator');

    var conf = {
      signature: {
        type: 'string',
        minLength: 3,
        maxLength: 64,
        required: true
      },

      timestamp: {
        type: 'string',
        minLength: 3,
        maxLength: 64,
        required: true
      },
      nonce: {
        type: 'string',
        required: true
      },
      echostr: {
        type: 'string',
        required: true
      }
    };
    validator.validate(conf, data, error)) {
```

```sh
# creates a browser.js
$ npm run browser
```


## License

MIT © [calidion](blog.3gcnbeta.com)


[npm-image]: https://badge.fury.io/js/node-form-validator.svg
[npm-url]: https://npmjs.org/package/node-form-validator
[travis-image]: https://travis-ci.org/JSSDKCN/node-form-validator.svg?branch=master
[travis-url]: https://travis-ci.org/JSSDKCN/node-form-validator
[daviddm-image]: https://david-dm.org/JSSDKCN/node-form-validator.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/JSSDKCN/node-form-validator
