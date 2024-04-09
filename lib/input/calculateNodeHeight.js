"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateNodeStyling = calculateNodeStyling;
exports.default = calculateAutoSizeStyle;
/**
 * calculateNodeHeight(uiTextNode, useCache = false)
 */
const HIDDEN_TEXTAREA_STYLE = `
  min-height:0 !important;
  max-height:none !important;
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important;
  pointer-events: none !important;
`;
const SIZING_STYLE = ['letter-spacing', 'line-height', 'padding-top', 'padding-bottom', 'font-family', 'font-weight', 'font-size', 'font-variant', 'text-rendering', 'text-transform', 'width', 'text-indent', 'padding-left', 'padding-right', 'border-width', 'box-sizing', 'word-break', 'white-space'];
const computedStyleCache = {};
let hiddenTextarea;
function calculateNodeStyling(node) {
  let useCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const nodeRef = node.getAttribute('id') || node.getAttribute('data-reactid') || node.getAttribute('name');
  if (useCache && computedStyleCache[nodeRef]) {
    return computedStyleCache[nodeRef];
  }
  const style = window.getComputedStyle(node);
  const boxSizing = style.getPropertyValue('box-sizing') || style.getPropertyValue('-moz-box-sizing') || style.getPropertyValue('-webkit-box-sizing');
  const paddingSize = parseFloat(style.getPropertyValue('padding-bottom')) + parseFloat(style.getPropertyValue('padding-top'));
  const borderSize = parseFloat(style.getPropertyValue('border-bottom-width')) + parseFloat(style.getPropertyValue('border-top-width'));
  const sizingStyle = SIZING_STYLE.map(name => `${name}:${style.getPropertyValue(name)}`).join(';');
  const nodeInfo = {
    sizingStyle,
    paddingSize,
    borderSize,
    boxSizing
  };
  if (useCache && nodeRef) {
    computedStyleCache[nodeRef] = nodeInfo;
  }
  return nodeInfo;
}
function calculateAutoSizeStyle(uiTextNode) {
  let useCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  let minRows = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  let maxRows = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    hiddenTextarea.setAttribute('tab-index', '-1');
    hiddenTextarea.setAttribute('aria-hidden', 'true');
    document.body.appendChild(hiddenTextarea);
  }
  // Fix wrap="off" issue
  // https://github.com/ant-design/ant-design/issues/6577
  if (uiTextNode.getAttribute('wrap')) {
    hiddenTextarea.setAttribute('wrap', uiTextNode.getAttribute('wrap'));
  } else {
    hiddenTextarea.removeAttribute('wrap');
  }
  // Copy all CSS properties that have an impact on the height of the content in
  // the textbox
  const {
    paddingSize,
    borderSize,
    boxSizing,
    sizingStyle
  } = calculateNodeStyling(uiTextNode, useCache);
  // Need to have the overflow attribute to hide the scrollbar otherwise
  // text-lines will not calculated properly as the shadow will technically be
  // narrower for content
  hiddenTextarea.setAttribute('style', `${sizingStyle};${HIDDEN_TEXTAREA_STYLE}`);
  hiddenTextarea.value = uiTextNode.value || uiTextNode.placeholder || '';
  let minHeight = undefined;
  let maxHeight = undefined;
  let overflowY;
  let height = hiddenTextarea.scrollHeight;
  if (boxSizing === 'border-box') {
    // border-box: add border, since height = content + padding + border
    height += borderSize;
  } else if (boxSizing === 'content-box') {
    // remove padding, since height = content
    height -= paddingSize;
  }
  if (minRows !== null || maxRows !== null) {
    // measure height of a textarea with a single row
    hiddenTextarea.value = ' ';
    const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
    if (minRows !== null) {
      minHeight = singleRowHeight * minRows;
      if (boxSizing === 'border-box') {
        minHeight = minHeight + paddingSize + borderSize;
      }
      height = Math.max(minHeight, height);
    }
    if (maxRows !== null) {
      maxHeight = singleRowHeight * maxRows;
      if (boxSizing === 'border-box') {
        maxHeight = maxHeight + paddingSize + borderSize;
      }
      overflowY = height > maxHeight ? '' : 'hidden';
      height = Math.min(maxHeight, height);
    }
  }
  const style = {
    height: `${height}px`,
    overflowY,
    resize: 'none'
  };
  if (minHeight) {
    style.minHeight = `${minHeight}px`;
  }
  if (maxHeight) {
    style.maxHeight = `${maxHeight}px`;
  }
  return style;
}