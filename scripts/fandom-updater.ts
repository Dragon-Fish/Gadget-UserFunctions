import { execSync } from 'child_process'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { MwApi } from 'wiki-saikou'

const WIKI_ENDPOINT = 'https://dev.fandom.com/api.php'
const FANDOM_AUTH_ENDPOINT =
  'https://services.fandom.com/mobile-fandom-app/fandom-auth/login'
const WIKI_TITLE = 'MediaWiki:UserFunctions.js'
const FILE_NAME = resolve(__dirname, '../lib/index.js')

;(async () => {
  const app = new MwApi(WIKI_ENDPOINT)

  // @TODO [Temporary!] Unstable internal API for Fandom authorization.
  await app.ajax
    .post(FANDOM_AUTH_ENDPOINT, {
      username: process.env.MW_USERNAME,
      password: process.env.MW_PASSWORD,
    })
    .then(({ data, headers }) => {
      app.cookies.access_token = data?.access_token
      const rawCookies = headers['set-cookie']
      rawCookies?.forEach((i) => {
        const [name, ...value] = i.split(';')[0].split('=')
        app.cookies[name] = value.join('=')
      })
      return app.getUserInfo()
    })
    .then((userinfo) => {
      if (!userinfo.id) return Promise.reject('Missing userInfo')
      console.info('[LOGIN PASS]', `User:${userinfo.name}`)
    })
    .catch((e) => {
      console.error('[Login ERROR]', e)
      throw e
    })

  const gitLog = execSync('git log -n 1 --pretty="format:%h %s by @%an"')
    .toString()
    .trim()
  const summary = `[GitHub] ${gitLog}`
  const text = (await readFile(FILE_NAME)).toString()

  await app
    .postWithToken('csrf', {
      action: 'edit',
      title: WIKI_TITLE,
      text,
      summary,
    })
    .then(({ data }) => {
      console.log('[Submit DONE]', data)
    })
    .catch((e) => {
      console.error('[Submit ERROR]', e)
      throw e
    })
})()
