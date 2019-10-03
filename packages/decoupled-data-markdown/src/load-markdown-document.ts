import fs from 'fs';
import util from 'util';
import { resolve } from 'path';
import { parseMarkdownWithMeta } from './parse-markdown';
import { MarkdownMetaResult } from './markdown-meta-result';


const readFile = (fileName: string): Promise<string> => util.promisify(fs.readFile)(fileName, 'utf8');

export const loadMarkdownDocument = async (
    documentName: string,
    docDir: string = 'content'
): Promise<MarkdownMetaResult> => {

    const slug = documentName === '/'
        ? 'index'
        : documentName;

    let content;
    try {
        content = await readFile(resolve(docDir, `${slug}.md`));
    } catch (e) {
        return {
            html: '',
            meta: {
                error: 'not-found',
                message: e.message,
            },
        };
    }

    const result = parseMarkdownWithMeta(content);
    result.meta = result.meta || [];
    result.meta.slug = slug;

    return result;


};
