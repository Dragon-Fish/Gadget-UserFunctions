/**
 * @name UserFunctions.js
 * @description Provides functions similar to [[mw:Extension:UserFunctions]]
 * @author 机智的小鱼君 <dragon-fish@qq.com>
 *
 * @url https://github.com/Fandom-zh/Gadget-UserFunctions
 * @license MIT
 */

/**
 * @example ```xml
 * <span class="user-functions" data-username></span>
 * <span class="user-functions" data-if-logged-in="{true | false}"></span>
 * <span class="user-functions" data-if-username="{string | string[]}"></span>
 * <span class="user-functions" data-if-usergroup="{string | string[]}"></span>
 * ```
 */

class UserFunctions {
  private _el: JQuery<HTMLElement>
  userName: string
  userGroups: string[]
  isLoggedIn: boolean

  constructor(
    selector: string | JQuery<HTMLElement> = '.user-functions, .UserFunctions'
  ) {
    this._el = $(selector as string)
    this.userName = mw.config.get('wgUserName')
    this.userGroups = mw.config.get('wgUserGroups')
    this.isLoggedIn = this.userName !== null
  }

  set $elements(selector: string | JQuery<HTMLElement>) {
    this._el = $(selector as string)
  }

  init() {
    this._el.each((index, element) => {
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

  /**
   * Get standard compare boolean map
   * @example toBoolMap('foo|!bar') === { foo: true, bar: false }
   */
  toBoolMap(data: string) {
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
  toBoolean(data: any) {
    return ![false, 'false', 'no', 'n', 0, '0'].includes(data)
  }

  handleUserName($el: JQuery<HTMLElement>) {
    $el.html('')
    if ($el.data('with-link') !== undefined) {
      $el.append(
        $('<a>', {
          href: mw.util.getUrl(`User:${this.userName}`),
          text: this.userName,
        })
      )
    } else {
      $el.text(this.userName)
    }
    $el.attr('userfunctions-hit', 'true')
    return $el
  }

  handleIfLoggedIn($el: JQuery<HTMLElement>) {
    const yes = this.toBoolean($el.data('if-logged-in'))
    const show = (yes && this.isLoggedIn) || (!yes && !this.isLoggedIn)
    $el.toggle(show).attr('data-userfunctions-hit', '' + show)
    return $el
  }

  handleIfUserName($el: JQuery<HTMLElement>) {
    const users = this.toBoolMap($el.data('if-username'))
    const show = !!users[this.userName]
    $el.toggle(show).attr('data-userfunctions-hit', '' + show)
    return $el
  }

  handleIfUserGroup($el: JQuery<HTMLElement>) {
    const map = this.toBoolMap($el.data('if-usergroup'))
    let show = false
    for (const group in map) {
      const yes = map[group]
      if (
        (yes && this.userGroups.includes(group)) ||
        (!yes && !this.userGroups.includes(group))
      ) {
        show = true
      } else {
        show = false
      }
    }
    $el.toggle(show).attr('data-userfunctions-hit', '' + show)
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
      .attr('data-userfunctions-hit', 'true')
      .attr('data-userfunctions-error', 'true')
  }
}

const app = new UserFunctions()
app.init()
