const { readFileSync } = require('fs')
const path = require('path')
const { MediaWikiJS } = require('@lavgup/mediawiki.js')
const { execSync } = require('child_process')

// Construct bot
const bot = new MediaWikiJS({
  url: 'https://dev.fandom.com/api.php',
  botUsername: process.env.MW_USERNAME,
  botPassword: process.env.MW_PASSWORD,
})

// Get latest log
const gitLog = execSync('git log -n 1')
  .toString()
  .trim()
  .split('\n')
  .pop()
  .trim()

bot.login().then(() => {
  const res = await bot.edit({
    title: 'MediaWiki:UserFunctions.js',
    content: readFileSync(path.resolve(__dirname, '../lib/index.js')).toString(
      'utf8'
    ),
    summary: `[Automatic] ${gitLog} // Sync from GitHub`,
  })
  console.log('All done', res)
})
