import axios from "axios";
import FormData from "form-data";
import { createReadStream } from "fs";
import path from "path";
import type { Compilation, Compiler } from "webpack";
import { ConsoleLogger } from "./utils";

const console = new ConsoleLogger("PlayCanvas Uploader");
const assetsUrl = "https://playcanvas.com/api/assets";

export default class Uploader {
    public readonly config: Config;

    public constructor(config: Config) {
        this.config = config;
    }

    public apply(compiler: Compiler): void {
        compiler.hooks.afterEmit.tap(this.constructor.name, (compilation: Compilation) => {
            if(!this.validateConfig()) {
                console.error(`Upload failed: invalid config.`);
                return;
            }

            // Don't upload broken builds. Webpack emits bundles even if there were compilation errors.
            if(compilation.errors.length > 0) {
                return;
            }

            const outputPath = compilation.options.output?.path;
            if(!outputPath) {
                console.error(`Upload failed: build output path not specified.`);
                return;
            }

            const fileEntries = this.config.files;
            for(let length = fileEntries.length, i = 0; i < length; i++) {
                const fileEntry = fileEntries[i];
                if(!compilation.assets[fileEntry.path]) {
                    console.warn(`File "${fileEntry.path}" is missing from the compilation output.`);
                    continue;
                }

                const filePath = path.normalize(path.join(outputPath, fileEntry.path));
                this.updateAsset(fileEntry, filePath);
            }
        });
    }

    public async updateAsset(file: FileEntry, filePath: string): Promise<void> {
        const fileContent = createReadStream(filePath);
        const form = new FormData();
        form.append("file", fileContent);
        form.append("branchId", this.config.branchId);

        try {
            console.log(`Uploading "${file.path}"...`);
            const fileUri = `${assetsUrl}/${file.assetId}`;
            const response = await axios.put(fileUri, form, {
                headers: {
                    Authorization: `Bearer ${this.config.accessToken}`,
                    "Content-Type": form.getHeaders()["content-type"]
                }
            });

            const status = response.status;
            if(status === 200) {
                console.log(`Updated asset "${file.path}".`);
            } else {
                console.log(`Encountered unexpected status code ${status} whilst updating asset "${file.path}": `
                    + response.statusText);
            }
        } catch(error: any) {
            const response = error.response;
            if(!this.validateResponse(response)) {
                return;
            }

            switch(response.status) {
                case 404:
                    // The asset is missing. Create a new one.
                    this.createAsset(file, filePath);
                    break;
                default:
                    console.error(`Failed to update asset "${file.path}": ${response.statusText} (${response.status})`);
                    break;
            }
        }
    }

    public async createAsset(file: FileEntry, filePath: string): Promise<void> {
        const form = new FormData();
        form.append("name", file.path);
        form.append("project", this.config.projectId);
        form.append("branchId", this.config.branchId);
        form.append("preload", "true");
        form.append("file", createReadStream(filePath));

        try {
            console.log(`Creating "${file.path}"...`);
            const response = await axios.post(assetsUrl, form, {
                headers: {
                    Authorization: `Bearer ${this.config.accessToken}`,
                    "Content-Type": form.getHeaders()["content-type"]
                }
            });

            if(response.status === 201) {
                console.warn(`Created asset "${file.path}" with asset ID "${response.data.id}". Please make `
                    + `sure to add this asset ID to the "files"-section of your PlayCanvas Uploader config.`);
            } else {
                console.warn(`Encountered unexpected status code ${response.status} whilst creating a new asset `
                    + `for file ${file.path}: ${response.statusText}`);
            }
        } catch(error: any) {
            const response = error.response;
            if(!this.validateResponse(response)) {
                return;
            }

            console.error(`Failed to create asset "${file.path}" (status code ${response.status}): ` +
                response.statusText);
        }
    }

    public validateResponse(response: any): boolean {
        if(!response) {
            console.error(`Failed to get a general network response. Is your internet connection functioning properly?`);
            return false;
        }

        return true;
    }

    public validateConfig(): boolean {
        const config = this.config;
        if(!config) {
            console.error(`No config has been provided.`);
            return false;
        }

        const projectId = config.projectId;
        if(!projectId || !Number.isInteger(projectId)) {
            console.error(`Invalid project ID "${projectId}".`);
            return false;
        }

        const branchId = config.branchId;
        if(!branchId) {
            console.error(`Invalid branch ID "${branchId}".`);
            return false;
        }

        const accessToken = config.accessToken;
        if(!accessToken) {
            console.error(`No access token specified.`);
            return false;
        }

        const files = config.files;
        if(files.length === 0) {
            console.error(`No files specified.`);
            return false;
        }

        for(let length = files.length, i = 0; i < length; i++) {
            const file = files[i];
            if(!file.path) {
                console.error(`File path not specified.`);
                return false;
            }

            if(!file.assetId || !Number.isInteger(file.assetId)) {
                console.error(`Invalid asset ID "${file.assetId}" for file "${file.path}".`);
                return false;
            }
        }

        return true;
    }
}

export interface Config {
    projectId: number;
    branchId: string;
    accessToken: string;
    files: FileEntry[];
}

interface FileEntry {
    path: string;
    assetId: number;
}