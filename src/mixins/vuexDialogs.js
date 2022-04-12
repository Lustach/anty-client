export const mixinDialogMutations = {
  OPEN_DIALOG: (state, dialog) => {
    state.dialogs[dialog] = true
  },

  CLOSE_DIALOG: (state, dialog) => {
    state.dialogs[dialog] = false
  }
}

export const mixinDialogActions = {
  async openDialog (context, dialog) {
    context.commit('OPEN_DIALOG', dialog)
  },

  async closeDialog (context, dialog) {
    context.commit('CLOSE_DIALOG', dialog)
  }
}

export const mixinDialogGetters = {
  dialogs: state => state.dialogs
}
