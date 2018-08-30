import { format } from 'winston';
import { get, each } from 'lodash';
import moment from 'moment';
import { colorizeLabel } from './colorize-label';

let maxLabelLength = 0;
const DEFAULT_TIME_FORMAT = 'DD/MM/YYYY hh:mm:ss';
const updateMaxLabelLength = (label: string) => maxLabelLength = Math.max(maxLabelLength, label.length);

const logFormatter = format.printf((info) => {
    const result = [];
    const order = ['label', 'timestamp', 'level', 'message'];
    each(order, (item) => {
        if (info[item]) {
            result.push(info[item]);
        }
    })    
    return result.join(' | ');
});

const setFormat = format((info, opts) => {
    const newInfo = Object.assign({}, info);
    // check option show label
    if (opts.showLabel) {
        updateMaxLabelLength(opts.label);
        newInfo.label = colorizeLabel(opts.label, opts.label.padEnd(maxLabelLength));
    }

    // check option timestamp, set format datetime if there is  a string
    if (opts.timestamp) {
        let formatDateTime = DEFAULT_TIME_FORMAT;
        if(typeof opts.timestamp === 'string') {
            formatDateTime = opts.timestamp;
        }
        newInfo.timestamp = moment().format(formatDateTime);
    }

    // remove default level option of format
    if (opts.level === false) {
        delete newInfo.level;
    }
    return newInfo
})

export const logFormat = (label: string, options?: any) => {
    const combineFormat = [];
    const opts = {
        showLabel: get(options, 'showLabel', true),
        timestamp: get(options, 'timestamp', true),
        colorize: get(options, 'colorize', true),
        level: get(options, 'showLevel', true),
        label
    }
    // check options show colorize for level
    if(opts.colorize) {
        combineFormat.push(format.colorize());
    }
    return format.combine(...combineFormat, setFormat(opts), logFormatter);
};
