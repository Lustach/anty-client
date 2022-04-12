const { openBrowser, goto, reload, closeBrowser, $, click, write, into, waitFor } = require('taiko')
const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTU3OCwidXNlcm5hbWUiOiJjcmVhdGUtcHJvZmlsZS1idXR0b24udGVzdEBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJ0ZWFtSWQiOjEzNTM1fQ.MRAItcUHyVcFdLACx0EtVBtl4Wxb5uxPDHiWa4N0FwE'
const assert = require('assert')

describe('Check create profile button', () => {
  beforeAll(async () => {
    await openBrowser()
    await goto('localhost:8080/#/login?token=' + ACCESS_TOKEN)
    await reload()
  }, 60000)

  test('If profiles count less then 3, create profile button should conatain "create profile"', async () => {
    let text = await $('#browserProfilesDialogAddButton').text()
    assert.equal(text, 'CREATE PROFILE')

    await click($('#browserProfilesDialogAddButton'))
    await write('create-profile-button.test', into($('#browserProfilesMainDialogFieldName')))
    await waitFor(1000)
    await click($('#browserProfilesMainDialogMainButton'))
    await $('#alert .v-snack__wrapper').isVisible()
    await click($('#alertClose'))
    text = await $('#browserProfilesDialogAddButton').text()
    assert.equal(text, 'CREATE PROFILE')

    await click($('#browserProfilesDialogAddButton'))
    await write('create-profile-button.test', into($('#browserProfilesMainDialogFieldName')))
    await waitFor(1000)
    await click($('#browserProfilesMainDialogMainButton'))
    await $('#alert .v-snack__wrapper').isVisible()
    await click($('#alertClose'))
    text = await $('#browserProfilesDialogAddButton').text()
    assert.equal(text, 'CREATE PROFILE')

    await click($('#browserProfilesDialogAddButton'))
    await write('create-profile-button.test', into($('#browserProfilesMainDialogFieldName')))
    await waitFor(1000)
    await click($('#browserProfilesMainDialogMainButton'))
    await $('#alert .v-snack__wrapper').isVisible()
    await click($('#alertClose'))
    await waitFor(1000)
    text = await $('#browserProfilesDialogAddButton').text()
    assert.equal(text, '')
  }, 60000)

  afterAll(async () => {
    // УДАЛИТЬ СОЗДАННЫЕ ПРОФИЛИ
    await click($('th .v-data-table__checkbox'))
    await click($('#globalActionDeleteButton'))
    await click($('#browserProfilesActionsDialogDeleteConfirmButton'))

    await closeBrowser()
  }, 60000)
})
