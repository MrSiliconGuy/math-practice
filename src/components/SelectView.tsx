import React from 'react';
import { MathSessionTemplate, MathSessionOptions, SessionType, SessionTypes, SessionTypeNames } from '../model/Math';
import { Util } from '../model/Util';
import './SelectView.css';

type RangeControlType = "range" | "pool";

const RangeControlTypes: RangeControlType[] = ["range", "pool"];

const RangeControlTypeNames = {
    "range": "Range",
    "pool": "Pool"
}

type SelectViewProps = {
    sessionTemplates: MathSessionTemplate[],
    onStartSession: (options: MathSessionOptions) => void,
    onAddSessionTemplate: (template: MathSessionTemplate) => void,
    onRemoveSessionTemplate: (index: number) => void,
}

type SelectViewState = {
    rangeType: RangeControlType,
    range: { min: number, max: number },
    pool: number[],
    type: SessionType,
    shuffle: boolean,
    random: boolean,
    numberQuestions: number
}

export class SelectView extends React.Component<SelectViewProps, SelectViewState> {
    constructor(props: SelectViewProps) {
        super(props);
        this.state = {
            rangeType: "range",
            range: { min: 1, max: 12 },
            pool: Util.range(1, 12),
            type: "add",
            shuffle: true,
            random: false,
            numberQuestions: 20
        }
    }

    handleStartSession() {
        this.props.onStartSession({
            type: this.state.type,
            useRange: this.state.rangeType === "range",
            range: this.state.range,
            pool: this.state.pool,
            order: this.state.random ? "random" :
                this.state.shuffle ? "all-shuffle" : "all",
            numQuestions: this.state.numberQuestions,
            isDefault: false
        });
    }

    handleStartSessionTemplate(index: number) {
        let template = this.props.sessionTemplates[index];
        this.props.onStartSession(template.options);
    }

    handleSaveTemplate() {
        let options: MathSessionOptions = {
            type: this.state.type,
            useRange: this.state.rangeType === "range",
            range: this.state.range,
            pool: this.state.pool,
            order: this.state.random ? "random" :
                this.state.shuffle ? "all-shuffle" : "all",
            numQuestions: this.state.numberQuestions,
            isDefault: false
        }
        let name = window.prompt("Please enter a name for your session:");
        if (name === null) {
            return;
        }
        this.props.onAddSessionTemplate({
            options,
            name
        })
    }

    handleRemoveTemplate(index: number) {
        this.props.onRemoveSessionTemplate(index);
    }

    handleSelectRangeType(e: React.ChangeEvent) {
        let rangeType = (e.target as HTMLSelectElement).value as RangeControlType;
        this.setState({ rangeType });
    }

    handleInputRangeAmount(e: React.ChangeEvent, min: boolean) {
        let value = parseInt((e.target as HTMLInputElement).value, 10);
        let range = Util.clone(this.state.range);
        if (min) {
            range.min = value;
        } else {
            range.max = value;
        }
        this.setState({
            range
        });
    }

    handleValidateRangeAmount(e: React.ChangeEvent, min: boolean) {
        let value = parseInt((e.target as HTMLInputElement).value, 10);
        if (Number.isNaN(value)) {
            value = NaN
        }
        value = Math.min(Math.max(value, 1), 1000);
        let range = Util.clone(this.state.range);
        if (min) {
            range.min = value;
            if (range.max < range.min) {
                range.max = range.min;
            }
        } else {
            range.max = value;
            if (range.min > range.max) {
                range.min = range.max
            }
        }
        this.setState({
            range
        });
    }

    handleToggleRangePool(num: number) {
        let pool = this.state.pool
        let index = pool.indexOf(num);
        if (index === -1) {
            pool.push(num);
        } else {
            pool.splice(index, 1);
        }
        this.setState({ pool });
    }

    handleSelectType(e: React.ChangeEvent) {
        let type = (e.target as HTMLSelectElement).value as SessionType;
        this.setState({ type });
    }

    handleToggleShuffle() {
        this.setState({
            shuffle: !this.state.shuffle
        });
    }

    handleToggleRandom() {
        this.setState({
            random: !this.state.random
        });
    }

