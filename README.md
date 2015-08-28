#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> form,validator,node,json,object


## Install

```sh
$ npm install --save node-form-validator
```


## Supported types

```js
  'email'
  'url'
  'fqdn'
  'ip'
  'alpha'
  'numeric'
  'alphanumeric'
  'base64'
  'hexadecimal'
  'hexcolor'
  'int'
  'float'
  'uuid'
  'date'
  'json'
  'creditcard'
  'isbn'
  'phone'
  'ascii'
  'multibyte'
  'time'
  'string': no more than 256 chars
  'text': no more than 65536 chars
```

## Usage



```js
var validator = require('node-form-validator');

    //Validate
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

    validator.validate(conf, data, error));
    
    //Extract 
      var req1 = {
        'k1': '13181715210',
        'k2': '13181715210',
        'k3': 'http://www.sina.com',
        'k5': '10:00',
        'k6': '24:00',
        'k7': '00:19',
        'k8': '19:59',
        'k9': '24:00:00',
        'k10': '23:59:59',
        'k11': '1:19',
        'k12': '1:00'
      };
      var confs = {
        k1: {
          alias: 'phone',
          type: 'phone',
          locale: 'zh-CN'

        },
        k2: {
          matches: 'k1'
        },
        k3: {
          type: 'url'
        },
        k4: {
          type: 'time'
        }
      };
      var validator = filter.json;
      var data = validator.extract(req1, confs);
    
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
