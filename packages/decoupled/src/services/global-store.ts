/**
 * Global Store
 */

import EventEmitter from 'events';

export class GlobalStore extends EventEmitter {

    private state: AnyObject;

    constructor() {
        super();
        this.state = {};
    }

    public setState(newState = {}) {
        this.state = Object.assign({}, this.state, newState);
        this.emit('change', this.state);
    }

    public getState() {
        return Object.assign({}, this.state);
    }

    public onChange(handler) {
        this.on('change', handler);
    }

}

export default new GlobalStore();
