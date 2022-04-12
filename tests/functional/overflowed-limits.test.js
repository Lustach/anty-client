const { openBrowser, goto, reload, closeBrowser, $, click } = require('taiko')
const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mjg2LCJ1c2VybmFtZSI6InRlc3Q4QGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsInRlYW1JZCI6MTcxfQ.FXZ7vvtyTRsg1LyxvQTSK2V-ootJJJQcu3XENqJV6hI'
const assert = require('assert')

describe('Overflowed limits', () => {
  beforeAll(async () => {
    await openBrowser()
    await goto('localhost:8080/#/login?token=' + ACCESS_TOKEN)
    await reload()
  }, 60000)

  test('Sidebar buttons should be disabled', async () => {
    let element = await $('#sidebarProxy').attribute('aria-disabled')
    assert.ok(element)

    element = await $('#sidebarBookmarks').attribute('aria-disabled')
    assert.ok(element)

    element = await $('#sidebarExtensions').attribute('aria-disabled')
    assert.ok(element)

    element = await $('#sidebarApi').attribute('aria-disabled')
    assert.ok(element)

    element = await $('#sidebarAutomation').attribute('aria-disabled')
    assert.ok(element)

    element = await $('#sidebarSettings').attribute('aria-disabled')
    assert.ok(element)

    element = await $('#sidebarFeedback').attribute('aria-disabled')
    assert.ok(element)

    element = await $('#sidebarLanguage').attribute('aria-disabled')
    assert.ok(element)

    element = await $('#sidebarDarkMode').attribute('aria-disabled')
    assert.ok(element)
  }, 60000)

  test('Main buttons should be disabled', async () => {
    let element = await $('#browserProfilesDialogAddButton').isDisabled()
    assert.ok(element)

    element = await $('#browserProfilesCustomizeColumnsButton').isDisabled()
    assert.ok(element)

    element = await $('#infoBarDebug').attribute('class')
    assert.match(element, /anty-adsmanager-main-table-link-disabled/)

    element = await $('#antyHealthButton').attribute('class')
    assert.match(element, /anty-adsmanager-main-table-link-disabled/)
  }, 60000)

  test('Create button in users tab should be disabled', async () => {
    await click($('#sidebarUsers'))
    const element = await $('#usersAddButton').isDisabled()
    assert.ok(element)
  }, 60000)

  afterAll(async () => {
    await closeBrowser()
  }, 60000)
})
