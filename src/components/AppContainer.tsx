import React from 'react';

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
                {showExit ? <button onClick={this.handleExit.bind(this)}>×</button> : null}
            </div>
            <div className="AppContainer-container">
                {children}
            </div>
        </div>;
    }
}