"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.UploadDragger = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _Upload = _interopRequireWildcard(require("./Upload"));
var _Dragger = _interopRequireDefault(require("./Dragger"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/* istanbul ignore next */
const UploadDragger = exports.UploadDragger = _Dragger.default;
var _default = exports.default = (0, _extends2.default)(_Upload.default, {
  Dragger: _Dragger.default,
  LIST_IGNORE: _Upload.LIST_IGNORE,
  install(app) {
    app.component(_Upload.default.name, _Upload.default);
    app.component(_Dragger.default.name, _Dragger.default);
    return app;
  }
});