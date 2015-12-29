# chainbuilder-retry [![Build Status](https://travis-ci.org/andrewpmckenzie/chainbuilder-retry.svg)](https://travis-ci.org/andrewpmckenzie/chainbuilder-retry)

A [retry](https://github.com/tim-kos/node-retry) mixin for [chainbuilder](https://www.npmjs.com/package/chainbuilder). 

**Installation** `npm install chainbuilder chainbuilder-retry --save`

**Usage**  
```javascript
var chainBuilder = require('chainbuilder');

var myChain = chainBuilder({
  methods: {/* ... your methods ... */},
  mixins: [
    /* ... other mixins ... */
    require('chainbuilder-retry')({ attempts: 5, maxTimeout: 100 })
  ]
});
```

**Example**  
Will retry the `myMethodTwo().myMethodThree()` chain up to two times until no error is received. `myMethodTwo()` will have
access to the result of `myMethodOne()` (via `previousResult()`), and `myMethodFour()` will have access to the result of 
`myMethodThree()`.  

```javascript
myChain()
  .myMethodOne()
  .$beginRetry({ attempts: 2 }}
    .myMethodTwo()
    .myMethodThree()
  .$endRetry()
  .myMethodFour()
```

## Methods

#### require('chainbuilder-retry')(options)
Init the mixin with default options.

**`@param {Object} options`** (optional) default [retry](https://github.com/tim-kos/node-retry) options.

#### $beginRetry(options)
Begin a retry block.

**`@param {Object} options`** (optional) retry options for this block.

#### $endRetry()
End a retry block.
