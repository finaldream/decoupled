import ejs from 'ejs';
import { resolve, relative } from "path"
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs"
import { appPath, srcDir } from "../../lib"
import { logger } from '../../logger';

let entryTemplate = null

export const cacheEntryTemplate = (path: string): any => {
    const template = readFileSync(path, { encoding: 'utf8' }) as string;
    entryTemplate = ejs.compile(template);
}

const checkRequire = (file: string): boolean => {

    try {
        require.resolve(file)
    } catch (e) {
        return false
    }

    return true

}

export const makeSiteEntry = (siteId: string) => {

    const entriesDir = resolve(appPath('entries'))

    if (!existsSync(entriesDir)) {
        mkdirSync(entriesDir, { recursive: true })
    }
    const entry = resolve(entriesDir, `${siteId}-entry.js`)

    if (existsSync(entry)) {
        return entry
    }

    const configDir = srcDir('sites', siteId, 'config')
    const viewsDir = srcDir('sites', siteId, 'views')

    const hasConfig = existsSync(resolve(configDir))
    const hasViews = checkRequire(resolve(viewsDir))

    if (!hasConfig) {
        logger.debug(`Exclude config from bundling, module does not exist: ${configDir}`)
    }

    if (!hasViews) {
        logger.debug(`Exclude views from bundling, module can not be required: ${configDir}`)
    }

    const output = entryTemplate({
        tpl: {
            siteId,
            config: hasConfig ? relative(entriesDir, configDir) : null,
            views: hasViews ? relative(entriesDir, viewsDir) : null,
        }
    })

    writeFileSync(entry, output, { encoding: 'utf8' })

    return entry;

}
