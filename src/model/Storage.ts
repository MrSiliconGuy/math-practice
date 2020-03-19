import { MathSessionTemplate, MathSessionResults } from "./Math";
import lzString from "lz-string";
import { Util } from "./Util";

const version = "v1.0.0";

export type Settings = {
    showProgressBar: boolean
}

const defaultSettings: Settings = {
    showProgressBar: false
}

export type Data = {
    version: string,
    history: MathSessionResults[],
    templates: MathSessionTemplate[],
    settings: Settings
}

export const DefaultData: Data = {
    version,
    history: [],
    templates: [],
    settings: defaultSettings
}

export const StorageFuncs = {
    verifyData(obj: any): obj is Data {
        return (typeof obj === "object") &&
            (obj.version !== undefined) &&
            (obj.version === version) &&
            (obj.history !== undefined) &&
            (Array.isArray(obj.history)) &&
            (obj.templates !== undefined) &&
            (Array.isArray(obj.templates)) &&
            (obj.settings !== undefined) &&
            (typeof obj.settings === "object");
    },
    serialize(data: Data): string {
        let text = JSON.stringify(data);
        let compress = lzString.compressToUTF16(text);
        return compress;
    },
    deserialize(text: string): Data {
        let uncompress = lzString.decompressFromUTF16(text);
        let data = JSON.parse(uncompress);
        if (this.verifyData(data)) {
            return data;
        } else {
            throw Error("Could not parse data");
        }
    },
    load(): Data {
        let text = window.localStorage.getItem(version);
        if (text === null) {
            return Util.clone(DefaultData);
        } else {
            return StorageFuncs.deserialize(text);
        }
    },
    async save(data: Data) {
        let text = StorageFuncs.serialize(data);
        window.localStorage.setItem(version, text);
    }
}