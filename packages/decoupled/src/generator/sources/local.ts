/**
 * Populate files object from local source
 * 
 * There's actually nothing to do - Metalsmith will source local files itself.
 */

module.exports = (logger) => (files, metalsmith, done) => {
    const fileCount = Object.keys(files).length;
    const sourcePath = metalsmith.source();

    logger.info(`Sourcing ${fileCount} files from local files: ${sourcePath}`);
    done();
};
