# @aleclarson/ga-lite ![npm](https://img.shields.io/npm/v/@aleclarson/ga-lite)

Fork of [google-analytics-lite](https://github.com/ShirasawaSama/google-analytics-lite)

## Changelog

- **0.3.0**
  - Make the `pageView` method send a "screenview" hit when called from a non-web environment [(22fb94e)](https://github.com/aleclarson/ga-lite/commit/22fb94e)
  - Add inline documentation to every `GAParameters` property [(13f8e9b)](https://github.com/aleclarson/ga-lite/commit/13f8e9b)
  - Add `debug` option [(c74c765)](https://github.com/aleclarson/ga-lite/commit/c74c765)
  - Remove `social` and `exception` methods [(a11b4cd)](https://github.com/aleclarson/ga-lite/commit/a11b4cd)
  - Use `uid` for code reuse [(c9fe40a)](https://github.com/aleclarson/ga-lite/commit/c9fe40a)
  - 🐛 Pass `&t` for "pageview" and "event" hits [(531442d)](https://github.com/aleclarson/ga-lite/commit/531442d)
- **0.2.3**
  - Stop using `@lukeed/uuid` for React Native compatibility [(4aa7051)](https://github.com/aleclarson/ga-lite/commit/4aa7051)
- **0.2.2**
  - Stop using `URLSearchParams` for React Native compatibility [(b443793)](https://github.com/aleclarson/ga-lite/commit/b443793)
  - Add `shouldSend` option to constructor [(39579e7)](https://github.com/aleclarson/ga-lite/commit/39579e7)
  - Make it easier to pass `GAParameters` to `event` method [(3b9965e)](https://github.com/aleclarson/ga-lite/commit/3b9965e)
- **0.2.1**
  - Use `tslib` for code reuse [(62a9d8c)](https://github.com/aleclarson/ga-lite/commit/62a9d8c)
- **0.2.0**
  - Remove `random` and `getUUID` exports [(e12c8a6)](https://github.com/aleclarson/ga-lite/commit/e12c8a6)
  - Rename `default` export to `GoogleAnalytics` [(ec77a0e)](https://github.com/aleclarson/ga-lite/commit/ec77a0e)
  - Remove `Object.assign` polyfill [(22bb893)](https://github.com/aleclarson/ga-lite/commit/22bb893)
  - Remove `fetch` property [(0abd7a1)](https://github.com/aleclarson/ga-lite/commit/0abd7a1)
  - Add an `options` argument to `GoogleAnalytics` [(bbf722c)](https://github.com/aleclarson/ga-lite/commit/bbf722c)
    - Added the `GAOptions` type
    - Added the `opts` property
    - Added the `opts.fetch` property
    - Moved the `baseURL` property to `opts.baseURL`
    - Renamed the `defaultValues` property to `params`
    - Removed the `GAAllParameters` type
  - Use `@lukeed/uuid` for speed and code reuse [(72fd64a)](https://github.com/aleclarson/ga-lite/commit/72fd64a)
