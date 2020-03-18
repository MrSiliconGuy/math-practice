import React from 'react';
import { SessionType, SessionTypes, SessionTypeNames } from '../model/Math';
import './HomeView.css';

type HomeViewProps = {
    onStartPractice: (type: SessionType) => void,
    onNavigateSelectSession: () => void,
    onNavigateStats: () => void,
    onNavigateSettings: () => void
}

type HomeViewState = {
    sessionType: SessionType,
}

export class HomeView extends React.Component<HomeViewProps, HomeViewState> {
    constructor(props: HomeViewProps) {
        super(props);
        this.state = {
            sessionType: "add"
        }
    }

    handleStartClick() {
        this.props.onStartPractice(this.state.sessionType);
    }

    handleNavigate(view: 'select' | 'stats' | 'settings') {
        if (view === 'select') {
            this.props.onNavigateSelectSession();
        } else if (view === 'stats') {
            this.props.onNavigateStats();
        } else {
            this.props.onNavigateSettings();
        }
    }

    handleSelectType(e: React.ChangeEvent) {
        let sessionType = (e.target as HTMLSelectElement).value as SessionType;
        this.setState({
            sessionType
        })
    }

    render() {
        let sessionType = this.state.sessionType;
        return (
            <div className="Home">
                <button className="Home-start" onClick={this.handleStartClick.bind(this)}>Start Practice</button>
                <select className="Home-start-type" value={sessionType} onChange={this.handleSelectType.bind(this)}>
                    {
                        SessionTypes.map(t => <option value={t} key={t}>
                            {SessionTypeNames[t]}
                        </option>)
                    }
                </select>
                <span className="link" onClick={() => this.handleNavigate('select')}>
                    Custom Session
                </span>
                <span className="link" onClick={() => this.handleNavigate('stats')}>
                    User Stats
                </span>
                <span className="link" onClick={() => this.handleNavigate('settings')}>
                    Settings
                </span>
            </div>
        );
    }
}