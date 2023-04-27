/**
 * @name UserFunctions.js
 * @description Provides functions similar to Extension:UserFunctions
 *              based on JavaScript.
 * @author 机智的小鱼君 <dragon-fish@qq.com>
 *
 * @url https://github.com/Fandom-zh/Gadget-UserFunctions
 * @license MIT
 */

class UserFunctions {
  private _elements: JQuery<HTMLElement>
  readonly userName = mw.config.get('wgUserName')
  readonly userGroups = mw.config.get('wgUserGroups')
  readonly isLoggedIn = !mw.user.isAnon()

  constructor(selector: string | JQuery<HTMLElement>) {
    this._elements = $(selector as string)
  }

  get elements() {
    return this._elements
  }
  set elements(selector: string | JQuery<HTMLElement>) {
    this._elements = $(selector as string)
  }

  init() {
    this._elements.each((_, element) => {
      const $el = $(element)
      const username = $el.data('username') !== undefined
      const ifLoggedIn = $el.data('if-logged-in') !== undefined
      const ifUserName = $el.data('if-username') !== undefined
      const ifUserGroup = $el.data('if-usergroup') !== undefined

      if (username) {
        this.handleUserName($el)
      } else if (ifLoggedIn) {
        this.handleIfLoggedIn($el)
      } else if (ifUserName) {
        this.handleIfUserName($el)
      } else if (ifUserGroup) {
        this.handleIfUserGroup($el)
      } else {
        this.handleUnknown($el)
      }
    })
  }

  handleUserName($el: JQuery<HTMLElement>) {
    const text = $el.text()
    $el.html('')
    if ($el.data('with-link') !== undefined) {
      $el.append(
        $('<a>', {
          href: mw.util.getUrl(`User:${this.userName}`),
          text: text || this.userName,
        })
      )
    } else {
      $el.text(this.userName)
    }
    $el.attr('data-user-fn-hit', 'true')
    return $el
  }

  handleIfLoggedIn($el: JQuery<HTMLElement>) {
    const yes = UserFunctions.parseBool($el.data('if-logged-in'))
    const show = (yes && this.isLoggedIn) || (!yes && !this.isLoggedIn)
    $el.toggle(show).attr('data-user-fn-hit', '' + show)
    return $el
  }

  handleIfUserName($el: JQuery<HTMLElement>) {
    const users = {
      ['' + this.userName]: false,
      ...UserFunctions.parseBoolMap($el.data('if-username')),
    }
    const show = !!users['' + this.userName]
    $el.toggle(show).attr('data-user-fn-hit', '' + show)
    return $el
  }

  handleIfUserGroup($el: JQuery<HTMLElement>) {
    const groups = UserFunctions.parseBoolMap($el.data('if-usergroup'))
    let show = false
    Object.keys(groups).forEach((key) => {
      const yes = groups[key]
      if (
        (yes && this.userGroups.includes(key)) ||
        (!yes && !this.userGroups.includes(key))
      ) {
        show = true
      } else {
        show = false
      }
    })
    $el.toggle(show).attr('data-user-fn-hit', '' + show)
    return $el
  }

  handleUnknown($el: JQuery<HTMLElement>) {
    $el.html('')
    $el
      .append(
        $('<em>', {
          class: 'error user-functions-error',
        }).append(
          $('<strong>', {
            text: '[Error] UserFunctions.js: Unknown handler or missing data-* attribute.',
          }),
          ' [',
          $('<a>', {
            href: 'https://github.com/Fandom-zh/Gadget-UserFunctions',
            target: '_blank',
            text: 'see documentation',
          }),
          ']'
        )
      )
      .attr('data-user-fn-hit', 'true')
      .attr('data-user-fn-error', 'true')
  }

  /**
   * Get standard compare boolean map
   * @example toBoolMap('foo|!bar') === { foo: true, bar: false }
   */
  static parseBoolMap(data: string) {
    const arr = data.split('|')
    const map: Record<string, boolean> = {}
    arr.forEach((item) => {
      const key = item.trim().replace(/^!/, '')
      map[key] = !item.startsWith('!')
    })
    return map
  }

  /**
   * Data is means yes or no
   * - `false`, `no`, `n`, `0` → `false`
   * - others → `true`
   */
  static parseBool(data: any) {
    return ![false, 'false', 'no', 'n', 0, '0'].includes(data)
  }
}

// Define global variable
interface Window {
  dev: {
    UserFunctions: typeof UserFunctions
  }
}
window.dev = { ...window.dev, UserFunctions }

// Run
const app = new UserFunctions('.user-functions, .UserFunctions')
app.init()
