import { MathSessionTemplate, MathSessionResults } from "./Math";
import Gists from "gists";

export const version = "v3.0.0-beta";
const filename = "mrsiliconguy-mental-math-practice-save.json";

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

export type AuthData = {
    token: string,
    username: string,
    gist: string,
    lastSynced: number
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
        let json = JSON.stringify(data);

        return json;
    },
    deserialize(text: string): Data {
        let data: any
        try {
            let json = JSON.parse(text);
            data = json;
        } catch {
            throw Error("Could not parse data");
        }
        if (this.verifyData(data)) {
            return data;
        } else {
            throw Error("Invalid data");
        }
    },
    async load(auth: AuthData): Promise<Data | null> {
        try {
            if (auth === null) {
                return null;
            }
            let gitAcc = new Gists({ token: auth.token });
            let message = await gitAcc.get(auth.gist);
            let text = message.body.files[filename].content;
            let data = StorageFuncs.deserialize(text);
            if (StorageFuncs.verifyData(data)) {
                await StorageFuncs.updateLastSynced(new Date());
                return data;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    },
    async save(auth: AuthData, data: Data): Promise<boolean> {
        try {
            let text = StorageFuncs.serialize(data);
            let gitAcc = new Gists({ token: auth.token });
            await gitAcc.edit(auth.gist, {
                files: {
                    [filename]: {
                        content: text
                    }
                }
            });
            await StorageFuncs.updateLastSynced(new Date());
            return true;
        } catch {
            console.log("Error saving data");
            return false;
        }
    },
    verifyAuth(obj: any): obj is AuthData {
        return (typeof obj === "object") &&
            (obj.token !== undefined) &&
            (typeof obj.token === "string") &&
            (obj.username !== undefined) &&
            (typeof obj.username === "string") &&
            (obj.gist !== undefined) &&
            (typeof obj.gist === "string");
    },
    loadAuth(): AuthData | null {
        let text = window.localStorage.getItem(version);
        if (text === null) {
            return null;
        } else {
            try {
                let auth = JSON.parse(text);
                if (StorageFuncs.verifyAuth(auth)) {
                    return auth;
                } else {
                    return null;
                }
            } catch {
                return null;
            }
        }
    },
    async saveAuth(token: string): Promise<AuthData | null> {
        try {
            let gitAcc = new Gists({ token });
            // Search gists before 2020
            let date = "2020-01-01T00:00:00Z";
            let gists: any[] = [];
            let fetchPages = (await gitAcc.all(date)).pages;
            fetchPages.forEach((page: any) => gists = gists.concat(page.body));
            let gist = "";
            let username = "";
            for (let i = 0; i < gists.length; i++) {
                let files = Object.keys(gists[i].files);
                if (files.includes(filename)) {
                    gist = gists[i].id;
                    username = gists[i].owner.login;
                    break;
                }
            }
            if (gist === "") {
                let createGistRes = await gitAcc.create({
                    description: "Mental Math Practice save data (https://mrsiliconguy.github.io/math-practice/)",
                    public: false,
                    files: {
                        [filename]: {
                            content: "Save data will be uploaded here"
                        }
                    }
                });
                gist = createGistRes.id;
                username = createGistRes.owner.login;
            }
            let auth = {
                token, gist, username, lastSynced: -1
            };
            let text = JSON.stringify(auth);
            window.localStorage.setItem(version, text);
            return auth;
        } catch (e) {
            console.log(e);
            console.log("Error saving auth");
            return null;
        }
    },
    async updateLastSynced(date: Date) {
        let auth = StorageFuncs.loadAuth();
        if (auth !== null) {
            auth!.lastSynced = date.getTime();
            let text = JSON.stringify(auth);
            window.localStorage.setItem(version, text);
        }
    },
    async clearAuth() {
        window.localStorage.removeItem(version);
    }
}