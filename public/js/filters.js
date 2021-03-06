'use strict';

var Amount = ripple.Amount;

/* Filters */
var module = angular.module('myApp.filters', []);

module.filter('interpolate', ['version', function(version) {
  return function(text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  };
}]);

module.filter('rpcurr', [function () {
  return function (input, opts) {
    if (opts === "XRP") {
      input = Math.floor(input * 1000000) / 1000000;
      input = ""+input;
      if (input.indexOf('.') === -1) input += ".0";
      return ripple.Amount.from_json(""+input);
    } else {
      return ripple.Amount.from_json(""+input+"/"+opts);
    }
  };
}]);

/**
 * Format a ripple.Amount.
 *
 * If the parameter is a number, the number is treated the relative 
 */
module.filter('rpamount', function () {
  return function (input, opts) {
    if ("number" === typeof opts) {
      opts = {
        rel_min_precision: opts
      };
    } else if ("object" !== typeof opts) {
      opts = {};
    }

    if (!input) return "n/a";

    var amount = Amount.from_json(input);
    if (!amount.is_valid()) return "n/a";

    // Currency default precision
    var currency = iso4217[amount.currency().to_json()];
    var cdp = ("undefined" !== typeof currency) ? currency[1] : 2;

    // Certain formatting options are relative to the currency default precision
    if ("number" === typeof opts.rel_precision) {
      opts.precision = cdp + opts.rel_precision;
    }
    if ("number" === typeof opts.rel_min_precision) {
      opts.min_precision = cdp + opts.rel_min_precision;
    }

    // If no precision is given, we'll default to max precision.
    if ("number" !== typeof opts.precision) {
      opts.precision = 16;
    }

    var out = amount.to_human(opts);

    return out;
  };
});

module.filter('rpdate', [function() {
  return function(text) {
    return text && moment(+text).format('MMM Do YYYY, h:mm:ss a');
  };
}]);

module.filter('rpago', [function() {
  return function(text) {
    return text && moment(+text).fromNow();
  };
}]);
