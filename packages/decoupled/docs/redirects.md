# Redirects

## Define Redirects

* Redirects are usually defined in each site's config `router.redirects`.
* Redirects can operate on the whole URL or just the path-section.
* The config consists of an array of objects with the following properties:
  * `url: string | RegExp | function(subject: string): object | boolean`
    * string:
      * can be an exact string to match
      * can contain wildcards (`*`) to match any part of the URL
      * the path-section may contain named segments in [url-pattern](https://www.npmjs.com/package/url-pattern)-format. 
        I.e. `/api/user/:id`. Named-segment can't be used in the host-section of the URL though!
      * wildcards and named sections are available as placeholders to the `target`.
    * RegExp:
      * any valid RegExp can be specified
      * capture-groups are available as placeholders in numbered sequence to the `target`.
    * function:
      * a custom matcher-function that receives the requested URL and returns either a
        boolean (whether it matches) or an object with placeholder values.
  * `path: string | RegExp | function(subject: string): object | boolean`
    * works similar to the `url`-matching
    * paths are always relative to the site, they have been defined for.
  * `target: string | function(subject: string, placeholders?: object): string`
    * string:
      * the target-URL for the redirect.
      * can contain placeholders like `${var}`. Placeholders are provided by named-sections, wildcards
        or capture-groups. For named-sections, the placeholders are named accordingly. For wildcards or
        capture-groups, they are named `${$n}`, where `n` is the index of the resulting RegExp match.
    * function:
      * returns a string for the URL to redirect to.
      * the second argument may be an object of placeholders from the matcher.

  * `resolver: function(url: string, req: Request, redirect: Redirect): string | null`
    * The resolver allows to fully customize redirect handling, by receiving the requested URL
      and returning the target-URL.
    * if the request doesn't match, it is expected to return `null`.
    * an alternative way for specifying the resolver is to provide the function directly to the config,
      instead of using the redirect-object.

## Redirect URLs

You can use both, relative and absolute URLs. Relative URLs only match if config `site.domain` equals the request's hostname.
If you need to redirect from different domains (i.e. from a sub-domain to the main-domain), use absolute URLs.
