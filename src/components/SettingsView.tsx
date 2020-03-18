import React from 'react';
import { Settings, Data, StorageFuncs, DefaultData } from '../model/Storage';
import './SettingsView.css'
import { Util } from '../model/Util';

type SettingsViewProps = {
    data: Data,
    settings: Settings,
    onUpdateSettings: (settings: Settings) => void,
    onImportSettings: (text: string) => boolean,
}

type SettingsViewState = {
    showImport: boolean,
    showExport: boolean,
    importText: string
}

export class SettingsView extends React.Component<SettingsViewProps, SettingsViewState> {
    constructor(props: SettingsViewProps) {
        super(props);
        this.state = {
            showImport: false,
            showExport: false,
            importText: ""
        }
    }

    handleToggleShowProgressBar() {
        let settings = this.props.settings;
        settings.showProgressBar = !settings.showProgressBar;
        this.props.onUpdateSettings(settings);
    }

    handleImportExportToggle(isImport: boolean) {
        let showImport = this.state.showImport;
        let showExport = this.state.showExport;
        if (isImport) {
            showImport = !showImport;
            showExport = false;
        } else {
            showImport = false;
            showExport = !showExport;
        }
        this.setState({
            showImport,
            showExport
        })
    }

    handleExportBlur() {
        this.setState({
            showImport: false,
            showExport: false
        })
    }

    handleImportEdit(e: React.SyntheticEvent) {
        let importText = (e.target as HTMLTextAreaElement).value;
        this.setState({
            importText: importText
        });
    }

    handleImportSettings(e: React.SyntheticEvent) {
        let text = (e.target as HTMLTextAreaElement).value;
        if (text === "") {
            return;
        }
        let res = this.props.onImportSettings(text);
        if (res) {
            this.setState({
                importText: "Successfully imported data!"
            }, () => {
                setTimeout(() => {
                    this.setState({
                        showImport: false,
                        showExport: false
                    });
                }, 1000);
            });
        } else {
            this.setState({
                importText: "Invalid input"
            });
        }
    }

    handleImportSettingsKeypress(e: React.KeyboardEvent) {
        if (e.keyCode === 13) {
            this.handleImportSettings(e);
        }
    }

    handleClearData() {
        if (window.confirm("Are you sure you want to delete all your session data?\n(This cannot be undone)")) {
            this.props.onImportSettings(StorageFuncs.serialize(DefaultData));
        }
    }

    render() {
        let settings = this.props.settings;
        let showImport = this.state.showImport;
        let showExport = this.state.showExport;
        let dataSerialized = StorageFuncs.serialize(this.props.data);
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
                <legend>Import/Export</legend>
                <span
                    className="link"
                    onClick={() => this.handleImportExportToggle(true)}>Import</span>
                <span
                    className="link"
                    onClick={() => this.handleImportExportToggle(false)}>Export</span>
                <span
                    className="link"
                    onClick={this.handleClearData.bind(this)}>Clear Data</span><br />
                {
                    showExport ? (
                        <textarea
                            className="Settings-export-box"
                            onClick={e => (e.target as HTMLTextAreaElement).select()}
                            onBlur={this.handleExportBlur.bind(this)}
                            value={dataSerialized}></textarea>
                    ) : showImport ? (
                        <textarea
                            onClick={e => (e.target as HTMLTextAreaElement).select()}
                            onChange={this.handleImportEdit.bind(this)}
                            onKeyPress={this.handleImportSettingsKeypress.bind(this)}
                            onBlur={this.handleImportSettings.bind(this)}
                            className="Settings-import-box"
                            value={this.state.importText}
                        ></textarea>
                    ) : null
                }
            </fieldset>
        </div>
    }
}