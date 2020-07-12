# @aleclarson/ga-lite ![npm](https://img.shields.io/npm/v/@aleclarson/ga-lite)

Fork of [google-analytics-lite](https://github.com/ShirasawaSama/google-analytics-lite)

## Changelog

- **0.2.2**
  - Stop using `URLSearchParams` for React Native compatibility [(b443793)](https://github.com/aleclarson/ga-lite/commit/b44379382a98f58b5468e56d35d074b4da2cb6db)
  - Add `shouldSend` option to constructor [(39579e7)](https://github.com/aleclarson/ga-lite/commit/39579e7623782a60bb6678d43a2163f23b1c48b3)
  - Make it easier to pass `GAParameters` to `event` method [(3b9965e)](https://github.com/aleclarson/ga-lite/commit/3b9965efbf301af00ae9363ffe0f854e28445baf)
- **0.2.1**
  - Use `tslib` for code reuse [(62a9d8c)](https://github.com/aleclarson/ga-lite/commit/62a9d8cc5b1c6f018b5391dbcb9a247c8920b58d)
- **0.2.0**
  - Remove `random` and `getUUID` exports [(e12c8a6)](https://github.com/aleclarson/ga-lite/commit/e12c8a6c8ce07d73b446168166d86bcd72341558)
  - Rename `default` export to `GoogleAnalytics` [(ec77a0e)](https://github.com/aleclarson/ga-lite/commit/ec77a0e542c05d900580448c519839661085d10f)
  - Remove `Object.assign` polyfill [(22bb893)](https://github.com/aleclarson/ga-lite/commit/22bb893ac97239fa67fa5b5b4cc1a5002b590543)
  - Remove `fetch` property [(0abd7a1)](https://github.com/aleclarson/ga-lite/commit/0abd7a1e31d5bffc378677e77190cd1cd607feab)
  - Add an `options` argument to `GoogleAnalytics` [(bbf722c)](https://github.com/aleclarson/ga-lite/commit/bbf722ce941cd8658d5def27475ea107d9c2f1ed)
    - Added the `GAOptions` type
    - Added the `opts` property
    - Added the `opts.fetch` property
    - Moved the `baseURL` property to `opts.baseURL`
    - Renamed the `defaultValues` property to `params`
    - Removed the `GAAllParameters` type
  - Use `@lukeed/uuid` for speed and code reuse [(72fd64a)](https://github.com/aleclarson/ga-lite/commit/72fd64ae61c4456db452df83f65807b2cdab51eb)
