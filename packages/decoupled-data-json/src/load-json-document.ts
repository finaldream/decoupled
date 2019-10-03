import fs from 'fs';
import util from 'util';
import { resolve } from 'path';

const readFile = (fileName: string): Promise<string> => util.promisify(fs.readFile)(fileName, 'utf8');

export const loadJsonDocument = async (
    documentName: string,
    docDir: string = 'content'
): Promise<AnyObject> => {

    const slug = documentName === '/'
        ? 'index'
        : documentName;

    let content;
    try {
        content = await readFile(resolve(docDir, `${slug}.json`));
    } catch (e) {
        return {
            error: 'not-found',
            message: e.message,
        };
    }


    let result;
    try {
        result = JSON.parse(content);
    } catch (e) {
        return {
            error: 'syntax-error',
            message: e.message,
        };
    }

    result.slug = slug;

    return result;

};
