"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.selectProps = selectProps;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _BaseSelect = _interopRequireWildcard(require("./BaseSelect"));
var _OptionList = _interopRequireDefault(require("./OptionList"));
var _useOptions = _interopRequireDefault(require("./hooks/useOptions"));
var _SelectContext = require("./SelectContext");
var _useId = _interopRequireDefault(require("./hooks/useId"));
var _valueUtil = require("./utils/valueUtil");
var _warningPropsUtil = _interopRequireDefault(require("./utils/warningPropsUtil"));
var _commonUtil = require("./utils/commonUtil");
var _useFilterOptions = _interopRequireDefault(require("./hooks/useFilterOptions"));
var _useCache = _interopRequireDefault(require("./hooks/useCache"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _propsUtil = require("../_util/props-util");
var _useMergedState = _interopRequireDefault(require("../_util/hooks/useMergedState"));
var _useState = _interopRequireDefault(require("../_util/hooks/useState"));
var _toReactive = require("../_util/toReactive");
var _omit = _interopRequireDefault(require("../_util/omit"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * To match accessibility requirement, we always provide an input in the component.
 * Other element will not set `tabindex` to avoid `onBlur` sequence problem.
 * For focused select, we set `aria-live="polite"` to update the accessibility content.
 *
 * ref:
 * - keyboard: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role#Keyboard_interactions
 *
 * New api:
 * - listHeight
 * - listItemHeight
 * - component
 *
 * Remove deprecated api:
 * - multiple
 * - tags
 * - combobox
 * - firstActiveValue
 * - dropdownMenuStyle
 * - openClassName (Not list in api)
 *
 * Update:
 * - `backfill` only support `combobox` mode
 * - `combobox` mode not support `labelInValue` since it's meaningless
 * - `getInputElement` only support `combobox` mode
 * - `onChange` return OptionData instead of ReactNode
 * - `filterOption` `onChange` `onSelect` accept OptionData instead of ReactNode
 * - `combobox` mode trigger `onChange` will get `undefined` if no `value` match in Option
 * - `combobox` mode not support `optionLabelProp`
 */

const OMIT_DOM_PROPS = ['inputValue'];
function selectProps() {
  return (0, _extends2.default)((0, _extends2.default)({}, (0, _BaseSelect.baseSelectPropsWithoutPrivate)()), {
    prefixCls: String,
    id: String,
    backfill: {
      type: Boolean,
      default: undefined
    },
    // >>> Field Names
    fieldNames: Object,
    // >>> Search
    /** @deprecated Use `searchValue` instead */
    inputValue: String,
    searchValue: String,
    onSearch: Function,
    autoClearSearchValue: {
      type: Boolean,
      default: undefined
    },
    // >>> Select
    onSelect: Function,
    onDeselect: Function,
    // >>> Options
    /**
     * In Select, `false` means do nothing.
     * In TreeSelect, `false` will highlight match item.
     * It's by design.
     */
    filterOption: {
      type: [Boolean, Function],
      default: undefined
    },
    filterSort: Function,
    optionFilterProp: String,
    optionLabelProp: String,
    options: Array,
    defaultActiveFirstOption: {
      type: Boolean,
      default: undefined
    },
    virtual: {
      type: Boolean,
      default: undefined
    },
    listHeight: Number,
    listItemHeight: Number,
    // >>> Icon
    menuItemSelectedIcon: _vueTypes.default.any,
    mode: String,
    labelInValue: {
      type: Boolean,
      default: undefined
    },
    value: _vueTypes.default.any,
    defaultValue: _vueTypes.default.any,
    onChange: Function,
    children: Array
  });
}
function isRawValue(value) {
  return !value || typeof value !== 'object';
}
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'VcSelect',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(selectProps(), {
    prefixCls: 'vc-select',
    autoClearSearchValue: true,
    listHeight: 200,
    listItemHeight: 20,
    dropdownMatchSelectWidth: true
  }),
  setup(props, _ref) {
    let {
      expose,
      attrs,
      slots
    } = _ref;
    const mergedId = (0, _useId.default)((0, _vue.toRef)(props, 'id'));
    const multiple = (0, _vue.computed)(() => (0, _BaseSelect.isMultiple)(props.mode));
    const childrenAsData = (0, _vue.computed)(() => !!(!props.options && props.children));
    const mergedFilterOption = (0, _vue.computed)(() => {
      if (props.filterOption === undefined && props.mode === 'combobox') {
        return false;
      }
      return props.filterOption;
    });
    // ========================= FieldNames =========================
    const mergedFieldNames = (0, _vue.computed)(() => (0, _valueUtil.fillFieldNames)(props.fieldNames, childrenAsData.value));
    // =========================== Search ===========================
    const [mergedSearchValue, setSearchValue] = (0, _useMergedState.default)('', {
      value: (0, _vue.computed)(() => props.searchValue !== undefined ? props.searchValue : props.inputValue),
      postState: search => search || ''
    });
    // =========================== Option ===========================
    const parsedOptions = (0, _useOptions.default)((0, _vue.toRef)(props, 'options'), (0, _vue.toRef)(props, 'children'), mergedFieldNames);
    const {
      valueOptions,
      labelOptions,
      options: mergedOptions
    } = parsedOptions;
    // ========================= Wrap Value =========================
    const convert2LabelValues = draftValues => {
      // Convert to array
      const valueList = (0, _commonUtil.toArray)(draftValues);
      // Convert to labelInValue type
      return valueList.map(val => {
        var _a, _b;
        let rawValue;
        let rawLabel;
        let rawKey;
        let rawDisabled;
        // Fill label & value
        if (isRawValue(val)) {
          rawValue = val;
        } else {
          rawKey = val.key;
          rawLabel = val.label;
          rawValue = (_a = val.value) !== null && _a !== void 0 ? _a : rawKey;
        }
        const option = valueOptions.value.get(rawValue);
        if (option) {
          // Fill missing props
          if (rawLabel === undefined) rawLabel = option === null || option === void 0 ? void 0 : option[props.optionLabelProp || mergedFieldNames.value.label];
          if (rawKey === undefined) rawKey = (_b = option === null || option === void 0 ? void 0 : option.key) !== null && _b !== void 0 ? _b : rawValue;
          rawDisabled = option === null || option === void 0 ? void 0 : option.disabled;
          // Warning if label not same as provided
          // if (process.env.NODE_ENV !== 'production' && !isRawValue(val)) {
          //   const optionLabel = option?.[mergedFieldNames.value.label];
          //   if (optionLabel !== undefined && optionLabel !== rawLabel) {
          //     warning(false, '`label` of `value` is not same as `label` in Select options.');
          //   }
          // }
        }
        return {
          label: rawLabel,
          value: rawValue,
          key: rawKey,
          disabled: rawDisabled,
          option
        };
      });
    };
    // =========================== Values ===========================
    const [internalValue, setInternalValue] = (0, _useMergedState.default)(props.defaultValue, {
      value: (0, _vue.toRef)(props, 'value')
    });
    // Merged value with LabelValueType
    const rawLabeledValues = (0, _vue.computed)(() => {
      var _a;
      const values = convert2LabelValues(internalValue.value);
      // combobox no need save value when it's empty
      if (props.mode === 'combobox' && !((_a = values[0]) === null || _a === void 0 ? void 0 : _a.value)) {
        return [];
      }
      return values;
    });
    // Fill label with cache to avoid option remove
    const [mergedValues, getMixedOption] = (0, _useCache.default)(rawLabeledValues, valueOptions);
    const displayValues = (0, _vue.computed)(() => {
      // `null` need show as placeholder instead
      // https://github.com/ant-design/ant-design/issues/25057
      if (!props.mode && mergedValues.value.length === 1) {
        const firstValue = mergedValues.value[0];
        if (firstValue.value === null && (firstValue.label === null || firstValue.label === undefined)) {
          return [];
        }
      }
      return mergedValues.value.map(item => {
        var _a;
        return (0, _extends2.default)((0, _extends2.default)({}, item), {
          label: (_a = typeof item.label === 'function' ? item.label() : item.label) !== null && _a !== void 0 ? _a : item.value
        });
      });
    });
    /** Convert `displayValues` to raw value type set */
    const rawValues = (0, _vue.computed)(() => new Set(mergedValues.value.map(val => val.value)));
    (0, _vue.watchEffect)(() => {
      var _a;
      if (props.mode === 'combobox') {
        const strValue = (_a = mergedValues.value[0]) === null || _a === void 0 ? void 0 : _a.value;
        if (strValue !== undefined && strValue !== null) {
          setSearchValue(String(strValue));
        }
      }
    }, {
      flush: 'post'
    });
    // ======================= Display Option =======================
    // Create a placeholder item if not exist in `options`
    const createTagOption = (val, label) => {
      const mergedLabel = label !== null && label !== void 0 ? label : val;
      return {
        [mergedFieldNames.value.value]: val,
        [mergedFieldNames.value.label]: mergedLabel
      };
    };
    // Fill tag as option if mode is `tags`
    const filledTagOptions = (0, _vue.shallowRef)();
    (0, _vue.watchEffect)(() => {
      if (props.mode !== 'tags') {
        filledTagOptions.value = mergedOptions.value;
        return;
      }
      // >>> Tag mode
      const cloneOptions = mergedOptions.value.slice();
      // Check if value exist in options (include new patch item)
      const existOptions = val => valueOptions.value.has(val);
      // Fill current value as option
      [...mergedValues.value].sort((a, b) => a.value < b.value ? -1 : 1).forEach(item => {
        const val = item.value;
        if (!existOptions(val)) {
          cloneOptions.push(createTagOption(val, item.label));
        }
      });
      filledTagOptions.value = cloneOptions;
    });
    const filteredOptions = (0, _useFilterOptions.default)(filledTagOptions, mergedFieldNames, mergedSearchValue, mergedFilterOption, (0, _vue.toRef)(props, 'optionFilterProp'));
    // Fill options with search value if needed
    const filledSearchOptions = (0, _vue.computed)(() => {
      if (props.mode !== 'tags' || !mergedSearchValue.value || filteredOptions.value.some(item => item[props.optionFilterProp || 'value'] === mergedSearchValue.value)) {
        return filteredOptions.value;
      }
      // Fill search value as option
      return [createTagOption(mergedSearchValue.value), ...filteredOptions.value];
    });
    const orderedFilteredOptions = (0, _vue.computed)(() => {
      if (!props.filterSort) {
        return filledSearchOptions.value;
      }
      return [...filledSearchOptions.value].sort((a, b) => props.filterSort(a, b));
    });
    const displayOptions = (0, _vue.computed)(() => (0, _valueUtil.flattenOptions)(orderedFilteredOptions.value, {
      fieldNames: mergedFieldNames.value,
      childrenAsData: childrenAsData.value
    }));
    // =========================== Change ===========================
    const triggerChange = values => {
      const labeledValues = convert2LabelValues(values);
      setInternalValue(labeledValues);
      if (props.onChange && (
      // Trigger event only when value changed
      labeledValues.length !== mergedValues.value.length || labeledValues.some((newVal, index) => {
        var _a;
        return ((_a = mergedValues.value[index]) === null || _a === void 0 ? void 0 : _a.value) !== (newVal === null || newVal === void 0 ? void 0 : newVal.value);
      }))) {
        const returnValues = props.labelInValue ? labeledValues.map(v => {
          return (0, _extends2.default)((0, _extends2.default)({}, v), {
            originLabel: v.label,
            label: typeof v.label === 'function' ? v.label() : v.label
          });
        }) : labeledValues.map(v => v.value);
        const returnOptions = labeledValues.map(v => (0, _valueUtil.injectPropsWithOption)(getMixedOption(v.value)));
        props.onChange(
        // Value
        multiple.value ? returnValues : returnValues[0],
        // Option
        multiple.value ? returnOptions : returnOptions[0]);
      }
    };
    // ======================= Accessibility ========================
    const [activeValue, setActiveValue] = (0, _useState.default)(null);
    const [accessibilityIndex, setAccessibilityIndex] = (0, _useState.default)(0);
    const mergedDefaultActiveFirstOption = (0, _vue.computed)(() => props.defaultActiveFirstOption !== undefined ? props.defaultActiveFirstOption : props.mode !== 'combobox');
    const onActiveValue = function (active, index) {
      let {
        source = 'keyboard'
      } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      setAccessibilityIndex(index);
      if (props.backfill && props.mode === 'combobox' && active !== null && source === 'keyboard') {
        setActiveValue(String(active));
      }
    };
    // ========================= OptionList =========================
    const triggerSelect = (val, selected) => {
      const getSelectEnt = () => {
        var _a;
        const option = getMixedOption(val);
        const originLabel = option === null || option === void 0 ? void 0 : option[mergedFieldNames.value.label];
        return [props.labelInValue ? {
          label: typeof originLabel === 'function' ? originLabel() : originLabel,
          originLabel,
          value: val,
          key: (_a = option === null || option === void 0 ? void 0 : option.key) !== null && _a !== void 0 ? _a : val
        } : val, (0, _valueUtil.injectPropsWithOption)(option)];
      };
      if (selected && props.onSelect) {
        const [wrappedValue, option] = getSelectEnt();
        props.onSelect(wrappedValue, option);
      } else if (!selected && props.onDeselect) {
        const [wrappedValue, option] = getSelectEnt();
        props.onDeselect(wrappedValue, option);
      }
    };
    // Used for OptionList selection
    const onInternalSelect = (val, info) => {
      let cloneValues;
      // Single mode always trigger select only with option list
      const mergedSelect = multiple.value ? info.selected : true;
      if (mergedSelect) {
        cloneValues = multiple.value ? [...mergedValues.value, val] : [val];
      } else {
        cloneValues = mergedValues.value.filter(v => v.value !== val);
      }
      triggerChange(cloneValues);
      triggerSelect(val, mergedSelect);
      // Clean search value if single or configured
      if (props.mode === 'combobox') {
        // setSearchValue(String(val));
        setActiveValue('');
      } else if (!multiple.value || props.autoClearSearchValue) {
        setSearchValue('');
        setActiveValue('');
      }
    };
    // ======================= Display Change =======================
    // BaseSelect display values change
    const onDisplayValuesChange = (nextValues, info) => {
      triggerChange(nextValues);
      if (info.type === 'remove' || info.type === 'clear') {
        info.values.forEach(item => {
          triggerSelect(item.value, false);
        });
      }
    };
    // =========================== Search ===========================
    const onInternalSearch = (searchText, info) => {
      var _a;
      setSearchValue(searchText);
      setActiveValue(null);
      // [Submit] Tag mode should flush input
      if (info.source === 'submit') {
        const formatted = (searchText || '').trim();
        // prevent empty tags from appearing when you click the Enter button
        if (formatted) {
          const newRawValues = Array.from(new Set([...rawValues.value, formatted]));
          triggerChange(newRawValues);
          triggerSelect(formatted, true);
          setSearchValue('');
        }
        return;
      }
      if (info.source !== 'blur') {
        if (props.mode === 'combobox') {
          triggerChange(searchText);
        }
        (_a = props.onSearch) === null || _a === void 0 ? void 0 : _a.call(props, searchText);
      }
    };
    const onInternalSearchSplit = words => {
      let patchValues = words;
      if (props.mode !== 'tags') {
        patchValues = words.map(word => {
          const opt = labelOptions.value.get(word);
          return opt === null || opt === void 0 ? void 0 : opt.value;
        }).filter(val => val !== undefined);
      }
      const newRawValues = Array.from(new Set([...rawValues.value, ...patchValues]));
      triggerChange(newRawValues);
      newRawValues.forEach(newRawValue => {
        triggerSelect(newRawValue, true);
      });
    };
    const realVirtual = (0, _vue.computed)(() => props.virtual !== false && props.dropdownMatchSelectWidth !== false);
    (0, _SelectContext.useProvideSelectProps)((0, _toReactive.toReactive)((0, _extends2.default)((0, _extends2.default)({}, parsedOptions), {
      flattenOptions: displayOptions,
      onActiveValue,
      defaultActiveFirstOption: mergedDefaultActiveFirstOption,
      onSelect: onInternalSelect,
      menuItemSelectedIcon: (0, _vue.toRef)(props, 'menuItemSelectedIcon'),
      rawValues,
      fieldNames: mergedFieldNames,
      virtual: realVirtual,
      listHeight: (0, _vue.toRef)(props, 'listHeight'),
      listItemHeight: (0, _vue.toRef)(props, 'listItemHeight'),
      childrenAsData
    })));
    // ========================== Warning ===========================
    if (process.env.NODE_ENV !== 'production') {
      (0, _vue.watchEffect)(() => {
        (0, _warningPropsUtil.default)(props);
      }, {
        flush: 'post'
      });
    }
    const selectRef = (0, _vue.ref)();
    expose({
      focus() {
        var _a;
        (_a = selectRef.value) === null || _a === void 0 ? void 0 : _a.focus();
      },
      blur() {
        var _a;
        (_a = selectRef.value) === null || _a === void 0 ? void 0 : _a.blur();
      },
      scrollTo(arg) {
        var _a;
        (_a = selectRef.value) === null || _a === void 0 ? void 0 : _a.scrollTo(arg);
      }
    });
    const pickProps = (0, _vue.computed)(() => {
      return (0, _omit.default)(props, ['id', 'mode', 'prefixCls', 'backfill', 'fieldNames',
      // Search
      'inputValue', 'searchValue', 'onSearch', 'autoClearSearchValue',
      // Select
      'onSelect', 'onDeselect', 'dropdownMatchSelectWidth',
      // Options
      'filterOption', 'filterSort', 'optionFilterProp', 'optionLabelProp', 'options', 'children', 'defaultActiveFirstOption', 'menuItemSelectedIcon', 'virtual', 'listHeight', 'listItemHeight',
      // Value
      'value', 'defaultValue', 'labelInValue', 'onChange']);
    });
    return () => {
      return (0, _vue.createVNode)(_BaseSelect.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, pickProps.value), attrs), {}, {
        "id": mergedId,
        "prefixCls": props.prefixCls,
        "ref": selectRef,
        "omitDomProps": OMIT_DOM_PROPS,
        "mode": props.mode,
        "displayValues": displayValues.value,
        "onDisplayValuesChange": onDisplayValuesChange,
        "searchValue": mergedSearchValue.value,
        "onSearch": onInternalSearch,
        "onSearchSplit": onInternalSearchSplit,
        "dropdownMatchSelectWidth": props.dropdownMatchSelectWidth,
        "OptionList": _OptionList.default,
        "emptyOptions": !displayOptions.value.length,
        "activeValue": activeValue.value,
        "activeDescendantId": `${mergedId}_list_${accessibilityIndex.value}`
      }), slots);
    };
  }
});