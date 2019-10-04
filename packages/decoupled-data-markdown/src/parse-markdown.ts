import showdown from 'showdown';
import { parseMetadata } from './parse-metadata';
import { MarkdownMetaResult } from './markdown-meta-result';

/**
 * https://github.com/showdownjs/showdown/wiki/Showdown-options
 */
const ShowdownOptions = (metadata: boolean = false) => ({
    metadata,
    ghCodeBlocks: true,
    smartIndentationFix: true,
    parseImgDimensions: true,
    tables: true,
    requireSpaceBeforeHeadingText: true,
    emoji: true,
});

export const parseMarkdown = (input: string): string => {

    const converter = new showdown.Converter(ShowdownOptions(false));
    return converter.makeHtml(input);

};
export const parseMarkdownWithMeta = (input: string): MarkdownMetaResult => {

    const result: MarkdownMetaResult = {
        html: '',
        meta: {},
    };

    const converter = new showdown.Converter(ShowdownOptions(true));

    // `makeHtml` needs to be called first, in order to retrieve metadata
    result.html = converter.makeHtml(input);

    const metadata = converter.getMetadata(true) as string;

    if (metadata && metadata.length) {
        result.meta = parseMetadata(metadata);
    }

    return result;

};

export const stringfyMarkdown = (input: string): string => {

    const converter = new showdown.Converter(ShowdownOptions(false));
    return converter.makeMarkdown(input);

};
