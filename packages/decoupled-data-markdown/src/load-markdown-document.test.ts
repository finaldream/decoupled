import { loadMarkdownDocument } from './load-markdown-document';

describe('loadMarkdownDocument()', () => {

    test('should parse pure markdown without frontmatter', async () => {

        const content = await loadMarkdownDocument('pure-markdown', 'fixtures');
        expect(content.meta.title).toBeUndefined();
        expect(content.meta.slug).toBe('pure-markdown');
        expect(content).toMatchSnapshot();

    });

    test('should parse markdown with simple yaml-frontmatter', async () => {

        const content = await loadMarkdownDocument('index', 'fixtures');
        expect(content.meta.title).toBe('Homepage');
        expect(content.meta.slug).toBe('index');
        expect(content).toMatchSnapshot();

    });

    test('should resolve "/" to "index"', async () => {

        const content = await loadMarkdownDocument('/', 'fixtures');
        expect(content.meta.title).toBe('Homepage');
        expect(content.meta.slug).toBe('index');
        expect(content).toMatchSnapshot();

    });

    test('should parse markdown with complex yaml-frontmatter', async () => {

        const page = await loadMarkdownDocument('page', 'fixtures');
        expect(page.meta.title).toBe('Test Page');
        expect(page.meta.slug).toBe('page');
        expect(page).toMatchSnapshot();

        const layout = await loadMarkdownDocument('layout', 'fixtures');
        expect(layout.meta.title).toBe('Layout Test');
        expect(layout.meta.slug).toBe('layout');
        expect(layout).toMatchSnapshot();

    });

    test('should receive an error when document does not exist', async () => {

        const content = await loadMarkdownDocument('non-existent', 'fixtures');
        expect(content.meta.error).toBe('not-found');
        expect(content.meta.message).toContain('ENOENT:');

    });

});
