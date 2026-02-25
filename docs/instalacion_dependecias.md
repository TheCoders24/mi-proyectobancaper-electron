# Crear estructura
mkdir mi-app-electron
cd mi-app-electron

# Inicializar package.json
npm init -y

# Instalar React y TypeScript
npm install react react-dom
npm install @types/react @types/react-dom typescript @types/node --save-dev

# Instalar Electron
npm install electron electron-builder --save-dev

# Instalar loaders y plugins
npm install @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript babel-loader webpack webpack-cli --save-dev

# Instalar loaders y plugins faltantes
npm install ts-loader style-loader css-loader html-webpack-plugin --save-dev
npm install @types/react-dom --save-dev