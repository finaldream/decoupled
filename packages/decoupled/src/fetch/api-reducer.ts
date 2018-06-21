/**
 * WP API Modifier/Reducer
 */

import { get, set } from 'lodash';
import { removeDomain } from '../lib';
import { Site } from '../site/site';

export default (site: Site, state: AnyObject) =>
    new Promise((resolve) => {
        const newState = state;
        const domain = site.id;
        const content = get(state, 'data.posts[0].content.rendered');

        if (domain && typeof content === 'string') {
            set(newState, 'data.posts[0].content.rendered', removeDomain(content, domain));
        }

        resolve(newState);
    });
