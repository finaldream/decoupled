export class RestartServerPlugin {

    constructor(options) {
        console.log(options);
    }

    public apply(compiler) {
        const plugin = {name: 'StartServerPlugin'};

        compiler.hooks.afterEmit.tapAsync(plugin, this.afterEmit);
    }

    public afterEmit(compilation, callback) {
        console.log('emitted');

        // Do server restart here

        return callback();
    }
}
