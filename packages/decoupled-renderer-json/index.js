const packageJson = require('../package.json');

const pre = (...args) => `<pre>${args.join('\n')}</pre>`;

module.exports = async (site, store = {}) => {

    try {
        return JSON.stringify(store.state);
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

};
