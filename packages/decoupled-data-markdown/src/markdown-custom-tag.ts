import { Tag } from 'yaml';
import { parseMarkdown, stringfyMarkdown } from './parse-markdown';

/**
 * Removes surrounding whitepace and quotes, introduced by YAML string literals
 * Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
 */
const cleanRawValue = (val: string): string => `${val || ''}`
    .replace(/^[\'\"\s\uFEFF\xA0]+|[\'\"\s\uFEFF\xA0]+$/g, '');

export const MarkdownCustomTag: Tag = {
    tag: 'tag:yaml.org,2002:md',
    resolve: (_: any, node: any): any => parseMarkdown(cleanRawValue(node.rawValue)),
    stringify: (item: any): any => stringfyMarkdown(item.value),
};
