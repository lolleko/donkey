# Donkey A Key Value Editor
[![Build Status](https://travis-ci.org/lolleko/donkey.svg?branch=master)](https://travis-ci.org/lolleko/donkey) [![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

A cross platform Editor for Valve's KeyValue Format (VDF).

### Features
- Opening, Editing & Saving of KeyValue files
- Autocompletion & Special Controls for Keys & Values.
- Cut, Copy, Paste... for KVData.
- Customization: Themes & Packages

#### KV Formats
- KV1  :+1: (except comments)
- KV3  :-1:
- JSON :-1:

### Languages
Language     | Description                                                                                       | Status
------------ | ------------------------------------------------------------------------------------------------- | ---------
KeyValue     | Base Language that supports all KV files.                                                         | 100% Done
Dota2 KV     | Autocompletion for Keys, Special Controls for Values. Templates for abilities, units, items.      | 70% Done

### Contributing

Requires node.js and npm

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
3. Install the dependencies: `npm install`
4. Build & Run the App: `npm start`
5. Please use [standard codestyle](http://standardjs.com)


##### npm scripts
- `npm run dist` build and save the Binaries. If you are running Linux, you will need "icnsutils", "graphicsmagick" and "xz-utils"

- `npm test` Checks for standard codestlye & will run unit tests in the future.

Powered by [Electron](http://electron.atom.io)
