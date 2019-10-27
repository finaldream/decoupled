/**
 * Whether or not Jest runs the code
 */
export const isTestEnvironment = (): boolean => !!(process && process.env && process.env.NODE_ENV === 'test');
