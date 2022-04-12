const { openBrowser, goto, reload, closeBrowser, $ } = require('taiko')
const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTU3MSwidXNlcm5hbWUiOiJ0ZGQyQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsInRlYW1JZCI6MTM1MzB9.8elzzyR6zKf37ubtiv97zr-0avlvSgmAdg3ljD5tYLk'
const assert = require('assert')

describe('Last edited custom date format', () => {
  beforeAll(async () => {
    await openBrowser()
    await goto('localhost:8080/#/login?token=' + ACCESS_TOKEN)
    await reload()
  }, 60000)

  test('Last edited date should has "DD MMM HH:mm" format', async () => {
    await $('#browserProfilesMainTableCellLastEdited').exists()
    const text = await $('#browserProfilesMainTableCellLastEdited').text()
    assert.match(text, /(\d{1,2})\s([\wа-я]|\w)+\.*\s(\d{2}):(\d{2})/)
  }, 60000)

  afterAll(async () => {
    await closeBrowser()
  }, 60000)
})
