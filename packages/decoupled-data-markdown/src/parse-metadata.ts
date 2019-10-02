import YAML from 'yaml';
import { MarkdownCustomTag } from './markdown-custom-tag';

export const parseMetadata = (input: string): any => {

    if (input && input.length) {
        try {
            return YAML.parse(input, { tags: [MarkdownCustomTag] });
        } catch (e) {
            if (e.name && /^YAML/.test(e.name)) {
                console.error(e.name, e.message, e.source);
            }
        }
    }

    return {};

};
