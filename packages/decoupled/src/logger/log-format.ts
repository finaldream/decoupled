import { format } from 'winston';
import { get } from 'lodash';
import moment from 'moment';
import { colorizeLabel } from './colorize-label';

let maxLabelLength = 0;

const updateMaxLabelLength = (label: string) => maxLabelLength = Math.max(maxLabelLength, label.length);

const logFormatter = format.printf((info) => {
    let label = info.label || '';
    const timestamp = info.timestamp || '';
    const level = info.level ? `${info.level} : ` : '';
    return `${label}${timestamp}${level}${info.message}`;
});

const setFormat = format((info, opts) => {
    // check option show label
    if(get(opts, 'options.showLabel', true)) {
        updateMaxLabelLength(opts.siteId);
        info.label = `${colorizeLabel(opts.siteId, opts.siteId.padEnd(maxLabelLength))} | `;
    }

    // check option timestamp, set format datetime if there is  a string
    if(get(opts, 'options.timestamp', true)) {
        let formatDateTime = 'd/MM/YYYY hh:mm:ss';
        if(opts.options.timestamp && typeof opts.options.timestamp === 'string') {
            formatDateTime = opts.options.timestamp;
        }
        info.timestamp = `${moment().format(formatDateTime)} | `;
    }

    // remove default level option of format
    if(opts.options.level === false) {
        delete info.level;
    }
    return info
})

export const logFormat = (siteId: string, options?: any) => {
    const combineFormat = [];
    // check options show colorilize for level
    if(get(options, 'colorilize', true)) {
        combineFormat.push(format.colorize());
    }
    return format.combine(...combineFormat, setFormat({siteId, options}), logFormatter);
};
