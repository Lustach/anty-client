const { openBrowser, goto, reload, closeBrowser, $ } = require('taiko')
const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTU4MiwidXNlcm5hbWUiOiJzdWJzY3JpcHRpb24taW5mby50ZXN0QGFudHkuY29tIiwicm9sZSI6ImFkbWluIiwidGVhbUlkIjoxMzUzOX0.HO0YRKztfpwVJU5oQQE-VEuorRnYs1PR1AIQFhUe-QU'
const assert = require('assert')

describe('Subscription info', () => {
  beforeAll(async () => {
    await openBrowser()
    await goto('localhost:8080/#/login?token=' + ACCESS_TOKEN)
    await reload()
  }, 60000)

  test("Plan should be one of ['Enterprise', 'Trial', 'Base', 'Team', 'Free', 'Beta']", async () => {
    await $('#InfoBarSubscriptionPlan').exists()
    const text = await $('#InfoBarSubscriptionPlan').text()
    assert.ok(['Enterprise', 'Trial', 'Base', 'Team', 'Free', 'Beta'].includes(text))
  }, 60000)

  test('Plan date should match pattern Y-m-d H:i:s', async () => {
    await $('#InfoBarSubscriptionDate').exists()
    const text = await $('#InfoBarSubscriptionDate').text()
    assert.match(text, /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/)
  }, 60000)

  test('Plan users should match pattern /Word number/number/', async () => {
    await $('#InfoBarSubscriptionUsers').exists()
    const text = await $('#InfoBarSubscriptionUsers').text()
    assert.match(text, /\w+\s(\d{1,4})\s\/\s(\d{1,4})/)
  }, 60000)

  test('Plan profiles should match pattern /Word number/number/', async () => {
    await $('#InfoBarSubscriptionProfiles').exists()
    const text = await $('#InfoBarSubscriptionProfiles').text()
    assert.match(text, /\w+\s(\d{1,6})\s\/\s(\d{1,6})/)
  }, 60000)

  afterAll(async () => {
    await closeBrowser()
  }, 60000)
})
