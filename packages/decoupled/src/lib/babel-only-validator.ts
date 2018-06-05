/**
 * Creates a filename validator for Babel, defining which modules
 * are allowed to be transpiled at run-time
 *
 * Example:
 *  babelOnlyValidator(__dirname, process.env.PWD)
 */
module.exports = function babelOnlyValidator(dcoupledDir, projectDir) {
    const RE_DC_DIR = new RegExp(`${dcoupledDir}(.*)`);
    const RE_DC_MOD_DIR = new RegExp(`${dcoupledDir}/node_modules/(.*)`);
    const RE_MAIN_DIR = new RegExp(`${projectDir}(.*)`);
    const RE_MAIN_MOD_DIR = new RegExp(`${projectDir}/node_modules/(.*)`);

    return (filename) => {
        // file is in dcoupled-dir, but not in dcoupled's node_modules
        if (RE_DC_DIR.test(filename) && !RE_DC_MOD_DIR.test(filename)) {
            return true;
        }

        // file is in PWD, but not in it's node_modules
        if (RE_MAIN_DIR.test(filename) && !RE_MAIN_MOD_DIR.test(filename)) {
            return true;
        }

        return false;
    };
};
