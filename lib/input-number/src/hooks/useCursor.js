"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useCursor;
var _warning = require("../../../vc-util/warning");
var _vue = require("vue");
/**
 * Keep input cursor in the correct position if possible.
 * Is this necessary since we have `formatter` which may mass the content?
 */
function useCursor(inputRef, focused) {
  const selectionRef = (0, _vue.ref)(null);
  function recordCursor() {
    // Record position
    try {
      const {
        selectionStart: start,
        selectionEnd: end,
        value
      } = inputRef.value;
      const beforeTxt = value.substring(0, start);
      const afterTxt = value.substring(end);
      selectionRef.value = {
        start,
        end,
        value,
        beforeTxt,
        afterTxt
      };
    } catch (e) {
      // Fix error in Chrome:
      // Failed to read the 'selectionStart' property from 'HTMLInputElement'
      // http://stackoverflow.com/q/21177489/3040605
    }
  }
  /**
   * Restore logic:
   *  1. back string same
   *  2. start string same
   */
  function restoreCursor() {
    if (inputRef.value && selectionRef.value && focused.value) {
      try {
        const {
          value
        } = inputRef.value;
        const {
          beforeTxt,
          afterTxt,
          start
        } = selectionRef.value;
        let startPos = value.length;
        if (value.endsWith(afterTxt)) {
          startPos = value.length - selectionRef.value.afterTxt.length;
        } else if (value.startsWith(beforeTxt)) {
          startPos = beforeTxt.length;
        } else {
          const beforeLastChar = beforeTxt[start - 1];
          const newIndex = value.indexOf(beforeLastChar, start - 1);
          if (newIndex !== -1) {
            startPos = newIndex + 1;
          }
        }
        inputRef.value.setSelectionRange(startPos, startPos);
      } catch (e) {
        (0, _warning.warning)(false, `Something warning of cursor restore. Please fire issue about this: ${e.message}`);
      }
    }
  }
  return [recordCursor, restoreCursor];
}