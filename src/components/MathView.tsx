import React from 'react';
import { MathSession, MathFuncs, MathSessionOptions, MathOperatorSymbols, MathSessionResults } from '../model/Math';
import { Settings } from '../model/Storage';

type MathViewProps = {
    options: MathSessionOptions,
    settings: Settings,
    onFinishSession: (results: MathSessionResults) => void
}

type MathViewState = {
    input: number | null,
    session: MathSession
}


export class MathView extends React.Component<MathViewProps, MathViewState> {
    constructor(props: MathViewProps) {
        super(props);
        let session = MathFuncs.generateSession(props.options);
        MathFuncs.startSession(session);
        this.state = {
            session,
            input: null
        }
    }

    handleInput(e: React.FormEvent) {
        // Skip if already finished somehow
        if (this.state.session.progress === this.state.session.total) {
            return;
        }

        let value = (e.target as HTMLInputElement).value as string;
        let num = parseInt(value, 10);

        let input = this.state.input;
        input = Number.isNaN(num) ? null : num;

        this.setState({ input }, () => setTimeout(() => {
            let session = this.state.session;
            // Skip if already finished somehow
            if (this.state.session.progress === this.state.session.total) {
                return;
            }

            if (input === session.questions[session.progress].ans) {
                let input = null;
                let startTime = session.timeStarted;
                let totalTime = session.times.reduce((v, t) => v + t, 0);
                let currentTime = new Date().getTime()
                let elapsedTime = currentTime - startTime - totalTime;
                session.times.push(elapsedTime);
                session.progress += 1;
                if (session.progress === session.total) {
                    let results = MathFuncs.generateSessionResults(session);
                    this.props.onFinishSession(results)
                } else {
                    this.setState({
                        session,
                        input
                    });
                }
            }
        }, 100));
    }

    render() {
        let settings = this.props.settings;
        let input = this.state.input;
        let session = this.state.session;
        let curQuestion = session.questions[session.progress];

        return (
            <div className="Math">
                <div className="Math-session">
                    <div className="Math-question">
                        <div className="Math-numbers">
                            <span>{curQuestion.num1}</span>
                            <span>{curQuestion.num2}</span>
                        </div>
                        <span className="Math-oper">{MathOperatorSymbols[curQuestion.oper]}</span>
                    </div>
                    <div className="Math-answer">
                        <input
                            value={input ?? ""}
                            onChange={this.handleInput.bind(this)}
                            type="number" />
                    </div>
                    {
                        settings.showProgressBar ?
                            <progress
                                className="Math-progress"
                                value={session.progress}
                                max={session.total}
                            /> : null
                    }
                </div>
            </div>
        );
    }
}