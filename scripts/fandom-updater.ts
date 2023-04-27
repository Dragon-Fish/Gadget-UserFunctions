import { execSync } from 'child_process'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { MwApi } from 'wiki-saikou'

const WIKI_ENDPOINT = 'https://dev.fandom.com/api.php'
const WIKI_TITLE = 'MediaWiki:UserFunctions.js'
const FILE_NAME = resolve(__dirname, '../lib/index.js')

const app = new MwApi(WIKI_ENDPOINT)
app
  .login(process.env.MW_USERNAME as string, process.env.MW_PASSWORD as string)
  .then(async () => {
    const gitLog = execSync('git log -n 1 --pretty="format:%h %s by @%an"')
      .toString()
      .trim()
    const summary = `[GitHub] ${gitLog}`

    const text = (await readFile(FILE_NAME)).toString()

    const result = await app.postWithToken('csrf', {
      action: 'edit',
      title: WIKI_TITLE,
      text,
      summary,
    })

    console.log('All done', result.data)
  })
