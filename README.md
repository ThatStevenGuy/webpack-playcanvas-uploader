# PlayCanvas Uploader 🚀
[![npm version](https://img.shields.io/npm/v/webpack-playcanvas-uploader.svg)](https://www.npmjs.com/package/webpack-playcanvas-uploader)
[![license](https://img.shields.io/npm/l/webpack-playcanvas-uploader.svg)](LICENSE)
[![downloads](https://img.shields.io/npm/dm/webpack-playcanvas-uploader.svg)](https://www.npmjs.com/package/webpack-playcanvas-uploader)

A lightweight Webpack plugin to automatically upload your bundles to PlayCanvas.

ℹ️ Looking for the Rollup version? [rollup-plugin-playcanvas-uploader](https://www.npmjs.com/package/rollup-plugin-playcanvas-uploader)

## Installation
```
npm install webpack-playcanvas-uploader --save-dev
```

## Usage
Add the following to your `webpack.config.js`. Make sure to replace the placeholders with the correct values (see project details section below).

**CommonJS:**
```
const PlayCanvasUploader = require("webpack-playcanvas-uploader");

module.exports = {
    plugins: [
        new PlayCanvasUploader({
            projectId: yourProjectId,
            branchId: yourBranchId,
            accessToken: yourAccessToken,
            files: [
                { path: "dist/main.js", assetId: yourScriptId }
            ]
        })
    ]
}
```

**ECMAScript:**
```
import PlayCanvasUploader from "webpack-playcanvas-uploader";

export default (env) => {
    return {
        plugins: [
            new PlayCanvasUploader({
                projectId: yourProjectId,
                branchId: yourBranchId,
                accessToken: yourAccessToken,
                files: [
                    { path: "dist/main.js", assetId: yourScriptId }
                ]
            })
        ]
    }
};
```
## Retrieving Project Details
Follow these steps to retrieve your PlayCanvas project details. Use these to overwrite the placeholders in your uploader config (outlined above):
1. Create an empty script in your PlayCanvas project (e.g. `main.js`) and click on it to open the inspector. Copy the ID of the file (a numeric value at the top) and paste it under the `assetId` of the first file in your uploader config. Whenever you make a bundle using Webpack, the contents of your bundle will be uploaded to this script file. Make sure the path of the file (e.g. `dist/main.js`) actually matches the output of your Webpack config.
2. Open your browser's console and enter `config.project.id`, `config.self.branch.id` and `config.accessToken`. Copy the values over to your uploader config as `projectId`, `branchId` and `accessToken` respectively. Make sure to read the security section below to help keep your access token secret.

You're all set! 🎉 PlayCanvas Uploader will now automatically upload your bundles.

## Security
⚠️ **Keep your access token secret!**

Do not commit it to Git. You can instead store it in a Git-ignored JSON file and import it into your `webpack.config.js`. Alternatively, you can add your access token as an environment variable and use `process.env` to access it (e.g. `process.env.PLAYCANVAS_ACCESS_TOKEN`).

## Bug Reports & Feature Requests
Bug reports and feature requests welcome — please open an issue on [GitHub](https://github.com/ThatStevenGuy/webpack-playcanvas-uploader/issues).

## License
MIT © 2025 Steven Derks  
Distributed under the MIT License. See the [LICENSE](https://github.com/ThatStevenGuy/webpack-playcanvas-uploader/blob/main/LICENSE) file for details.