    handleSelectNumberQuestions(numberQuestions: number) {
        this.setState({
            numberQuestions
        });
    }

    render() {
        let templates = this.props.sessionTemplates;
        let rangeType = this.state.rangeType;
        let range = this.state.range;
        let pool = this.state.pool;
        let type = this.state.type;
        let random = this.state.random;
        let shuffle = this.state.shuffle;
        let numberQuestions = this.state.numberQuestions;

        let rangeControls: React.ReactNode;
        if (rangeType === "range") {
            rangeControls = <div className="Select-range-range">
                <input type="number" pattern="[0-9]*"
                    value={Number.isNaN(range.min) ? "" : range.min}
                    onChange={e => this.handleInputRangeAmount(e, true)}
                    onBlur={e => this.handleValidateRangeAmount(e, true)} />
                <input type="number" pattern="[0-9]*"
                    value={Number.isNaN(range.max) ? "" : range.max}
                    onChange={e => this.handleInputRangeAmount(e, false)}
                    onBlur={e => this.handleValidateRangeAmount(e, false)} />
            </div>
        } else if (rangeType === "pool") {
            rangeControls = <div className="Select-range-pool">{
                Util.range(1, 12).map(i =>
                    <button key={i}
                        className={"Select-range-pool-button " +
                            (pool.includes(i) ? "Select-range-pool-button-selected" : "")}
                        onClick={() => this.handleToggleRangePool(i)}>
                        {i}
                    </button>)
            }</div>
        }

        let orderControls: React.ReactNode;
        if (random) {
            orderControls = <div className="Select-order-random">
                {
                    [20, 50, 100].map(n => [
                        <input type="radio" value={n}
                            checked={n === numberQuestions}
                            onChange={() => this.handleSelectNumberQuestions(n)} />,
                        <label
                            onClick={() => this.handleSelectNumberQuestions(n)}>{n} Questions</label>
                    ])
                }
            </div>
        } else {
            orderControls = <div className="Select-order-shuffle">
                <input type="checkbox" checked={shuffle}
                    onChange={this.handleToggleShuffle.bind(this)} />
                <label
                    onClick={this.handleToggleShuffle.bind(this)}> Shuffle? </label>
            </div>
        }

        return (
            <div className="Select">
                <div className="Select-templates">
                    {
                        templates.map((t, i) =>
                            <SessionTemplate
                                name={t.name}
                                key={t.name}
                                onStart={() => this.handleStartSessionTemplate(i)}
                                onRemove={() => this.handleRemoveTemplate(i)}
                            />
                        )
                    }
                </div>
                <div className="Select-options">
                    <div className="Select-rangetype">
                        <select value={rangeType} onChange={this.handleSelectRangeType.bind(this)}>
                            {
                                RangeControlTypes.map(t =>
                                    <option key={t} value={t}>{RangeControlTypeNames[t]}</option>)
                            }
                        </select>
                    </div>
                    {rangeControls}
                    <div className="Select-type">
                        <span>Type: </span>
                        <select value={type} onChange={this.handleSelectType.bind(this)}>
                            {
                                SessionTypes.map(t =>
                                    <option key={t} value={t}>{SessionTypeNames[t]}</option>)
                            }
                        </select>
                    </div>
                    <div className="Select-order">
                        <input type="checkbox" checked={random}
                            onChange={this.handleToggleRandom.bind(this)} />
                        <label onClick={this.handleToggleRandom.bind(this)}>
                            Random?
                        </label>
                        {orderControls}
                    </div>
                    <div className="Select-submit">
                        <button onClick={this.handleStartSession.bind(this)}>Start Practice</button>
                        <span className="link" onClick={this.handleSaveTemplate.bind(this)}>Save Settings</span>
                    </div>
                </div>
            </div>
        );
    }
}

type SessionTemplateProps = {
    name: string,
    onStart: () => void,
    onRemove: () => void
}

export function SessionTemplate(props: SessionTemplateProps) {
    return (<div className="SessionTemplate">
        <button className="SessionTemplate-start" onClick={props.onStart}>Start</button>
        <span className="SessionTemplate-name">{props.name}</span>
        <button className="SessionTemplate-remove" onClick={props.onRemove}>×</button>
    </div>);
}