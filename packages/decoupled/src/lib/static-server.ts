import connect from 'connect';
import { AddressInfo } from 'net';
import serveStatic from 'serve-static';

export function staticServer(directory, address = '127.0.0.1', port: number = 8080, logFn) {
    function log(...args) {
        if (logFn) {
            logFn(...args);
        }
    }

    function logWare(req, res, next) {
        log(`[${req.method}]`, req.originalUrl);
        next();
    }

    log('Serving from', directory);

    const app = connect();
    app.use(logWare);
    app.use('/', serveStatic(directory));

    const server = app.listen(port, address, () => {
        const addressInfo = server.address() as AddressInfo;
        const host = addressInfo.address;
        const p = addressInfo.port;

        log('Serving content from http://%s:%s', host, p);
    });
}
