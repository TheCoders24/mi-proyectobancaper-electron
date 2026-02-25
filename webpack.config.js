const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = [
  // 1️⃣ Proceso principal (main)
  {
    mode: process.env.NODE_ENV || 'development',
    entry: './src/backend/main/main.ts',
    target: 'electron-main',
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: 'ts-loader' }]
        }
      ]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js'
    },
    resolve: {
      extensions: ['.ts', '.js'],
      plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })]
    }
  },

 // 2️⃣ Proceso de renderizado (renderer)
{
  mode: process.env.NODE_ENV || 'development',
  entry: './src/frontend/index.tsx',
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader', 
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: true, // Automáticamente aplica modules a archivos .module.css
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
            },
          },
          'postcss-loader' // 👈 AGREGADO para Tailwind
        ]
      },
      // Opcional: para imágenes y assets
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'renderer.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/frontend/index.html',
      filename: 'index.html'
    })
  ]
},

  // 3️⃣ Preload script (Electron preload)
  {
    mode: process.env.NODE_ENV || 'development',
    entry: './src/backend/preload.ts', // 🔹 Asegúrate de crear este archivo
    target: 'electron-preload',
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: ['ts-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js'],
      plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'preload.js'
    }
  }
];