import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, Fragment as _Fragment, createVNode as _createVNode } from "vue";
import PropTypes from '../../_util/vue-types';
import { computed, defineComponent, getCurrentInstance, shallowRef, watch, onBeforeUnmount } from 'vue';
import useProvideKeyPath, { useInjectKeyPath, useMeasure } from './hooks/useKeyPath';
import { useInjectMenu, useProvideFirstLevel, MenuContextProvider, useProvideForceRender, useInjectForceRender } from './hooks/useMenuContext';
import { getPropsSlot, isValidElement } from '../../_util/props-util';
import classNames from '../../_util/classNames';
import useDirectionStyle from './hooks/useDirectionStyle';
import PopupTrigger from './PopupTrigger';
import SubMenuList from './SubMenuList';
import InlineSubMenuList from './InlineSubMenuList';
import { cloneElement } from '../../_util/vnode';
import Overflow from '../../vc-overflow';
import devWarning from '../../vc-util/devWarning';
import isValid from '../../_util/isValid';
import { objectType } from '../../_util/type';
let indexGuid = 0;
export const subMenuProps = () => ({
  icon: PropTypes.any,
  title: PropTypes.any,
  disabled: Boolean,
  level: Number,
  popupClassName: String,
  popupOffset: Array,
  internalPopupClose: Boolean,
  eventKey: String,
  expandIcon: Function,
  theme: String,
  onMouseenter: Function,
  onMouseleave: Function,
  onTitleClick: Function,
  // Internal user prop
  originItemValue: objectType()
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ASubMenu',
  inheritAttrs: false,
  props: subMenuProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs,
      emit
    } = _ref;
    var _a, _b;
    useProvideFirstLevel(false);
    const isMeasure = useMeasure();
    const instance = getCurrentInstance();
    const vnodeKey = typeof instance.vnode.key === 'symbol' ? String(instance.vnode.key) : instance.vnode.key;
    devWarning(typeof instance.vnode.key !== 'symbol', 'SubMenu', `SubMenu \`:key="${String(vnodeKey)}"\` not support Symbol type`);
    const key = isValid(vnodeKey) ? vnodeKey : `sub_menu_${++indexGuid}_$$_not_set_key`;
    const eventKey = (_a = props.eventKey) !== null && _a !== void 0 ? _a : isValid(vnodeKey) ? `sub_menu_${++indexGuid}_$$_${vnodeKey}` : key;
    const {
      parentEventKeys,
      parentInfo,
      parentKeys
    } = useInjectKeyPath();
    const keysPath = computed(() => [...parentKeys.value, key]);
    const childrenEventKeys = shallowRef([]);
    const menuInfo = {
      eventKey,
      key,
      parentEventKeys,
      childrenEventKeys,
      parentKeys
    };
    (_b = parentInfo.childrenEventKeys) === null || _b === void 0 ? void 0 : _b.value.push(eventKey);
    onBeforeUnmount(() => {
      var _a;
      if (parentInfo.childrenEventKeys) {
        parentInfo.childrenEventKeys.value = (_a = parentInfo.childrenEventKeys) === null || _a === void 0 ? void 0 : _a.value.filter(k => k != eventKey);
      }
    });
    useProvideKeyPath(eventKey, key, menuInfo);
    const {
      prefixCls,
      activeKeys,
      disabled: contextDisabled,
      changeActiveKeys,
      mode,
      inlineCollapsed,
      openKeys,
      overflowDisabled,
      onOpenChange,
      registerMenuInfo,
      unRegisterMenuInfo,
      selectedSubMenuKeys,
      expandIcon: menuExpandIcon,
      theme
    } = useInjectMenu();
    const hasKey = vnodeKey !== undefined && vnodeKey !== null;
    // If not set key, use forceRender = true for children
    // 如果没有 key，强制 render 子元素
    const forceRender = !isMeasure && (useInjectForceRender() || !hasKey);
    useProvideForceRender(forceRender);
    if (isMeasure && hasKey || !isMeasure && !hasKey || forceRender) {
      registerMenuInfo(eventKey, menuInfo);
      onBeforeUnmount(() => {
        unRegisterMenuInfo(eventKey);
      });
    }
    const subMenuPrefixCls = computed(() => `${prefixCls.value}-submenu`);
    const mergedDisabled = computed(() => contextDisabled.value || props.disabled);
    const elementRef = shallowRef();
    const popupRef = shallowRef();
    // // ================================ Icon ================================
    // const mergedItemIcon = itemIcon || contextItemIcon;
    // const mergedExpandIcon = expandIcon || contextExpandIcon;
    // ================================ Open ================================
    const originOpen = computed(() => openKeys.value.includes(key));
    const open = computed(() => !overflowDisabled.value && originOpen.value);
    // =============================== Select ===============================
    const childrenSelected = computed(() => {
      return selectedSubMenuKeys.value.includes(key);
    });
    const isActive = shallowRef(false);
    watch(activeKeys, () => {
      isActive.value = !!activeKeys.value.find(val => val === key);
    }, {
      immediate: true
    });
    // =============================== Events ===============================
    // >>>> Title click
    const onInternalTitleClick = e => {
      // Skip if disabled
      if (mergedDisabled.value) {
        return;
      }
      emit('titleClick', e, key);
      // Trigger open by click when mode is `inline`
      if (mode.value === 'inline') {
        onOpenChange(key, !originOpen.value);
      }
    };
    const onMouseEnter = event => {
      if (!mergedDisabled.value) {
        changeActiveKeys(keysPath.value);
        emit('mouseenter', event);
      }
    };
    const onMouseLeave = event => {
      if (!mergedDisabled.value) {
        changeActiveKeys([]);
        emit('mouseleave', event);
      }
    };
    // ========================== DirectionStyle ==========================
    const directionStyle = useDirectionStyle(computed(() => keysPath.value.length));
    // >>>>> Visible change
    const onPopupVisibleChange = newVisible => {
      if (mode.value !== 'inline') {
        onOpenChange(key, newVisible);
      }
    };
    /**
     * Used for accessibility. Helper will focus element without key board.
     * We should manually trigger an active
     */
    const onInternalFocus = () => {
      changeActiveKeys(keysPath.value);
    };
    // =============================== Render ===============================
    const popupId = eventKey && `${eventKey}-popup`;
    const popupClassName = computed(() => classNames(prefixCls.value, `${prefixCls.value}-${props.theme || theme.value}`, props.popupClassName));
    const renderTitle = (title, icon) => {
      if (!icon) {
        return inlineCollapsed.value && !parentKeys.value.length && title && typeof title === 'string' ? _createVNode("div", {
          "class": `${prefixCls.value}-inline-collapsed-noicon`
        }, [title.charAt(0)]) : _createVNode("span", {
          "class": `${prefixCls.value}-title-content`
        }, [title]);
      }
      // inline-collapsed.md demo 依赖 span 来隐藏文字,有 icon 属性，则内部包裹一个 span
      // ref: https://github.com/ant-design/ant-design/pull/23456
      const titleIsSpan = isValidElement(title) && title.type === 'span';
      return _createVNode(_Fragment, null, [cloneElement(typeof icon === 'function' ? icon(props.originItemValue) : icon, {
        class: `${prefixCls.value}-item-icon`
      }, false), titleIsSpan ? title : _createVNode("span", {
        "class": `${prefixCls.value}-title-content`
      }, [title])]);
    };
    // Cache mode if it change to `inline` which do not have popup motion
    const triggerModeRef = computed(() => {
      return mode.value !== 'inline' && keysPath.value.length > 1 ? 'vertical' : mode.value;
    });
    const renderMode = computed(() => mode.value === 'horizontal' ? 'vertical' : mode.value);
    const subMenuTriggerModeRef = computed(() => triggerModeRef.value === 'horizontal' ? 'vertical' : triggerModeRef.value);
    const baseTitleNode = () => {
      var _a, _b;
      const subMenuPrefixClsValue = subMenuPrefixCls.value;
      const icon = (_a = props.icon) !== null && _a !== void 0 ? _a : (_b = slots.icon) === null || _b === void 0 ? void 0 : _b.call(slots, props);
      const expandIcon = props.expandIcon || slots.expandIcon || menuExpandIcon.value;
      const title = renderTitle(getPropsSlot(slots, props, 'title'), icon);
      return _createVNode("div", {
        "style": directionStyle.value,
        "class": `${subMenuPrefixClsValue}-title`,
        "tabindex": mergedDisabled.value ? null : -1,
        "ref": elementRef,
        "title": typeof title === 'string' ? title : null,
        "data-menu-id": key,
        "aria-expanded": open.value,
        "aria-haspopup": true,
        "aria-controls": popupId,
        "aria-disabled": mergedDisabled.value,
        "onClick": onInternalTitleClick,
        "onFocus": onInternalFocus
      }, [title, mode.value !== 'horizontal' && expandIcon ? expandIcon(_extends(_extends({}, props), {
        isOpen: open.value
      })) : _createVNode("i", {
        "class": `${subMenuPrefixClsValue}-arrow`
      }, null)]);
    };
    return () => {
      var _a;
      if (isMeasure) {
        if (!hasKey) {
          return null;
        }
        return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
      }
      const subMenuPrefixClsValue = subMenuPrefixCls.value;
      let titleNode = () => null;
      if (!overflowDisabled.value && mode.value !== 'inline') {
        const popupOffset = mode.value === 'horizontal' ? [0, 8] : [10, 0];
        titleNode = () => _createVNode(PopupTrigger, {
          "mode": triggerModeRef.value,
          "prefixCls": subMenuPrefixClsValue,
          "visible": !props.internalPopupClose && open.value,
          "popupClassName": popupClassName.value,
          "popupOffset": props.popupOffset || popupOffset,
          "disabled": mergedDisabled.value,
          "onVisibleChange": onPopupVisibleChange
        }, {
          default: () => [baseTitleNode()],
          popup: () => _createVNode(MenuContextProvider, {
            "mode": subMenuTriggerModeRef.value
          }, {
            default: () => [_createVNode(SubMenuList, {
              "id": popupId,
              "ref": popupRef
            }, {
              default: slots.default
            })]
          })
        });
      } else {
        // 包裹一层，保持结构一致，防止动画丢失
        // https://github.com/vueComponent/ant-design-vue/issues/4325
        titleNode = () => _createVNode(PopupTrigger, null, {
          default: baseTitleNode
        });
      }
      return _createVNode(MenuContextProvider, {
        "mode": renderMode.value
      }, {
        default: () => [_createVNode(Overflow.Item, _objectSpread(_objectSpread({
          "component": "li"
        }, attrs), {}, {
          "role": "none",
          "class": classNames(subMenuPrefixClsValue, `${subMenuPrefixClsValue}-${mode.value}`, attrs.class, {
            [`${subMenuPrefixClsValue}-open`]: open.value,
            [`${subMenuPrefixClsValue}-active`]: isActive.value,
            [`${subMenuPrefixClsValue}-selected`]: childrenSelected.value,
            [`${subMenuPrefixClsValue}-disabled`]: mergedDisabled.value
          }),
          "onMouseenter": onMouseEnter,
          "onMouseleave": onMouseLeave,
          "data-submenu-id": key
        }), {
          default: () => {
            return _createVNode(_Fragment, null, [titleNode(), !overflowDisabled.value && _createVNode(InlineSubMenuList, {
              "id": popupId,
              "open": open.value,
              "keyPath": keysPath.value
            }, {
              default: slots.default
            })]);
          }
        })]
      });
    };
  }
});