let hash = '';

export const getHash = (): string => hash
export const isHash = (value: string): boolean => hash === value

export const setHash = (value: string) => {
    hash = value;
}
