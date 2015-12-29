var retry = require('retry');

module.exports = function (superOptions) {

  var $beginRetry = function (options, done) {
    if (!done) {
      done = options;
      options = {};
    }

    done(null, {
      value: this.previousResult(),
      options: options
    });
  };

  var $endRetry = function (subchain, done) {
    var fromBegin = this.previousResult();
    var instanceOptions = fromBegin.options;
    var value = fromBegin.value;

    var extendedOptions = {}, k;
    for (k in superOptions) if (superOptions.hasOwnProperty(k)) extendedOptions[k] = superOptions[k];
    for (k in instanceOptions) if (instanceOptions.hasOwnProperty(k)) extendedOptions[k] = instanceOptions[k];

    var operation = retry.operation(extendedOptions);
    operation.attempt(function () {
      subchain.run(value, function (err, result) {
        if (operation.retry(err)) return;
        done(err ? operation.mainError() : null, result);
      });
    });
  };

  $beginRetry.$beginSubchain = 'retry';
  $endRetry.$endSubchain = 'retry';

  return {
    $beginRetry: $beginRetry,
    $endRetry: $endRetry
  };
};
