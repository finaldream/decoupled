# Release Management

## update core dependencies

If the decoupled core introduces breaking changes in it's external interface, dependencies for other 
packages should be adjusted.
If already present, this will update `devDependencies.decoupled` and `peerDependencies.decoupled` for each package 
with the new value. It will not add decoupled core as new dependency in the first place.

To do so, run: 

```
yarn update-core-deps ^0.22.0
yarn update-core-deps "'>=0.22.0'"
```

:warning: You may need to **DOUBLE-qoute versions starting with `<` or `>` like `"'VERSION'"`,
else you might get an error `Error: Wrong number of argument(s). Got 0, expected exactly 1.`,
despite actually passing an argument. Passing other constraints, i.e. `^0.22.0` works without quotes. 

## Clearing the build folders

Run `yarn clean:build` to remove all build folders (`/packages/PACKAGE/lib`)

## Manually releasing to npm:

```
yarn new-version <package>
lerna bootstrap
lerna publish
```
