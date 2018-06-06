/**
 * React Template engine
 */

const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { logger, config } = require('decoupled');
const packageJson = require('../package.json');

module.exports = async (store = {}) => {

    const { views, entryFile } = config.get('render');

    const viewPath = path.resolve(process.env.PWD, views);
    const templateFile = `${viewPath}/${entryFile || 'index.js'}`;

    const templatePath = path.resolve(templateFile);
    logger.debug('React rendering template', templatePath);

    let result;
    try {
        const Component = require(templatePath).default; // eslint-disable-line
        result = ReactDOMServer.renderToStaticMarkup(React.createElement(Component, store));
    } catch (e) {
        logger.error(`${packageJson.name}`, e.error, e.stack);
    }

    return result;
};
