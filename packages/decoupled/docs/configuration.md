# Configuration

## Inheritance

By default, a site's configuration will always inherit from the `default` site.
This can be overridden from the `decoupled.config.js` by specifying an array of configuration-folders
by the key `sites.${siteId}.configs`. If defined, this config will be used, instead of the predefined
inheritance. Paths must be absolute.
