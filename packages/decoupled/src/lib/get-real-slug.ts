/**
 * Return post real slug and post type
 * @param {String} slug
 * @param {Array} types
 * @returns {String}
 */
export function getRealSlug(slug, types = []) {
    let realSlug = slug;

    const type = types.find((t) => slug.endsWith(`-${t}`));

    if (type) {
        realSlug = slug.replace(`-${type}`, '');
    }

    return realSlug;
}
