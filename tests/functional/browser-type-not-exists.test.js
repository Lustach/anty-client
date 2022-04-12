const { openBrowser, goto, reload, closeBrowser, $, click, write, into, intercept, hover, clear } = require('taiko')
const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTU3NywidXNlcm5hbWUiOiJicm93c2VyLXR5cGUtbm90LWV4aXN0cy50ZXN0QGFudHkuY29tIiwicm9sZSI6ImFkbWluIiwidGVhbUlkIjoxMzUzNH0.h6aqZ0YAqWDx6LQ1icRjXIQRDFAqLK7iO2hvmL9-byk'
const assert = require('assert').strict

describe('Not existing browser type', () => {
  beforeAll(async () => {
    await openBrowser()
    await goto('localhost:8080/#/login?token=' + ACCESS_TOKEN)
    await reload()

    await click($('#browserProfilesDialogAddButton'))
    await write('browser-type-not-exists.test', into($('#browserProfilesMainDialogFieldName')))
    await click($('#browserProfilesMainDialogMainButton'))
    await $('#alert .v-snack__wrapper').isVisible()
    await click($('#alertClose'))

    await intercept('https://dev.anty-api.com/browser_profiles', async (req) => {
      if (req.request.method === 'POST') {
        const postData = JSON.parse(req.request.postData)
        await assert.equal(postData.browserType, 'anty')
      }
      return req.continue()
    })
  }, 60000)

  test('Browser type should not exist in main dialog', async () => {
    await click($('#browserProfilesDialogAddButton'))
    await assert.ok(!await $('#main-dialog-browser-type').exists(0, 0))
    await click($('#browserProfilesMainDialogButtonClose'))
  }, 60000)

  test('Profiles should be created with browser type anty by default', async () => {
    await click($('#browserProfilesDialogAddButton'))
    await write('browser-type-not-exists.test', into($('#browserProfilesMainDialogFieldName')))
    await click($('#browserProfilesMainDialogMainButton'))
    await $('#alert .v-snack__wrapper').isVisible()
    await click($('#alertClose'))
  }, 60000)

  test('Copied profiles should be created with browser type anty by default', async () => {
    await hover($('#browserProfilesMainTableProfileActions'))
    await click($('#browserProfilesMainTableBrowserProfileCopyProfile'))
    await clear($('#profilesCopyDialogCopiesNumber'))
    await click($('#profilesCopyDialogButtonCopy'))
    await $('#alert .v-snack__wrapper').isVisible()
  }, 60000)

  afterAll(async () => {
    await click($('th .v-data-table__checkbox'))
    await click($('#globalActionDeleteButton'))
    await click($('#browserProfilesActionsDialogDeleteConfirmButton'))
    await closeBrowser()
  }, 60000)
})
