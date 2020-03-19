import React from 'react';
import { AppContainer } from './components/AppContainer';
import { HomeView } from './components/HomeView';
import { SelectView } from './components/SelectView';
import './App.css';
import { MathSessionTemplate, MathSessionOptions, SessionType, MathFuncs, SessionTypeNames, MathSessionResults } from './model/Math';
import { Data, StorageFuncs, Settings } from './model/Storage';
import { Util } from './model/Util';
import { MathView } from './components/MathView';
import { SettingsView } from './components/SettingsView';
import { StatsView } from './components/StatsView';

type AppView = 'home' | 'select' | 'math' | 'stats' | 'settings';

type AppProps = {

}

type AppState = {
    view: AppView,
    data: Data,
    sessionOptions: MathSessionOptions | null
}

export class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            view: 'home',
            data: StorageFuncs.load(),
            sessionOptions: null
        }
    }

    // Update Data
    updateData(data: Data) {
        this.setState({
            data
        });
        StorageFuncs.save(data);
    }

    // General handlers
    handleNavigate(view: AppView) {
        this.setState({
            view
        })
    }

    handleStartDefaultSession(type: SessionType) {
        let options = MathFuncs.generateDefaultSessionOptions(type);
        this.handleStartSession(options);
    }

    // Select View
    handleTemplateAdd(template: MathSessionTemplate) {
        let data = Util.clone(this.state.data);
        data.templates.push(template);

        this.updateData(data);
    }

    handleTemplateRemove(index: number) {
        let data = Util.clone(this.state.data);
        data.templates.splice(index, 1);

        this.updateData(data);
    }

    handleStartSession(options: MathSessionOptions) {
        let view: 'math' = 'math';
        this.setState({
            view,
            sessionOptions: options
        });
    }

    // Math Session View
    handleFinishSession(result: MathSessionResults) {
        alert("Finished session in " + Util.formatSeconds(result.totalTime));

        let data = this.state.data;
        data.history.push(result);
        this.setState({
            view: 'stats',
            data
        });
        this.updateData(data);
    }

    // Stats View
    handleRemoveHistory(index: number) {
        let { data } = Util.clone(this.state);
        data.history.splice(index, 1);
        this.setState({
            data
        })
    }

    // Settings View
    handleUpdateSettings(settings: Settings) {
        let data = this.state.data;
        data.settings = settings;
        this.updateData(data);
    }

    handleImportData(text: string): boolean {
        try {
            let data = StorageFuncs.deserialize(text);
            this.updateData(data);
            return true;
        } catch {
            return false;
        }
    }

    // ~~Blender~~ render
    render() {
        let data = this.state.data;
        let sessionOptions = this.state.sessionOptions;
        let settings = this.state.data.settings;

        let child: React.ReactNode;
        let title: string = "";
        let showExit: boolean = false;
        let onExit = () => this.handleNavigate('home');
        let exitPrompt: string | null = null;

        if (this.state.view === 'home') {
            title = "Math Practice";
            showExit = false;
            child = <HomeView
                history={data.history}
                onStartPractice={this.handleStartDefaultSession.bind(this)}
                onNavigateSelectSession={() => this.handleNavigate('select')}
                onNavigateStats={() => this.handleNavigate('stats')}
                onNavigateSettings={() => this.handleNavigate('settings')}
            />;
        } else if (this.state.view === 'select') {
            title = "Custom Practice";
            showExit = true;
            child = <SelectView
                sessionTemplates={data.templates}
                onAddSessionTemplate={this.handleTemplateAdd.bind(this)}
                onRemoveSessionTemplate={this.handleTemplateRemove.bind(this)}
                onStartSession={this.handleStartSession.bind(this)}
            />
        } else if (this.state.view === 'math') {
            title = SessionTypeNames[sessionOptions!.type];
            showExit = true;
            exitPrompt = "Are you sure you want to quit practice now?";
            child = <MathView
                settings={settings}
                options={sessionOptions!}
                onFinishSession={this.handleFinishSession.bind(this)}
            />
        } else if (this.state.view === 'stats') {
            title = "User Statistics";
            showExit = true;
            child = <StatsView
                onRemoveHistory={this.handleRemoveHistory.bind(this)}
                history={data.history} />
        } else if (this.state.view === 'settings') {
            title = "Settings";
            showExit = true;
            child = <SettingsView
                data={data}
                settings={settings}
                onUpdateSettings={this.handleUpdateSettings.bind(this)}
                onImportSettings={this.handleImportData.bind(this)}
            />
        }

        return (
            <AppContainer
                title={title}
                exitPrompt={exitPrompt}
                onExit={onExit}
                showExit={showExit}>
                {child}
            </AppContainer>
        );
    }
}
