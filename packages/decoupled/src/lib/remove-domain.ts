import { replace } from 'lodash';

/**
 * Remove domain from content to convert to relative links
 * @param {String} content
 * @param {String} domain
 */
export function removeDomain(content, domain) {
    try {
        const pattern = new RegExp(`https?://([a-zA-Z\\d-]+\\.){0,}${domain}`, 'g');
        return replace(content, pattern, '');
    } catch (err) {
        return content;
    }
}
