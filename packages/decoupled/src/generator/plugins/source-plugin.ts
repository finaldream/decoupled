/**
 * Selects the proper source-module for collecting state.
 *
 * @throws {Error} when failing to load the requested plugin from ../sources
 */
export default function sourcePlugin(sourceType, logger) {
    try {
        let plugin = require(`../sources/${sourceType}`); // eslint-disable-line
        logger.info(`Using data-source "${sourceType}"`);
        plugin = plugin(logger);
        return plugin;
    } catch (err) {
        logger.error(err);
        throw new Error(`Invalid source-type "${sourceType}"`);
    }
}
