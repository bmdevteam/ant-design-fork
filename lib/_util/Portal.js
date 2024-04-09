"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _vueTypes = _interopRequireDefault(require("./vue-types"));
var _context = require("../vc-trigger/context");
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Portal',
  inheritAttrs: false,
  props: {
    getContainer: _vueTypes.default.func.isRequired,
    didUpdate: Function
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    let isSSR = true;
    // getContainer 不会改变，不用响应式
    let container;
    const {
      shouldRender
    } = (0, _context.useInjectPortal)();
    function setContainer() {
      if (shouldRender.value) {
        container = props.getContainer();
      }
    }
    (0, _vue.onBeforeMount)(() => {
      isSSR = false;
      // drawer
      setContainer();
    });
    (0, _vue.onMounted)(() => {
      if (container) return;
      // https://github.com/vueComponent/ant-design-vue/issues/6937
      setContainer();
    });
    const stopWatch = (0, _vue.watch)(shouldRender, () => {
      if (shouldRender.value && !container) {
        container = props.getContainer();
      }
      if (container) {
        stopWatch();
      }
    });
    (0, _vue.onUpdated)(() => {
      (0, _vue.nextTick)(() => {
        var _a;
        if (shouldRender.value) {
          (_a = props.didUpdate) === null || _a === void 0 ? void 0 : _a.call(props, props);
        }
      });
    });
    // onBeforeUnmount(() => {
    //   if (container && container.parentNode) {
    //     container.parentNode.removeChild(container);
    //   }
    // });
    return () => {
      var _a;
      if (!shouldRender.value) return null;
      if (isSSR) {
        return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
      }
      return container ? (0, _vue.createVNode)(_vue.Teleport, {
        "to": container
      }, slots) : null;
    };
  }
});