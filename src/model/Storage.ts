import msgPack from 'msgpack-lite';
import pako from 'pako';
import base114688 from 'base114688';
import { MathSessionTemplate, MathSessionResults } from "./Math";
import { Util } from "./Util";

const version = "v2.0.0";

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
        let pack = msgPack.encode(data);
        let compress = pako.deflateRaw(pack);
        let serialize = base114688.encode(compress);

        return serialize;
    },
    deserialize(text: string): Data {
        let data: any
        try {
            let deserialize = base114688.decode(text);
            let uncompress = pako.inflateRaw(deserialize);
            let unpack = msgPack.decode(uncompress);
            data = unpack;
        } catch {
            throw Error("Could not parse data");
        }
        if (this.verifyData(data)) {
            return data;
        } else {
            throw Error("Invalid data");
        }
    },
    load(): Data {
        let text = window.localStorage.getItem(version);
        if (text === null) {
            return Util.clone(DefaultData);
        } else {
            try {
                return StorageFuncs.deserialize(text);
            } catch {
                return Util.clone(DefaultData);
            }
        }
    },
    async save(data: Data) {
        let text = StorageFuncs.serialize(data);
        window.localStorage.setItem(version, text);
    }
}