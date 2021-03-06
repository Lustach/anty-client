import { app, protocol, BrowserWindow, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { autoUpdater } from 'electron-updater'
if (app.getVersion().indexOf('beta') !== -1) autoUpdater.channel = 'beta'
else autoUpdater.channel = 'latest'
// if (app.getVersion().search('alpha') > -1) autoUpdater.channel = 'alpha'
const path = require('path')
const osLocale = require('os-locale')

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

const isDevelopment = process.env.NODE_ENV !== 'production'
const updating = { notify: false, lastCancelVer: null }
let antyLocalApi = null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

try {
  antyLocalApi = require('anty-local-api')
} catch (err) {
  dialog.showErrorBox('Local API Error', err.toString())
}

async function createWindow ({ port }) {
  // Create the browser window.
  const win = new BrowserWindow({
    // width: 10000,
    // height: 10000,
    minWidth: 1200,
    minHeight: 800,
    show: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli -plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      devTools: true,
      icon: path.join(__static, 'icon.png')
    }
  })

  const splash = new BrowserWindow({ width: 600, height: 400, transparent: false, frame: false, alwaysOnTop: true })
  // splash.loadURL(`file://${path.join(__dirname, 'splash.html')}`)
  // splash.loadURL('app://./splash.html')
  const html = `
    <body>
        <style>
            body {
                overflow: hidden;
                height: 100vh;
                background-image: linear-gradient(to bottom, #b645ee, #b03de0, #a935d1, #a22ec4, #9b26b6);
            }

            #logo {
                width: 360px;
                height: auto;
            }

            #container {
                height: 100vh;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        </style>
        <div id="container">
            <div>
                <img id="logo" src="data:image/png;base64,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" />
            </div>
        </div>
    </body>
  `
  splash.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html))

  win.once('ready-to-show', async () => {
    // win.loadURL('app://./index.html')
    win.maximize()
    win.show()
    splash.destroy()
  })

  // win.setMenu(null)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL(`app://./index.html?localApiPort=${port}`)

    autoUpdater.checkForUpdatesAndNotify()
    setInterval(() => {
      autoUpdater.checkForUpdatesAndNotify()
    }, 60 * 5 * 1000)
    autoUpdater.on('update-available', (info) => {
      try {
        // Skip already installed version
        if (app.getVersion() === info.version) return
        // Skip latest if we have beta
        if (
          app.getVersion().indexOf('beta') !== -1 &&
          info.version.indexOf('beta') === -1
        ) return
        // Skip beta if we have latest
        if (
          app.getVersion().indexOf('beta') === -1 &&
          info.version.indexOf('beta') !== -1
        ) return
        // Skip if notify already shown
        if (updating.notify === true || updating.lastCancelVer === info.version) return
      } catch (_) {
        // Do nothing
      }

      autoUpdater.downloadUpdate()

      // Send webContents event
      win.webContents.send('update-available', info)
    })
    autoUpdater.on('update-downloaded', async (info) => {
      try {
        // Skip already installed version
        if (app.getVersion() === info.version) return
        // Skip latest if we have beta
        if (
          app.getVersion().indexOf('beta') !== -1 &&
          info.version.indexOf('beta') === -1
        ) return
        // Skip beta if we have latest
        if (
          app.getVersion().indexOf('beta') === -1 &&
          info.version.indexOf('beta') !== -1
        ) return
        // Skip if notify already shown
        if (updating.notify === true || updating.lastCancelVer === info.version) return
      } catch (_) {
        // Do nothing
      }

      // win.webContents.send('update-downloaded', info)

      const locale = (await osLocale()).slice(0, 2)
      updating.notify = true
      dialog.showMessageBox(win, {
        message: locale === 'ru'
          ? `???????????????????? ${info.version} ????????????????. ?????????????????????`
          : `Update ${info.version} is ready. Install it?`,
        type: 'question',
        buttons: [locale === 'ru' ? '????????????' : 'Cancel', 'OK'],
        noLink: true,
        cancelId: 0,
        defaultId: 1
      }).then(answer => {
        updating.notify = false
        if (answer.response === 1) {
          autoUpdater.quitAndInstall(false, true)
        } else {
          updating.lastCancelVer = info.version
        }
      })
    })
    autoUpdater.on('update-progress', (info) => {
      win.webContents.send('update-progress', info)
    })
    autoUpdater.on('error', (info) => {
      win.webContents.send('error', info)
    })
    autoUpdater.on('checking-for-update', (info) => {
      win.webContents.send('checking-for-update', info)
    })
  }

  return win
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow({
      port: antyLocalApi ? antyLocalApi.port : '3001'
    })
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  createWindow({
    port: antyLocalApi ? antyLocalApi.port : '3001'
  })
})

// console.log(app.getPath('userData'))

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
