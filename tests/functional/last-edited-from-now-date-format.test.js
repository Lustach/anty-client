const { openBrowser, goto, reload, closeBrowser, $, click, write, into, waitFor } = require('taiko')
const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTU4MCwidXNlcm5hbWUiOiJsYXN0LWVkaXRlZC1mcm9tLW5vdy1kYXRlLWZvcm1hdC50ZXN0QGFudHkuY29tIiwicm9sZSI6ImFkbWluIiwidGVhbUlkIjoxMzUzN30.r9XEvznwa23ZiZVuNBzyhp-nGbxXfToKrJ-9tLl58jo'
const assert = require('assert')

describe('Last edited "fromNow" format', () => {
  beforeAll(async () => {
    await openBrowser()
    await goto('localhost:8080/#/login?token=' + ACCESS_TOKEN)
    await reload()

    await click($('#browserProfilesDialogAddButton'))
    await write('create-profile-button.test', into($('#browserProfilesMainDialogFieldName')))
    await waitFor(2000)
    await click($('#browserProfilesMainDialogMainButton'))
    await $('#alert .v-snack__wrapper').isVisible()
    await click($('#alertClose'))
  }, 60000)

  test('Last edited date should has "fromNow" format', async () => {
    await $('#browserProfilesMainTableCellLastEdited').exists()
    const text = await $('#browserProfilesMainTableCellLastEdited').text()
    assert.match(text, /(\d{1,2})\s([\wа-я]|\w)+\s([\wа-я]|\w)+/)
  }, 60000)

  afterAll(async () => {
    // УДАЛИТЬ СОЗДАННЫЕ ПРОФИЛИ
    await click($('th .v-data-table__checkbox'))
    await click($('#globalActionDeleteButton'))
    await click($('#browserProfilesActionsDialogDeleteConfirmButton'))

    await closeBrowser()
  }, 60000)
})
