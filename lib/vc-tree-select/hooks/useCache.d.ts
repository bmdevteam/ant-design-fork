import type { Ref } from 'vue';
import type { LabeledValueType } from '../TreeSelect';
/**
 * This function will try to call requestIdleCallback if available to save performance.
 * No need `getLabel` here since already fetch on `rawLabeledValue`.
 */
declare const _default: (values: Ref<LabeledValueType[]>) => [Ref<LabeledValueType[]>];
export default _default;
