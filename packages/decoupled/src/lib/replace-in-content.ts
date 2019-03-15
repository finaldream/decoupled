export const replaceInContent = (content: string, rules?: AnyObject): string => {

    if (!rules) {
        return content;
    }

    const keys = Object.keys(rules);

    if (!keys.length) {
        return content;
    }

    let result = content;

    keys.forEach((key) => {
        result = result.replace(key, rules[key]);
    });

    return result;

};
