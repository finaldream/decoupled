import { resolve } from 'path';
import { parseMarkdownWithMeta, MarkdownMetaResult } from './parse-markdown';

export const loadMarkdownDocument = async (
    documentName: string,
    docDir: string = 'content'
): Promise<MarkdownMetaResult> => {

    const file = documentName === '/'
        ? 'index'
        : documentName;

    const { default: content } = await import(resolve(docDir, `${file}.md`));

    return parseMarkdownWithMeta(content);

};
