const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

// 1. Définir le nom de l'app pour que le dossier de stockage soit fixe
app.name = "Freecord"; 

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    backgroundColor: '#313338',
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      // 2. Persistance : On définit une session persistante
      // Le préfixe 'persist:' est la clé pour que ça enregistre sur le disque
      partition: 'persist:discord-session' 
    }
  });

  Menu.setApplicationMenu(null);

  // Gestionnaire de liens externes
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // 3. User Agent identique à un vrai Chrome pour éviter les resets de session
  const customUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

  win.loadURL('https://discord.com/app', {
    userAgent: customUserAgent
  });
}

app.whenReady().then(createWindow);

app.on('web-contents-created', (event, contents) => {
  contents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    const url = webContents.getURL();
    if (url.startsWith('https://discord.com/') && (permission === 'media')) {
      return callback(true);
    }
    callback(false);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});