var assert = require('chai').assert;
var chainBuilder = require('chainbuilder');
var sinon = require('sinon');

describe('chainbuilder-retry', function () {
  describe('#$beginRetry(),#$endRetry()', function () {
    it('retries the subchain until a successful response is achieved', function (done) {
      var i = 0;
      var previousResults = [];
      var failOnFirst3Calls = sinon.spy(function (done) {
        previousResults.push(this.previousResult());
        if (i++ < 3) throw new Error('BANG');
        done(null, 'foo');
      });

      var myChain = chainBuilder({
        methods: {
          failOnFirst3Calls: failOnFirst3Calls
        },
        mixins: [
          require('..')({
            retries: 5,
            factor: 1,
            minTimeout: 10,
            maxTimeout: 10
          })
        ]
      });

      // Run the test
      myChain('initialValue')
        .$beginRetry()
          .failOnFirst3Calls()
        .$endRetry()
        .tap(function (err, result) {
          assert.equal(err, null);
          assert.equal(result, 'foo');
          assert.equal(failOnFirst3Calls.callCount, 4);
          assert.deepEqual(previousResults, ['initialValue', 'initialValue', 'initialValue', 'initialValue']);
        })
        .end(done)
    });

    it('lets custom options be passed', function (done) {
      var i = 0;
      var failOnFirst3Calls = sinon.spy(function (done) {
        if (i++ < 3) throw new Error('BANG');
        done(null, 'foo');
      });

      var myChain = chainBuilder({
        methods: {
          failOnFirst3Calls: failOnFirst3Calls
        },
        mixins: [
          require('..')({
            retries: 2,
            factor: 1,
            minTimeout: 10,
            maxTimeout: 10
          })
        ]
      });

      // Run the test
      myChain('initialValue')
        .$beginRetry({ retries: 2 })
          .failOnFirst3Calls()
        .$endRetry()
        .end(function (err, result) {
          assert.equal(err && err.message, 'BANG');
          assert.equal(result, null);
          assert.equal(failOnFirst3Calls.callCount, 3);
          done();
        });
    });
  });

});
