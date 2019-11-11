// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js.js":[function(require,module,exports) {
var cellSize = 30;
var cells = [];
var colors = ['blue', 'green', 'red', 'navy', 'black', 'orange'];
document.addEventListener("DOMContentLoaded", function (event) {
  var game = document.querySelector(".game");
  var w = game.offsetWidth;
  var h = game.offsetHeight;
  var cols = ~~(w / cellSize);
  var rows = ~~(h / cellSize);
  var NUM_BOMBS = 100;

  iterate = function iterate(callback) {
    for (var x = 0; x < rows; x++) {
      for (var y = 0; y < cols; y++) {
        callback(x, y);
      }
    }
  };

  function shuffle(array) {
    array.sort(function () {
      return Math.random() - 0.5;
    });
  }

  initCells = function initCells() {
    iterate(function (x, y) {
      var c = document.createElement("button");
      c.className = "cella";
      game.appendChild(c);
      if (!cells[x]) cells[x] = [];
      cells[x][y] = {
        x: x,
        y: y,
        node: c
      };
    });
  };

  restart = function restart() {
    iterate(function (x, y) {
      var cell = cells[x][y];
      cell.node.textContent = "";
      cell.visited = false;
      cell.isBomb = false;
    });

    for (var i = 0; i < NUM_BOMBS; i++) {
      var element = NUM_BOMBS[i];
      var bombCell = cells[~~(Math.random() * rows)][~~(Math.random() * cols)];
      bombCell.isBomb = true;
    }

    iterate(function (x, y) {
      var cell = cells[x][y];
      if (x > 0 && y > 0) cell.nw = cells[x - 1][y - 1];
      if (x > 0) cell.n = cells[x - 1][y];
      if (x > 0 && y < cols - 1) cell.ne = cells[x - 1][y + 1];
      if (y > 0) cell.w = cells[x][y - 1];
      if (y < cols - 1) cell.e = cells[x][y + 1];
      if (x < rows - 1 && y > 0) cell.sw = cells[x + 1][y - 1];
      if (x < rows - 1) cell.s = cells[x + 1][y];
      if (x < rows - 1 && y < cols - 1) cell.se = cells[x + 1][y + 1];
      var count = 0;
      if (cell.n && cell.n.isBomb) count++;
      if (cell.e && cell.e.isBomb) count++;
      if (cell.s && cell.s.isBomb) count++;
      if (cell.w && cell.w.isBomb) count++;
      if (cell.nw && cell.nw.isBomb) count++;
      if (cell.ne && cell.ne.isBomb) count++;
      if (cell.sw && cell.sw.isBomb) count++;
      if (cell.se && cell.se.isBomb) count++;
      cell.count = count;

      cell.node.onclick = function () {
        return discover(cell);
      };

      cell.node.oncontextmenu = function (e) {
        e.preventDefault();
        flag(cell);
      }; // cell.node.oncontextmenu = (() => { return () => flag(cell) })(cell);

    });
    render();
  };

  flag = function flag(cell) {
    cell.node.textContent = '🎅🏿';
  };

  render = function render() {
    iterate(function (x, y) {
      var cell = cells[x][y];
      cell.node.style.background = "#333";
    });
  };

  discover = function (_discover) {
    function discover(_x, _x2) {
      return _discover.apply(this, arguments);
    }

    discover.toString = function () {
      return _discover.toString();
    };

    return discover;
  }(function (cell, color) {
    var currentCell = cell;

    if (currentCell.isBomb) {
      iterate(function (x, y) {
        var c = cells[x][y];

        if (c.isBomb) {
          c.node.style.backgroundColor = "green";
          c.node.textContent = "💣";
        }
      });
      console.log('😿');
      setTimeout(function () {
        restart();
        render();
      }, 3000);
      return;
    }

    if (currentCell.visited) return;
    currentCell.node.style.background = "#ddd";

    if (currentCell.count != 0) {
      currentCell.node.textContent = currentCell.count;
      currentCell.node.style.color = colors[currentCell.count - 1];
      return;
    }

    currentCell.visited = true;
    if (currentCell.n) discover(currentCell.n, "green");
    if (currentCell.e) discover(currentCell.e, "gold");
    if (currentCell.s) discover(currentCell.s, "aquamarine");
    if (currentCell.w) discover(currentCell.w, "purple");
    if (currentCell.ne) discover(currentCell.ne, "green");
    if (currentCell.nw) discover(currentCell.nw, "green");
    if (currentCell.sw) discover(currentCell.sw, "aquamarine");
    if (currentCell.se) discover(currentCell.se, "aquamarine");
  });

  initCells();
  restart();
  render();
});
},{}],"../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50360" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js.js"], null)
//# sourceMappingURL=/js.00934245.js.map