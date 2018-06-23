import Chalk from 'chalk';

const labels = new Map();

const orderedColors = [
    Chalk.yellowBright,
    Chalk.greenBright,
    Chalk.blueBright,
    Chalk.magentaBright,
    Chalk.redBright,
    Chalk.yellow,
    Chalk.green,
    Chalk.cyanBright,
    Chalk.cyan,
    Chalk.blue,
    Chalk.magenta,
    Chalk.red,
    Chalk.gray,
];

export const getColorForLabel = (label: string) => {

    if (!labels.has(label)) {
        const colorIndex = labels.size % (orderedColors.length);
        labels.set(label, orderedColors[colorIndex]);
    }

    return labels.get(label);

};

export const colorizeLabel = (siteId: string, label?: string): string => {

    const text = label || siteId;

    if (siteId === 'default') {
        return text;
    }

    // label = `${siteId}-${labels.size}`; // show me rainbows ...
    const colorfn = getColorForLabel(label);
    return colorfn(text);

};
