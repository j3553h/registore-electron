const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }
});

contextBridge.exposeInMainWorld('Backend', {
    getTransaction: async (transactionID) =>
        ipcRenderer.invoke('getTransaction', transactionID),
    getAllProducts: async () => ipcRenderer.invoke('getAllProducts'),
    getProduct: async (sku) => ipcRenderer.invoke('getProduct', sku)
});
