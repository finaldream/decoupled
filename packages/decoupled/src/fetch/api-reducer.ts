/**
 * WP API Modifier/Reducer
 */

import { get, set } from 'lodash';
import { config } from 'multisite-config';
import { removeDomain } from '../lib';

export default (state) =>
    new Promise((resolve) => {
        const newState = state;
        const domain = config.get('site.key');
        const content = get(state, 'data.posts[0].content.rendered');

        if (domain && typeof content === 'string') {
            set(newState, 'data.posts[0].content.rendered', removeDomain(content, domain));
        }

        resolve(newState);
    });
