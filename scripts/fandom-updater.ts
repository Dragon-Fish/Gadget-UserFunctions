import { execSync } from 'child_process'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { MwApi } from 'wiki-saikou'

const WIKI_ENDPOINT = 'https://dev.fandom.com/api.php'
const WIKI_TITLE = 'MediaWiki:UserFunctions.js'
const FILE_NAME = resolve(__dirname, '../lib/index.js')

;(async () => {
  const app = new MwApi(WIKI_ENDPOINT)
  // @FIXME this is not work for Fandom
  await app
    .login(process.env.MW_USERNAME as string, process.env.MW_PASSWORD as string)
    .then((data) => {
      if (data.status !== 'PASS') {
        return Promise.reject(data)
      }
      console.info(`[Login ${data.status}]`, data)
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
