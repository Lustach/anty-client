/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
'use strict'
const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTM2NCwidXNlcm5hbWUiOiJnYXVnZV91bml0QGFudHkuY29tIiwicm9sZSI6ImFkbWluIiwidGVhbUlkIjo1MDl9.LmrsegJgc08Gy6pZ2Y-crNAlEjY8AaXmZB07zMDM1fo'
/* globals gauge */
const path = require('path')
const {
  openBrowser,
  write,
  closeBrowser,
  goto,
  press,
  screenshot,
  above,
  click,
  checkBox,
  listItem,
  toLeftOf,
  link,
  text,
  into,
  textBox,
  evaluate,
  $,
  currentURL
} = require('taiko')
const assert = require('assert')
// const headless = process.env.HEADLESS_CHROME.toLowerCase() === 'true'
const headless = true

beforeSuite(async () => {
  await openBrowser({
    headless: headless
  })
})

beforeSpec(async function () {
  await goto('http://localhost:8080/#/login?token=' + ACCESS_TOKEN)
  await goto('http://localhost:8080')
})

// Environment for browser profiles main dialog
beforeSpec(async function () {
  await goto('http://localhost:8080/#/login?token=' + ACCESS_TOKEN)
  await goto('http://localhost:8080')
  await click($('#browserProfilesDialogAddButton'))
}, { tags: ['browserProfilesMainDialog'] })

// Environment for browser profiles filters bar
beforeSpec(async function () {
  await goto('http://localhost:8080/#/login?token=' + ACCESS_TOKEN)
  await goto('http://localhost:8080')
  await click($('#browserProfilesFiltersButton'))
}, { tags: ['browserProfilesFiltersBar'] })

// Environment for browser profiles customize columns
beforeSpec(async function () {
  await goto('http://localhost:8080/#/login?token=' + ACCESS_TOKEN)
  await goto('http://localhost:8080')
  await click($('#browserProfilesCustomizeColumnsButton'))
}, { tags: ['browserProfilesCustomizeColumns'] })

// Environment for proxies create dialog
beforeSpec(async function () {
  await goto('http://localhost:8080/#/login?token=' + ACCESS_TOKEN)
  await goto('http://localhost:8080')
  await click($('#sidebarProxy'))
  await click($('#proxiesCreateButton'))
}, { tags: ['proxiesCreateDialog'] })

// Environment for bookmarks create dialog
beforeSpec(async function () {
  await goto('http://localhost:8080/#/login?token=' + ACCESS_TOKEN)
  await goto('http://localhost:8080')
  await click($('#sidebarBookmarks'))
  await click($('#bookmarksCreateButton'))
}, { tags: ['bookmarksCreateDialog'] })

// Environment for extensions create dialog
beforeSpec(async function () {
  await goto('http://localhost:8080/#/login?token=' + ACCESS_TOKEN)
  await goto('http://localhost:8080')
  await click($('#sidebarExtensions'))
  await click($('#extensionsCreateButton'))
}, { tags: ['extensionsCreateDialog'] })

// Environment for users create dialog
beforeSpec(async function () {
  await goto('http://localhost:8080/#/login?token=' + ACCESS_TOKEN)
  await goto('http://localhost:8080')
  await click($('#sidebarUsers'))
  await click($('#usersAddButton'))
}, { tags: ['usersCreateDialog'] })

// Environment for statuses create dialog
beforeSpec(async function () {
  await goto('http://localhost:8080/#/login?token=' + ACCESS_TOKEN)
  await goto('http://localhost:8080')
  await click($('#sidebarSettings'))
  await click($('#settingsStatusesTopbarButtonCreate'))
}, { tags: ['settingsStatusesCreateDialog'] })

// Environment for settings
beforeSpec(async function () {
  await goto('http://localhost:8080/#/login?token=' + ACCESS_TOKEN)
  await goto('http://localhost:8080')
  await click($('#sidebarSettings'))
}, { tags: ['settings'] })

afterSuite(async () => {
  await closeBrowser()
})

// Return a screenshot file name
gauge.customScreenshotWriter = async function () {
  const screenshotFilePath = path.join(process.env.gauge_screenshots_dir,
        `screenshot-${process.hrtime.bigint()}.png`)

  await screenshot({
    path: screenshotFilePath
  })
  return path.basename(screenshotFilePath)
}

beforeStep(async function () {
  await click($('#browserProfilesMainDialogTabGeneral'))
}, { tags: ['browserProfilesMainDialogGeneralTab'] })

beforeStep(async function () {
  await click($('#browserProfilesMainDialogTabGeneral'))
  await click($('#browserProfilesMainDialogTabAdditional'))
}, { tags: ['browserProfilesMainDialogAdditionalTabBrowserAnty'] })

step('Element exists <selector>', async function (selector) {
  assert.ok(await $(selector).exists())
})

step('Click <selector>', async function (selector) {
  await click(await $(selector))
})

step('URL is <url>', async function (url) {
  assert.ok(await currentURL() === url)
})

step('Text exists <query>', async function (query) {
  assert.ok(await text(query).exists())
})
