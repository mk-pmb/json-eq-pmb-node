/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX, isAry = Array.isArray,
  equal = require('assert').deepStrictEqual,
  pathLib = require('path'),
  objDive = require('objdive');


function isStr(x, no) { return (((typeof x) === 'string') || no); }
function ifNum(x, d) { return ((x === +x) ? x : d); }

function oneLineJsonify(x) {
  return JSON.stringify(x, null, 1).replace(/\n\s*/g, ' ');
}



EX = function jsonEq(opt) {
  opt = Object.assign({}, EX.defaultOpts, opt);
  var xtKeys = EX.makeKeysExtractor(opt.keys), ref = xtKeys(opt.ref),
    whyNot = opt.whyNot;
  if (isStr(whyNot)) { whyNot = EX['whyNot_' + whyNot]; }
  function chk(x) { return whyNot.call(this, xtKeys(x), ref); }
  return chk;
};


EX.defaultOpts = {
  keys: '',
  whyNot: 'dse',
  slashFile: 'package.json',
};


function identity(x) { return x; }

EX.makeKeysExtractor = function (k) {
  if (!k) { return identity; }
  if (!k.map) { return function (x) { return objDive(x, k); }; }
  return function (x) {
    return k.map(function (p) { return objDive(x, p); });
  };
};


function parseJsonOrRequire(opt, x) {
  if (!isStr(x)) {
    throw new TypeError('Expected either JSON data or a filename');
  }
  var f = false;
  if (x.slice(-1) === '/') {
    if (opt.slashFile) { x += opt.slashFile; }
    f = x;
  }
  if (!f) { try { return { data: JSON.parse(x) }; } catch (ignore) {} }
  f = (f || x).replace(/^file:/, '');
  if (/^\.{1,2}\//.exec(f)) { f = pathLib.resolve(f); }
  return { name: x, data: require(f) };
}


EX.cli = function (opt) {
  opt = Object.assign({}, EX.defaultOpts, EX.defaultCliOpts, opt);
  var candidates = [];

  (function parseCliArgs() {
    var needRef = (opt.ref === undefined);
    process.argv.slice(1).forEach(function (arg) {
      if (!arg) { return; }
      if (arg === '--') { return; }
      arg = parseJsonOrRequire(opt, arg);
      if (needRef) {
        opt.ref = arg.data;
        needRef = false;
        return;
      }
      candidates.push(arg);
    });
  }());

  function chk(cnd, idx) {
    var whyNot = chk.one.call(cnd, cnd.data);
    if (!whyNot) { return true; }
    if (!cnd.name) { cnd.name = '#' + idx; }
    console.log(cnd.name + '\t' + String(whyNot.message || whyNot
      ).replace(/\n\s*/g, ' '));
  }
  chk.one = EX(opt);
  if (candidates.every(chk)) {
    return process.exit(ifNum(opt.rvPass, 0));
  }
  process.exit(ifNum(opt.rvFail, 4));
};


EX.whyNot_dse = function (x, r) {
  try { equal(x, r); } catch (e) { return e; }
};


EX.whyNot_dumpJsonTsv = function (x) {
  var candidate = this;
  console.log([candidate.name
    ].concat([].concat(x).map(oneLineJsonify)
    ).join('\t'));
};


EX.tsv = function (opt) {
  return EX.cli(Object.assign({ ref: { dummy: 123, foo: 'bar' },
    whyNot: 'dumpJsonTsv',
    }, opt));
};












module.exports = EX;
