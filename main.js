const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'production';

const { ipcMain } = require('electron');
const RegistoreBackend = require('./node_modules/registore-business-logic/dist/index');

// Because we are returning values, we need to use ipcMain.handle, do not use ipcMain.on
ipcMain.handle('getTransaction', async (event, args) => {
    console.log(args);
    const { transactionID } = args; // Desctructure the args object
    const response =
        await RegistoreBackend.TransactionController.getTransaction(
            transactionID
        );
    return response;
});

ipcMain.handle('getAllProducts', async (event, args) => {
    console.log(args);
    // const { transactionID } = args; // Desctructure the args object
    const response = await RegistoreBackend.ProductController.getAllProducts();
    return response;
});

ipcMain.handle('getProduct', async (event, args) => {
    console.log(args);
    const { sku } = args; // Desctructure the args object
    const response = await RegistoreBackend.ProductController.getProduct(sku);
    return response;
});

// create the main window
const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        title: 'Registore',
        width: isDev ? 500 + 800 : 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // open dev tools if in dev envi
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.loadFile(path.join(__dirname, './render/register.html'));
};

//create about window
function createItemInfo() {
    const itemInfo = new BrowserWindow({
        title: 'About',
        width: 300,
        height: 600
    });
    itemInfo.loadFile(path.join(__dirname, './render/itemInfo.html'));
}

// app is ready
app.whenReady().then(() => {
    createMainWindow();

    // implement menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

// menu template
const menu = [
    ...(isMac
        ? [
              {
                  label: app.name,
                  submenu: [
                      {
                          label: 'About',
                          // TODO createAboutWindow
                          click: () => {}
                      }
                  ]
              }
          ]
        : []),
    {
        role: 'fileMenu'
    },
    ...(!isMac
        ? [
              {
                  label: 'Help',
                  submenu: [
                      {
                          label: 'View Item',
                          click: createItemInfo
                      }
                  ]
              }
          ]
        : [])
];

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});
