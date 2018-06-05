/**
 * Flux Store Component
 */

import { merge } from 'lodash';

import fetch from './api-fetch';
import reducer from './api-reducer';

export class FetchStore {


    public state: AnyObject;
    public handler: any;

    constructor(initialState = {}) {
        this.state = initialState;

        this.handler = {
            fetch,
            reducer,
        };
    }

    public async fetch(options) {
        let result;

        try {
            result = await this.handler.fetch(options);
        } catch (error) {
            throw error;
        }

        await this.reducer(result);
    }

    public async reducer(state) {
        let newState = state;

        if (this.handler.reducer) {
            try {
                newState = await this.handler.reducer(newState);
            } catch (error) {
                throw error;
            }
        }

        this.setState(newState);

        return newState;
    }

    public setState(newState) {
        this.state = merge(this.state, newState);
    }

    public getState() {
        return this.state;
    }
}

export default FetchStore;
