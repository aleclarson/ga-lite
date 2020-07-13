import randomId from 'uid'

export interface GAParameters {
  [key: string]: string | number | boolean | undefined | string[]

  t?: string
  uid?: string

  sc?: 'start' | 'end'
  ni?: boolean

  aip?: boolean
  uip?: string
  ua?: string
  geoid?: string
  ds?: string
  qt?: number

  dr?: string
  cn?: string
  cs?: string
  cm?: string
  ck?: string
  cc?: string
  ci?: string
  gclid?: string
  dclid?: string

  sr?: string
  vp?: string
  de?: string
  sd?: string
  ul?: string
  je?: string
  fl?: string

  an?: string
  aid?: string
  av?: string
  aiid?: string

  dl?: string
  dh?: string
  dp?: string
  dt?: string

  linkid?: string

  cg1?: string[]
  cg2?: string[]
  cg3?: string[]
  cg4?: string[]
  cg5?: string[]
}

export interface GAOptions {
  debug?: boolean
  fetch?: typeof fetch
  baseURL?: string
  shouldSend?: (params: GAParameters) => boolean | Promise<boolean>
}

/**
 * https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
 */
export class GoogleAnalytics {
  readonly opts: GAOptions
  /** Default search parameters for every request */
  readonly params: GAParameters & {
    readonly v: number
    readonly tid: string
    readonly cid: string
  }

  constructor(tid: string, opts: GAOptions = {}) {
    this.opts = opts
    this.params = {
      v: 1,
      tid,
      cid: randomId(),
    }
  }

  pageView(
    dl: null | undefined,
    dh: string,
    dp: string,
    params?: GAParameters
  ): Promise<boolean>

  pageView(
    dl: string,
    dh?: string,
    dp?: string,
    params?: GAParameters
  ): Promise<boolean>

  pageView(
    dl: string | null | undefined,
    dh?: string,
    dp?: string,
    params?: GAParameters
  ) {
    if (dl == null) dl = undefined
    return this.post({ ...params, dl, dh, dp })
  }

  event(
    ec: string,
    ea: string,
    el?: string,
    ev?: number,
    params?: GAParameters
  ): Promise<boolean>

  event(
    ec: string,
    ea: string,
    el?: string,
    params?: GAParameters
  ): Promise<boolean>

  event(ec: string, ea: string, params?: GAParameters): Promise<boolean>

  event(
    ec: string,
    ea: string,
    el?: string | GAParameters,
    ev?: number | GAParameters,
    params?: GAParameters
  ) {
    if (el && typeof el !== 'string') {
      ev = el = void (params = el)
    } else if (ev && typeof ev !== 'number') {
      ev = void (params = ev)
    }
    return this.post({ ...params, ec, ea, el, ev })
  }

  post(params: GAParameters) {
    params = { ...this.params, ...params }

    const {
      debug,
      fetch = globalThis.fetch,
      baseURL = `https://www.google-analytics.com/${
        debug ? 'debug/' : ''
      }collect`,
      shouldSend,
    } = this.opts

    return Promise.resolve()
      .then(() => !shouldSend || shouldSend(params))
      .then(
        (sending) =>
          sending &&
          fetch(baseURL, {
            method: 'POST',
            cache: 'no-cache',
            body: encodeSearchParams(params),
          }).then(
            (res) => {
              if (debug) {
                res.json().then((data) =>
                  data.hitParsingResult.some((res: any) => !res.valid)
                    ? console.warn('[ga-lite] Invalid request:', {
                        params,
                        ...data,
                      })
                    : console.debug('[ga-lite] Accepted request:', {
                        params,
                        ...data,
                      })
                )
              }
              return res.ok
            },
            (e) => {
              console.error(e)
              return false
            }
          )
      )
  }
}

function encodeSearchParams(params: GAParameters) {
  let result = ''

  for (const key in params) {
    let value: any = params[key]
    if (/^cg[1-5]$/.test(key) && Array.isArray(value)) {
      value = value.join('/')
    }

    const type = typeof value
    value =
      type == 'boolean'
        ? +value
        : type == 'string'
        ? encodeURIComponent(value)
        : type == 'number'
        ? value
        : ''

    if (value !== '') {
      result += (result ? '&' : '') + encodeURIComponent(key) + '=' + value
    }
  }

  return result
}
