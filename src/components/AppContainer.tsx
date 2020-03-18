import React from 'react';
import './AppContainer.css';
import cross from './cross.svg';

type AppContainerProps = {
    title: string,
    children: React.ReactNode,
    showExit: boolean,
    exitPrompt: string | null,
    onExit: () => void
}

export class AppContainer extends React.Component<AppContainerProps> {
    handleExit() {
        let exit = true;
        if (this.props.exitPrompt !== null) {
            exit = window.confirm(this.props.exitPrompt);
        }
        if (exit) {
            this.props.onExit();
        }
    }

    render() {
        let title = this.props.title;
        let children = this.props.children;
        let showExit = this.props.showExit;
        return <div className="AppContainer">
            <div className="AppContainer-topbar">
                <span>{title}</span>
                {showExit ? (<button onClick={this.handleExit.bind(this)}>
                    {<img src={cross} alt="X"/>}
                </button>) : null}
            </div>
            <div className="AppContainer-container">
                {children}
            </div>
        </div>;
    }
}