import { format } from 'winston';
import { colorizeLabel } from './colorize-label';

let maxLabelLength = 0;

const updateMaxLabelLength = (label: string) => maxLabelLength = Math.max(maxLabelLength, label.length);

const logFormatter = format.printf((info) => {

    updateMaxLabelLength(info.label);

    const label = colorizeLabel(info.label, info.label.padEnd(maxLabelLength));
    const date = new Date(info.timestamp).toLocaleDateString('en-GB');
    const time = new Date(info.timestamp).toLocaleTimeString('en-GB', { hour12: false });

    return `${label} | ${date} ${time} | ${info.level}: ${info.message}`;
});

export const logFormat = (siteId: string) => format.combine(
    format.label({ label: siteId }),
    format.timestamp(),
    format.splat(),
    format.colorize(),
    logFormatter,
);
