const { openBrowser, goto, reload, closeBrowser, $, click, write, into, press, textBox, waitFor } = require('taiko')
const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTU4MSwidXNlcm5hbWUiOiJtYXNzLXByb3h5LWVkaXRpbmcudGVzdEBhbnR5LmNvbSIsInJvbGUiOiJhZG1pbiIsInRlYW1JZCI6MTM1Mzh9.3p_My3wgKNpUyltvZQ_NSsoGzsj2nFC57kSbyJ_A2dc'
const assert = require('assert')

describe('Mass proxy editing', () => {
  beforeAll(async () => {
    await openBrowser()
    await goto('localhost:8080/#/login?token=' + ACCESS_TOKEN)
    await reload()

    // СОЗДАТЬ ПРОФИЛЬ
    await click($('#browserProfilesDialogAddButton'))
    await write('mass-proxy-editing.test', into($('#browserProfilesMainDialogFieldName')))
    await waitFor(1000)
    await click($('#browserProfilesMainDialogSwitchProxyButtonNew'))
    await write('http://192.168.0.1:8000', into($('#browserProfilesMainDialogFieldNewProxyInput')))
    await click($('#browserProfilesMainDialogMainButton'))
    await $('#alert .v-snack__wrapper').isVisible()
    await click($('#alertClose'))

    // ОТКРЫТЬ ДИАЛОГ РЕДАКТИРОВАНИЯ ПРОКСИ
    await click($('#browser-profiles-main-table tbody tr:first-child .anty-proxy-edit-pencil'))
  }, 60000)

  test('Proxy tabs should exist in proxy editing dialog', async () => {
    await $('#browserProfilesMainDialogSwitchProxyButtonNone').exists()
    await $('#browserProfilesMainDialogSwitchProxyButtonNew').exists()
    await $('#browserProfilesMainDialogSwitchProxyButtonSaved').exists()
  }, 60000)

  test('Saved proxy dropdown should be opened', async () => {
    await $('.v-menu__content').isVisible()
  }, 60000)

  test('Saved proxy input should be clear', async () => {
    await $('#browserProfilesMainDialogFieldProxySavedSelect').exists()
    const input = await textBox({ id: 'browserProfilesMainDialogFieldProxySavedSelect' })
    const value = await input.value()
    assert.equal(value.length, 0)
  }, 60000)

  afterAll(async () => {
    // УДАЛИТЬ СОЗДАННЫЕ ПРОФИЛИ
    await press('Escape')
    await press('Escape')
    await click($('th .v-data-table__checkbox'))
    await click($('#globalActionDeleteButton'))
    await click($('#browserProfilesActionsDialogDeleteConfirmButton'))

    await closeBrowser()
  }, 60000)
})
