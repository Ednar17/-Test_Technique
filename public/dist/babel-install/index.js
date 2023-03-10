#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _fs = require('fs');
var _fs2 = _interopRequireDefault(_fs);
var _npm = require('npm');
var _npm2 = _interopRequireDefault(_npm);
var _path = require('path');
var _path2 = _interopRequireDefault(_path);
var _yargsParser = require('yargs-parser');
var _yargsParser2 = _interopRequireDefault(_yargsParser);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}
var BabelPrefixes = {
  plugins: 'babel-plugin-',
  presets: 'babel-preset-'
};
var prefixNames = Object.keys(BabelPrefixes);
var eachPrefixName = function eachPrefixName(iter) {
  return prefixNames.forEach(iter);
};
function BabelInstaller() {
  var _this = this;
  var options = arguments.length <= 0 || arguments[0] === undefined ? {
    checkBabelRC: true,
    config: {
      'save-dev': true,
      'save-exact': true
    }
  } : arguments[0];
  if (!(this instanceof BabelInstaller)) return new BabelInstaller(options);
  ['checkBabelRC', 'config'].forEach(function (k) {
    return _this[k] = options[k];
  });
  var args = (0, _yargsParser2.default)(process.argv.slice(2), {
    array: prefixNames
  });
  this.pkgNamesFromCLI = args._;
  eachPrefixName(function (k) {
    var _pkgNamesFromCLI;
    return args[k] && (_pkgNamesFromCLI = _this.pkgNamesFromCLI).push.apply(_pkgNamesFromCLI, _toConsumableArray(args[k].map(function (arg) {
      return '' + BabelPrefixes[k] + arg;
    })));
  });
}
BabelInstaller.prototype.load = function (next) {
  var _this2 = this;
  if (this.loaded) return next();
  _npm2.default.load(function (error) {
    if (!error) {
      Object.keys(_this2.config).forEach(function (k) {
        return _npm2.default.config.set(k, _this2.config[k]);
      });
      _this2.loaded = true;
    }
    return next(error);
  });
  return this;
};
BabelInstaller.prototype.babelNameForField = function (packageName, field) {
  var semverMatcher = /@[a-z0-9.-]+$/i;
  var prefix = BabelPrefixes[field];
  if (!prefix) throw new ReferenceError(field + ' is an invalid .babelrc field name');
  return packageName.replace(semverMatcher, '').replace(prefix, '');
};
BabelInstaller.prototype.saveToBabel = function (names) {
  var _this3 = this;
  var fileName = '.babelrc';
  return writeJSON(fileName, names.reduce(function (babelrc, name) {
    var field = undefined;
    eachPrefixName(function (prfx) {
      return name.indexOf(BabelPrefixes[prfx]) === 0 && (field = prfx);
    });
    babelrc[field] || (babelrc[field] = []);
    var savableName = _this3.babelNameForField(name, field);
    if (babelrc[field].indexOf(savableName) !== -1) {
      console.error(savableName + ' (' + name + ') was already saved to ' + fileName);
    } else {
      babelrc[field].push(savableName);
    }
    return babelrc;
  }, readJSON(fileName)));
};
BabelInstaller.prototype.installAndDeclare = function (names, next) {
  var _this4 = this;
  typeof names === 'function' && (next = names) && (names = this.pkgNamesFromCLI);
  if (!names.length) {
    throw new Error('We need some package names in order to install anything dudette (or dude)!');
  }
  var nameMapper = function nameMapper(name) {
    return name.indexOf('@') !== -1 ? name : name + '@latest';
  };
  return this.load(function (loadError) {
    if (loadError) return console.error(loadError);
    return _npm2.default.commands.install(names.map(nameMapper), function (installError) {
      if (!installError) {
        _this4.saveToBabel(names);
        Object.keys(_this4.config).forEach(function (k) {
          return _npm2.default.config.set(k, undefined);
        });
      }
      return next ? next(installError) : console.error(installError);
    });
  });
};

// Declared but uninstalled plugins & transforms
BabelInstaller.prototype.getUninstalled = function () {
  var babelrc = readJSON('.babelrc');
  var devDeps = readJSON('package.json').devDependencies;
  var missingPackages = [];
  eachPrefixName(function (prfx) {
    babelrc[prfx] && babelrc[prfx].forEach(function (shortName) {
      var fullName = ('' + babelrc[prfx] + shortName)(fullName in devDeps) && missingPackages.push(fullName);
    });
  });
  return missingPackages;
};
BabelInstaller.prototype.smartNames = function () {
  return this.pkgNamesFromCLI.concat(this.checkBabelRC ? this.getUninstalled() : []);
};
function prependCwd(fileName) {
  return _path2.default.join(process.cwd(), fileName);
}
function readJSON(fileName) {
  return JSON.parse(_fs2.default.readFileSync(prependCwd(fileName), 'utf8'));
}
function writeJSON(fileName, json) {
  var string = JSON.stringify(json, null, 2) + '\n';
  return _fs2.default.writeFileSync(prependCwd(fileName), string, 'ascii');
}

// CLI up
if (!module.parent) {
  BabelInstaller().installAndDeclare(function (installError) {
    return installError ? console.error(installError) : console.info('Install succeeded');
  });
}
exports.default = BabelInstaller;
module.exports = exports['default'];