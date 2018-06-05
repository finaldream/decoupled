/**
 * Merges default- and custom-routes.
 * By default will order the default-routes after the custom-routes.
 * A default-route can be inserted at any point, by exactly specifying it as a custom-route, but leaving the
 * handler empty (method and route-fields will be compared).
 *
 * @param defaultRoutes
 * @param customRoutes
 * @return {*}
 */

export const collectRoutes = (defaultRoutes: any[] = [], customRoutes: any[]) => {

    if (!customRoutes || !Array.isArray(customRoutes) || !customRoutes.length) {
        return defaultRoutes;
    }

    // Clone customRoutes
    const result = customRoutes.slice();

    defaultRoutes.forEach((defaultRoute) => {

        // check if a custom-route matches a default-route, but has no handler defined
        const index = result.findIndex((customRoute) =>
            defaultRoute.method === customRoute.method
            && defaultRoute.route === customRoute.route
            && !customRoute.handler,
        );

        // if there's a match, insert the default-route here
        if (index !== -1) {
            result[index] = defaultRoute;
        } else {
            // if not, push it to the end of the array
            result.push(defaultRoute);
        }

    });

    return result;

};
