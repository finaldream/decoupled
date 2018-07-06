# Redirects

## Define Redirects

* Redirects are usually defined in each site's config `router.redirects`.
* Redirects always operate on the whole URL.
* The config consists of an array of objects with the following properties:
  * `source: string | RegExp | function(subject: string): object | boolean`
    * the matcher can simply return a boolean, indicating the match
    * or it can return an object on success, containing matched properties.
    * a string might be in the [url-pattern](https://www.npmjs.com/package/url-pattern)-format, also allowing to capture properties
    * a regexp might return capture-groups with numberd-keys
  * `target: string | function(subject: string, params?: object): string`
    * a function might recieve properties from the matcher as second argument
    * a string might contain template-literals like `${var}`. 

## Redirect URLs

You can use both, relative and absolute URLs. Relative URLs only match if config `site.domain` equals the request's hostname.
If you need to redirect from different domains (i.e. from a sub-domain to the main-domain), use absolute URLs.
