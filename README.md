# PlayCanvas Uploader 🚀

A lightweight script bundle uploader for PlayCanvas, built for Webpack.

## Installation
Install the package from NPM:
```
npm install --save-dev webpack-playcanvas-uploader
```
*NOTE:* This guide assumes you have Webpack installed and configured to output a script bundle. It also assumes you already have a project set up in PlayCanvas to which you want to automatically upload script bundles.

### Retrieving Project Metadata
First, we'll have to retrieve your project's metadata. Open your project in the PlayCanvas Editor, then open your browser's dev tools. Enter the following in the console to retrieve your project's metadata:
- ```config.accessToken``` - Used to authenticate with the PlayCanvas API.
- ```config.project.id``` - The numeric ID of your project.
- ```config.self.branch.id``` - The GUID of the current branch.

Now, make a build using Webpack. Drag & drop the resulting script bundle into your PlayCanvas project and select it to view its properties in the inspector panel. Write down the file's ID (the 8-digit number). Now we have everything needed to configure PlayCanvas Uploader.

### Configuring the Plugin
Add PlayCanvas Uploader to your `webpack.config.js` as described below. Replace the placeholders with the values you obtained earlier.

**CommonJS:**
```
const PlayCanvasUploader = require("webpack-playcanvas-uploader");

module.exports = {
    ...
    plugins: [
        new PlayCanvasUploader({
            projectId: your-project-id,
            branchId: your-branch-id,
            accessToken: your-access-token,
            files: [
                { path: "your-bundle-name.js", assetId: your-bundle-id }
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
        ...
        plugins: [
            new PlayCanvasUploader({
                projectId: your-project-id,
                branchId: your-branch-id,
                accessToken: your-access-token,
                files: [
                    { path: "your-bundle-name.js", assetId: your-bundle-id }
                ]
            })
        ]
    }
};
```

You're all set! PlayCanvas Uploader will now automatically upload your bundles.

### (Optional) Script Name Persistence

In case you're using Webpack's terser plugin to minify bundles, it's important to configure the terser plugin to retain class names. By default, PlayCanvas uses a script's class name to uniquely identify each script. As such, it's important to tell the terser plugin to not minify class names. Here's an example config for the terser plugin that works well with PlayCanvas:

```
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    ...
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: false,
                    keep_fnames: true,
                    keep_classnames: true
                }
            })
        ]
    },
}
```

## Bug Reports & Feature Requests
Please submit all bug reports & feature requests to the GitHub repo's issues page.