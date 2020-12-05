import randomId from 'uid'

const isWeb = typeof window.document !== 'undefined'

export interface GAOptions {
  debug?: boolean
  appName?: string
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

  pageView(path: string, params: GAParameters = {}) {
    params.t = isWeb ? 'pageview' : 'screenview'
    if (isWeb) {
      params.dh = document.location.host
      params.dp = path
    } else {
      params.cd = path
      params.an = this.opts.appName
    }
    return this.post(params)
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
    return this.post({ ...params, t: 'event', ec, ea, el, ev })
  }

  async post(params: GAParameters) {
    params = { ...this.params, ...params }

    const {
      debug,
      baseURL = `https://www.google-analytics.com/${
        debug ? 'debug/' : ''
      }collect`,
      shouldSend,
    } = this.opts

    if (shouldSend && !(await shouldSend(params))) {
      return false
    }

    const err = Error(`Network request failed (${baseURL})`)
    return new Promise<boolean>((resolve) => {
      const xhr = new XMLHttpRequest()

      xhr.open('POST', baseURL)
      xhr.setRequestHeader('cache', 'no-cache')
      xhr.responseType = debug ? 'json' : 'arraybuffer'

      interface ParserMessage {
        description: string
      }
      interface HitParsingResult {
        valid: boolean
        parserMessage: ParserMessage[]
      }
      interface DebugResponse {
        hitParsingResult: HitParsingResult[]
      }

      xhr.onload = () => {
        if (debug) {
          const failure = (xhr.response as DebugResponse).hitParsingResult.find(
            (res) => !res.valid
          )
          if (failure) {
            err.message =
              '[ga-lite] Invalid request: ' +
              failure.parserMessage[0].description

            console.error(err, params)
          } else {
            console.debug('[ga-lite] Accepted request:', params)
          }
        }
        resolve(true)
      }

      xhr.onerror = () => {
        console.error(err)
        resolve(false)
      }

      xhr.send(encodeSearchParams(params))
    })
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

export interface GAParameters {
  [key: string]: string | number | boolean | undefined | string[]

  /** The type of hit. */
  t?:
    | 'pageview'
    | 'screenview'
    | 'event'
    | 'transaction'
    | 'item'
    | 'social'
    | 'exception'
    | 'timing'

  /**
   * This is intended to be a known identifier for a user provided by the site
   * owner/library user.
   *
   * It **must not** itself be PII (personally identifiable information).
   *
   * The value should never be persisted in Google Analytics cookies or other
   * Analytics provided storage.
   */
  uid?: string

  /**
   * Used to control the session duration.
   *
   * A value of `start` forces a new session to start with this hit and `end`
   * forces the current session to end with this hit.
   */
  sc?: 'start' | 'end'

  /** Consider this hit to be non-interactive. */
  ni?: boolean

  /**
   * When present, the IP address of the sender will be anonymized.
   *
   * For example, the IP will be anonymized if any of the following parameters
   * are present in the payload: &aip=, &aip=0, or &aip=1
   */
  aip?: boolean
  /**
   * The IP address of the user. This should be a valid IP address in IPv4 or
   * IPv6 format. It will always be anonymized just as though &aip (anonymize IP)
   * had been used.
   */
  uip?: string
  /**
   * The User Agent of the browser. Note that Google has libraries to identify
   * real user agents. Hand crafting your own agent could break at any time.
   */
  ua?: string
  /**
   * The geographical location of the user. The geographical ID should be a two
   * letter country code or a criteria ID representing a city or region
   * (see https://bit.ly/2Oj12qs).
   *
   * This parameter takes precedent over any location derived from IP address,
   * including the IP Override parameter. An invalid code will result in
   * geographical dimensions to be set to '(not set)'.
   */
  geoid?: string
  /** Indicates the data source of the hit. */
  ds?: string
  /**
   * Used to collect offline / latent hits. The value represents the time
   * delta (in milliseconds) between when the hit being reported occurred
   * and the time the hit was sent.
   *
   * The value must be greater than or equal to 0. Values greater than four
   * hours may lead to hits not being processed.
   */
  qt?: number

  /**
   * Specifies which referral source brought traffic to a website. This value
   * is also used to compute the traffic source. The format of this value is a URL.
   */
  dr?: string
  /** The campaign name. */
  cn?: string
  /** The campaign source. */
  cs?: string
  /** The campaign medium. */
  cm?: string
  /** The campaign keyword. */
  ck?: string
  /** The campaign content. */
  cc?: string
  /** The campaign ID. */
  ci?: string
  /** The Google Ad ID. */
  gclid?: string
  /** The Google Display Ads ID. */
  dclid?: string

  /** The screen resolution. */
  sr?: string
  /** The viewable area of the browser / device. */
  vp?: string
  /** The character set used to encode the page / document. */
  de?: string
  /** The screen color depth. */
  sd?: string
  /** The user language. */
  ul?: string
  /** Whether or not Java is enabled. */
  je?: string
  /** The flash version. */
  fl?: string

  /**
   * The application name.
   *
   * This field is required for any hit that has app related data (i.e., app
   * version, app ID, or app installer ID). For hits sent to web properties,
   * this field is optional.
   */
  an?: string
  /** The application identifier. */
  aid?: string
  /** The application version. */
  av?: string
  /** The application installer identifier. */
  aiid?: string

  /**
   * Use this parameter to send the full URL (document location) of the page on
   * which content resides. You can use the &dh and &dp parameters to override
   * the hostname and path + query portions of the document location, accordingly.
   *
   * The JavaScript clients determine this parameter using the concatenation of
   * the `document.location.origin + document.location.pathname + document.location.search`
   * browser parameters. Be sure to remove any user authentication or other
   * private information from the URL if present.
   *
   * For `pageview` hits, either &dl or both &dh and &dp have to be specified
   * for the hit to be valid.
   */
  dl?: string
  /** The hostname from which content was hosted. */
  dh?: string
  /**
   * The path portion of the page URL. Should begin with `/`.
   *
   * For `pageview` hits, either &dl or both &dh and &dp have to be specified
   * for the hit to be valid.
   */
  dp?: string
  /** The title of the page / document. */
  dt?: string
  /**
   * This parameter is optional on web properties, and required on mobile
   * properties for screenview hits, where it is used for the 'Screen Name' of
   * the screenview hit. On web properties, this will default to the unique URL
   * of the page by either using the &dl parameter as-is or assembling it from
   * &dh and &dp.
   */
  cd?: string

  /**
   * The ID of a clicked DOM element, used to disambiguate multiple links to
   * the same URL in In-Page Analytics reports when Enhanced Link Attribution
   * is enabled for the property.
   */
  linkid?: string

  cg1?: string | string[]
  cg2?: string | string[]
  cg3?: string | string[]
  cg4?: string | string[]
  cg5?: string | string[]
}
