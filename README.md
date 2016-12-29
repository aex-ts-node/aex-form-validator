# node-form-validator [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

[en](./README.en.md)
[中文](./README.md)

> nodejs下面的表单/对象校验器
> 支持一次性配置校验所有的HTTP输入，
> 效率高，返回处理简单，错误信息丰富

## 安装

```sh
$ npm install --save node-form-validator
```

## 说明

nodejs表单/json校验器是一个以校验表单输入/json为主的校验器。只要编写一个非常简单的规则配置，它就可以针对输入的数据批量的进行校验了。

## 配置

nodejs表单/json校验器是由规则驱动的，所以在校验之前需要先写好配置规则。每个配置规则由一个key和一个value组成。

1. key对应于输入时表单的名称或者对象的属性名。
2. value是一个校验规则集合，是用一个javascript对象表示的，它的属性名与属性值是由校验规则规定的。

一个基本的配置对象如下：

```
var config = {
  username: {
    type: 'string',
    required: true,
    maxLength: 30,
    minLength: 20
  },
  password: {
    type: 'string',
    required: true,
    minLength: 6,
    maxLength: 30
  }
};
```


### 校验属性列表

1. type 
  取值类型： String
  表明得校验的数据类型，必填的规则。下面有type的值列表，值必须是列表里的一项。
2. matches
  取值类型： String
  表明当前的待校验值与matches所指定的待校验值完全相等。
3. alias
  取值类型： String
  别名，通过别名可以将命名方法不同的输入数据属性名转化到你自己的命名体系里。
4. name
  取值类型： String
  当规则中包含有matches或者alias时，必须填写name。name是共用的属性，可见matches与alias不能同时使用。
5. required
  取值类型： Boolean
  * true: 表明当前属性必须有数据
  * false: 默认值，充值当前属性为空
6. minLength
  取值类型： Number
  字符串的最小长度，只在type类型为String/Text时有效
7. maxLength
  取值类型： Number
  字符串的最大长度，只在type类型为String/Text时有效
8. locale
  取值类型： Locale
  由语言编码+区域格式的语言标签(Language Tag)指定，比如<code>zh-CN</code>, <code>en-US</code>，<code>zh-HK</code>,
  <code>en-GB</code>. 
  参考：
    [https://tools.ietf.org/html/rfc5646](https://tools.ietf.org/html/rfc5646)
    [https://www.w3.org/International/questions/qa-choosing-language-tags](https://www.w3.org/International/questions/qa-choosing-language-tags)
    
9. validate
  取值类型： Object
  只在type是<code>object</code>时有效，表明你需要校验子元素

10. ignore
  取值类型： Boolean
  * true: 表明忽略当前的参数的值
  * false: 无意义，可直接取消ignore字段  
  
> matches与alias不能同时使用。


### type类型

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
  'bool'
  'float'
  'uuid'
  'date'
  'json'
  'creditcard'
  'isbn'
  'phone'
  'ascii'
  'multibyte'
  'time',
  'enum',
  'array',  // array [1, 2, 3, 4]
  'string', // no more than 256 chars
  'text',   // unlimited chars
  'object'  // have children
```

## 用法

### 定义一个配置

```js
    //Validate
    var conf = {
      password: {
        type: 'string',
        minLength: 3,
        maxLength: 64,
        required: true
      },
      children: {
        type: 'object',   //children enabled
        validate: {
          child1: {
            type: 'string'
          },
          child2: {
            type: 'phone'
          },
          child3: {
            type: 'object', //children enabled
            validate: {
              ...
            }
          }
        }
      }
    };
    var dataToBeExtracted = {
      password: 'sfdo@sdfosfod',
      children: {
        child1: 'hell',
        child2: '13923213239',
        child3: {}
      }
    };
```

### 引入模块

```js
var validator = require('node-form-validator');

var error = {};
```


####  直接检验结果

```js
  //Errors reported
var error = validator.validate(data, conf);
if (!error) {
  return false;            // error 为 false时，表示没有校验行为
}
assert(error.code ==== 0)  // code为0表示成功, code为-1表示失败
error.message              // message是成功或者失败的消息
error.data                 // error.data是根据配置抽取出来的数据，是过滤过的数据
  
```

#### 支持基于规则抽取对象

```js
var extracted = validator.extract(data, confs);
```

#### 支持作为express的中间件

```js
express.use(validator.asConnect);

express.get('/', function(req, res) {
req.validate
req.extract
});

```


## License

MIT © [calidion](blog.3gcnbeta.com)


[npm-image]: https://badge.fury.io/js/node-form-validator.svg
[npm-url]: https://npmjs.org/package/node-form-validator
[travis-image]: https://travis-ci.org/calidion/node-form-validator.svg?branch=master
[travis-url]: https://travis-ci.org/calidion/node-form-validator
[daviddm-image]: https://david-dm.org/calidion/node-form-validator.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/calidion/node-form-validator
[coveralls-image]: https://coveralls.io/repos/calidion/node-form-validator/badge.svg
[coveralls-url]: https://coveralls.io/r/calidion/node-form-validator
