import genUUID from '@lukeed/uuid'

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
  baseURL?: string
  fetch?: typeof fetch
  shouldSend?: (data: GAParameters) => boolean | Promise<boolean>
}

/**
 * https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
 */
export class GoogleAnalytics {
  readonly opts: Readonly<Required<GAOptions>>
  /** Default search parameters for every request */
  readonly params: GAParameters & {
    readonly v: number
    readonly tid: string
    readonly cid: string
  }

  constructor(tid: string, opts: GAOptions = {}) {
    const {
      baseURL = 'https://www.google-analytics.com/collect',
      fetch = globalThis.fetch,
      shouldSend = () => true,
    } = opts

    this.opts = { baseURL, fetch, shouldSend }
    this.params = {
      v: 1,
      tid,
      cid: genUUID(),
    }
  }

  pageView(
    dl: null | undefined,
    dh: string,
    dp: string,
    other?: GAParameters
  ): Promise<boolean>

  pageView(
    dl: string,
    dh?: string,
    dp?: string,
    other?: GAParameters
  ): Promise<boolean>

  pageView(
    dl: string | null | undefined,
    dh?: string,
    dp?: string,
    other?: GAParameters
  ) {
    if (dl == null) dl = undefined
    return this.post({ ...other, dl, dh, dp })
  }

  event(
    ec: string,
    ea: string,
    el?: string,
    ev?: number,
    other?: GAParameters
  ): Promise<boolean>

  event(
    ec: string,
    ea: string,
    el?: string,
    other?: GAParameters
  ): Promise<boolean>

  event(ec: string, ea: string, other?: GAParameters): Promise<boolean>

  event(
    ec: string,
    ea: string,
    el?: string | GAParameters,
    ev?: number | GAParameters,
    other?: GAParameters
  ) {
    if (el && typeof el !== 'string') {
      ev = el = void (other = el)
    } else if (ev && typeof ev !== 'number') {
      ev = void (other = ev)
    }
    return this.post({ ...other, ec, ea, el, ev })
  }

  exception(exd?: string, exf?: boolean, other?: GAParameters) {
    return this.post({ ...other, exd, exf })
  }

  social(sn: string, sa: string, st: string, other?: GAParameters) {
    return this.post({ ...other, sn, sa, st })
  }

  post(data: GAParameters) {
    const { fetch, baseURL, shouldSend } = this.opts

    return Promise.resolve()
      .then(() => shouldSend(data))
      .then(
        (sending) =>
          sending &&
          fetch(baseURL, {
            method: 'POST',
            cache: 'no-cache',
            body: this.genSearchParams(data).toString().replace(/%25/g, '%'),
          }).then(
            (res) => res.ok,
            (e) => {
              console.error(e)
              return false
            }
          )
      )
  }

  genSearchParams(data: GAParameters) {
    const body = new URLSearchParams()
    const d = { ...this.params, ...data }

    for (const key in d) {
      let value = d[key]

      if (key.startsWith('cg')) {
        value = Array.isArray(value) ? value.join('/') : undefined
      }

      switch (typeof value) {
        case 'boolean':
          body.append(key, (+value).toString())
          break
        case 'string':
          body.append(key, encodeURIComponent(value))
          break
        case 'number':
          body.append(key, value.toString())
      }
    }
    return body
  }
}
