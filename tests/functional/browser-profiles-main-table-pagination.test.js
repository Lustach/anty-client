const { openBrowser, goto, reload, closeBrowser, $, write, into, waitFor } = require('taiko')
const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTU3NiwidXNlcm5hbWUiOiJicm93c2VyLXByb2ZpbGVzLW1haW4tdGFibGUtcGFnaW5hdGlvbkBhbnR5LmNvbSIsInJvbGUiOiJhZG1pbiIsInRlYW1JZCI6MTM1MzN9.JthNSM4UjKpsNdT_NU_ZJ_nJ6zD-OtzjQzEM1UxZ4Uw'
const assert = require('assert')

describe('Browser profiles main table pagination', () => {
  beforeAll(async () => {
    await openBrowser()
    await goto('localhost:8080/#/login?token=' + ACCESS_TOKEN)
    await reload()
  }, 60000)

  test('Main table footer pagination should not contain invalid info', async () => {
    await write('not existing profile 1313', into($('#browserProfileSearch')))
    await waitFor(1500)
    await $('#browserProfilesMainTableFooterPaginationInfo').exists()
    const text = await $('#browserProfilesMainTableFooterPaginationInfo').text()
    assert.match(text.trim(), /(\d{1,100000})\s-\s(\d{1,100000})\s\w+\s(\d{1,100000})/)
  }, 60000)

  afterAll(async () => {
    await closeBrowser()
  }, 60000)
})
