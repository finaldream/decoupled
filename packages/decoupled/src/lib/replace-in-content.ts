interface ReplaceInContentRule {
    search: string | RegExp;
    replace: string | RegExp | GenericFunction<any, string>;
}

export const replaceInContent = (content: string, rules?: ReplaceInContentRule[]): string => {

    if (!rules || !rules.length) {
        return content;
    }

    let result = content;

    rules.forEach((rule) => {
        result = result.replace(rule.search, rule.replace as any);
    });

    return result;

};
