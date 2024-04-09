import type { DataNode, FieldNames, Key } from '../../vc-tree/interface';
/** 计算选中范围，只考虑expanded情况以优化性能 */
export declare function calcRangeKeys({ treeData, expandedKeys, startKey, endKey, fieldNames, }: {
    treeData: DataNode[];
    expandedKeys: Key[];
    startKey?: Key;
    endKey?: Key;
    fieldNames?: FieldNames;
}): Key[];
export declare function convertDirectoryKeysToNodes(treeData: DataNode[], keys: Key[], fieldNames: FieldNames): DataNode[];
