import path from 'path';
import { getSiteIDs } from '../get-site-ids';

describe('this is getSiteIds function test', () => {
  test('expect getSiteIds return an array of site with correct rootPath', () => {
    const rootPath = path.join(path.resolve(), '/src/config/__tests__/config/');
    const siteIds = getSiteIDs(rootPath);
    expect(siteIds.includes('example')).toBe(true);
  })
  test('expect getSiteIds return an array of site with wrong rootPath', () => {
    const rootPath = path.join(path.resolve(), '/src/config/__tests__/something/');
    try {
      getSiteIDs(rootPath);  
    } catch (error) {
      expect(error.toString()).toEqual("Error: ENOENT: no such file or directory, scandir '/Users/friendken/Sites/decoupled/packages/decoupled/src/config/__tests__/something/'");
    }
    // expect(siteIds.includes('example')).toBe(true);
  })
})