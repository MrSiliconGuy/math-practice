import React, { ChangeEvent } from 'react';
import { Settings, Data, AuthData } from '../model/Storage';
import './SettingsView.css'
import { Util } from '../model/Util';

type SettingsViewProps = {
    authData: AuthData | null,
    data: Data,
    settings: Settings,
    onUpdateSettings: (settings: Settings) => void,
    onAddAuth: (token: string) => void,
    onCheckSync: () => Promise<boolean>,
    onManualSave: () => Promise<boolean>,
    onManualLoad: () => Promise<boolean>,
    onUnlink: () => Promise<boolean>,
}

type SettingsViewState = {
    token: string,
}

export class SettingsView extends React.Component<SettingsViewProps, SettingsViewState> {
    constructor(props: SettingsViewProps) {
        super(props);
        this.state = {
            token: "",
        };
    }

    handleToggleShowProgressBar() {
        let settings = this.props.settings;
        settings.showProgressBar = !settings.showProgressBar;
        this.props.onUpdateSettings(settings);
    }

    handleInputAuthData(e: ChangeEvent) {
        let value = (e.target as HTMLInputElement).value;
        this.setState({
            token: value
        });
    }

    handleLinkDataClick() {
        if (this.state.token === "") {
            alert("Please enter a token");
        } else {
            this.props.onAddAuth(this.state.token);
        }
    }

    handleCheckSync() {
        this.props.onCheckSync().then(res => {
            if (res === true) {
                alert("Data is up to date with gist");
            } else {
                alert("Data is not synced with gist! Try manually saving");
            }
        })
    }

    handleManualSave() {
        this.props.onManualSave().then(res => {
            if (res === true) {
                alert("Successfully saved to gist");
            } else {
                alert("Error saving to gist!");
            }
        })
    }

    handleManualLoad() {
        this.props.onManualLoad().then(res => {
            if (res === true) {
                alert("Successfully loaded from gist");
            } else {
                alert("Error loaindg from gist!");
            }
        })
    }

    async handleUnlink() {
        if (!window.confirm("Are you sure you want to unlink?")) {
            return;
        }
        if (await this.props.onUnlink()) {
            alert("Unlinked data from Github");
        } else {
            alert("Unable to unlink for some reason");
        }
    }

    handleAboutClick() {
        alert("Math Practice was coded by MrSiliconGuy\nwith the React.js framework");
    }

    render() {
        let settings = this.props.settings;
        let state = this.state;
        let authData = this.props.authData;
        return <div className="Settings">
            <fieldset className="Settings-fieldset">
                <legend>Math Session</legend>
                <input
                    type="checkbox"
                    checked={settings.showProgressBar}
                    onChange={this.handleToggleShowProgressBar.bind(this)} />
                <label onClick={this.handleToggleShowProgressBar.bind(this)}>Show Progress Bar</label>
            </fieldset>
            <fieldset className="Settings-fieldset">
                <legend>Github Gist Linking</legend>
                {
                    authData === null ?
                        (
                            <div>
                                <span>Data not yet linked</span><br />
                                <input
                                    type="text"
                                    placeholder="Github Token"
                                    value={state.token}
                                    onChange={(e) => this.handleInputAuthData(e)}
                                /><br />
                                <button onClick={this.handleLinkDataClick.bind(this)}>Link Data</button>
                                <span className="link">help</span>
                            </div>
                        ) : (
                            <div>
                                <span>Data linked with
                                    <a
                                        className="link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={`https://gist.github.com/${authData.username}/${authData.gist}`}>
                                        {authData.username}
                                    </a>
                                    on Github
                                </span><br />
                                <span>Last synced: {authData.lastSynced === -1 ? "Never" : Util.formatDate(authData.lastSynced)}</span><br />
                                <span className="link" onClick={this.handleCheckSync.bind(this)}>Check Sync</span>
                                <span className="link" onClick={this.handleManualSave.bind(this)}>Save</span>
                                <span className="link" onClick={this.handleManualLoad.bind(this)}>Load</span>
                                <span className="link" onClick={this.handleUnlink.bind(this)}>Unlink</span>
                            </div>
                        )
                }
            </fieldset>
            <fieldset className="Settings-fieldset">
                <legend>Other</legend>
                <span
                    className="link"
                    onClick={this.handleAboutClick.bind(this)}>About</span>
                <a
                    className="link"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.github.com/mrsiliconguy/math-practice">GitHub</a>
            </fieldset>
        </div>
    }
}