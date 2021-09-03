/**
 * React Template engine
 */

const { resolve } = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const packageJson = require('../package.json');

const pre = (...args) => `<pre>${args.join('\n')}</pre>`;

module.exports = async (site, store = {}) => {

    const { views, entryFile } = site.config.get('render');

    const templateFile = `${views}/${entryFile || 'index.js'}`;
    const templatePath = resolve(templateFile);
    site.logger.debug('React rendering template', templatePath);

    let result;
    try {
        const Component = require(templatePath).default; // eslint-disable-line
        result = `<!DOCTYPE html>${ReactDOMServer.renderToStaticMarkup(React.createElement(Component, store))}`;
    } catch (e) {
        site.logger.error(packageJson.name, e);

        const renderError = site.config.get('render.renderError');

        if (typeof renderError === 'function') {
            return renderError(e, site);
        }

        switch (renderError) {
            case "off": return pre('An error occurred, please contact support.');
            case "short": return pre(e.message);
            case "full":
            default: return pre(`Error reported by ${packageJson.name}`, e.message, e.stack);
        }
    }

    return result;
};
