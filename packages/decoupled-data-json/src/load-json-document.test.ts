import { loadJsonDocument } from './load-json-document';

describe('loadJsonDocument()', () => {

    test('should resolve "/" to "index"', async () => {

        const content = await loadJsonDocument('/', 'fixtures');
        expect(content.title).toBe('Homepage');
        expect(content.slug).toBe('index');
        expect(content).toMatchSnapshot();

    });


    test('should parse complex Json', async () => {

        const layout = await loadJsonDocument('layout', 'fixtures');
        expect(layout.title).toBe('Layout Test');
        expect(layout.slug).toBe('layout');
        expect(layout).toMatchSnapshot();

    });

    test('should receive an error when document is broken', async () => {

        const content = await loadJsonDocument('broken', 'fixtures');
        expect(content.error).toBe('syntax-error');
        expect(content.message).toContain('Unexpected token');

    });


    test('should receive an error when document does not exist', async () => {

        const content = await loadJsonDocument('non-existent', 'fixtures');
        expect(content.error).toBe('not-found');
        expect(content.message).toContain('ENOENT:');

    });

});
