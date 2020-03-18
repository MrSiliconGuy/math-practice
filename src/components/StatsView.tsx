import React from 'react';
import { SessionType, MathSessionResults, SessionTypes, SessionTypeNames, MathOperatorSymbols, DefaultRange, MathOperator, MathOperators } from '../model/Math';
import { StatFuncs } from '../model/Stats';
import { Util } from '../model/Util';
import './StatsView.css';

type StatsViewProps = {
    history: MathSessionResults[]
}

type StatsViewState = {
    history: MathSessionResults[],
    view: SessionType
}

export class StatsView extends React.Component<StatsViewProps, StatsViewState> {
    constructor(props: StatsViewProps) {
        super(props);
        this.state = {
            history: StatFuncs.getHistorySorted(props.history),
            view: 'add'
        };
    }

    handleChangeView(e: React.ChangeEvent) {
        let view = (e.target as HTMLSelectElement).value as SessionType;
        this.setState({
            view
        });
    }

    render() {
        let view = this.state.view;
        let history = this.state.history;
        return (
            <div className="StatsView">
                <select value={view} onChange={this.handleChangeView.bind(this)}>
                    {
                        SessionTypes.map(t =>
                            <option key={t} value={t}>{SessionTypeNames[t]}</option>)
                    }
                </select>
                <span>{SessionTypeNames[view]} Attempts: {StatFuncs.filterType(history, view).length}</span>
                <span>Total Attempts: {history.length}</span>
                <div className="StatsView-tables">
                    <RecentStats {...this.state} />
                    <TotalStats {...this.state} />
                    {
                        MathOperators.includes(view as MathOperator) ? (
                            <IndividualStats {...this.state} />
                        ) : null
                    }
                </div>
            </div>
        );
    }
}

export function RecentStats(props: StatsViewState) {
    let history = props.history;
    let latest = StatFuncs.getLatestDefault(history, props.view);

    let child = (latest === null || latest.individual === undefined) ? null : (
        <tr>
            <td>
                <b>Fastest Times:</b>
                <ul>
                    {
                        StatFuncs.getFastest(latest, 5).map((v, i) =>
                            <li key={i}>
                                {v.question.num1 + MathOperatorSymbols[v.question.oper] + v.question.num2 +
                                    " - " + Util.formatSeconds(v.time)}
                            </li>)
                    }
                </ul>
            </td>
            <td>
                <b>Slowest Times:</b>
                <ul>
                    {
                        StatFuncs.getSlowest(latest, 5).map((v, i) =>
                            <li key={i}>
                                {v.question.num1 + MathOperatorSymbols[v.question.oper] + v.question.num2 +
                                    " - " + Util.formatSeconds(v.time)}
                            </li>)
                    }
                </ul>
            </td>
        </tr>);
    return (<table className="RecentStats">
        <caption>Latest Session:</caption>
        <thead>
            <tr>
                <th>Date</th>
                <th>Time</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{latest === null ? "None" :
                    Util.formatDate(latest.date)}</td>
                <td>{latest === null ? "None" :
                    Util.formatSeconds(latest.totalTime)}</td>
            </tr>
            {child}
        </tbody>
    </table>);
}

export function TotalStats(props: StatsViewState) {
    let history = props.history;
    let filtered = StatFuncs.filterType(history, props.view);
    return (<table className="TotalStats">
        <caption>All Sessions</caption>
        <thead>
            <tr>
                <th>&nbsp;</th>
                <th>Date</th>
                <th>Time</th>
                <th>Questions</th>
            </tr>
        </thead>
        <tbody> {
            filtered.map((t, i) =>
                <tr key={i}>
                    <td>{i + 1})</td>
                    <td>{Util.formatDate(t.date)}</td>
                    <td>{Util.formatSeconds(t.totalTime)}</td>
                    <td>{t.individual !== undefined ? "default" : t.numQuestions}</td>
                </tr>)
        }
        </tbody>
    </table>);
}

export function IndividualStats(props: StatsViewState) {
    let history = props.history;
    let oper = props.view as MathOperator;
    let range = Util.range(DefaultRange.min, DefaultRange.max);
    let times = range.map(i => range.map(j => StatFuncs.getIndividualAverage(history, oper, i, j, 5)));
    let timesSorted = times.reduce((arr, times) => arr.concat(times), []).sort((a, b) => b! - a!);
    let getColor = (time: number | null) => {
        if (time === null) {
            return "#777777";
        }
        let index = timesSorted.indexOf(time);
        let ratio = index / timesSorted.length;
        let hue = Math.round(ratio * 160);
        return `hsl(${hue}, 100%, 50%)`;
    }

    let tableData = range.map(i => (
        <tr>
            <th className="IndividualStats-header">{i}</th>
            {
                range.map(j => (() => {
                    let curTime = times[i - DefaultRange.min][j - DefaultRange.min];
                    return <td className="IndividualStats-data" style={{ backgroundColor: getColor(curTime) }}>
                        {curTime === null ? "N/A" : (curTime / 1000).toFixed(1)}
                    </td>
                })())
            }
        </tr>
    ));

    return (
        <table className="IndividualStats">
            <caption>Individual Stats (Average of 5)</caption>
            <thead>
                <tr>
                    <th>{MathOperatorSymbols[oper]}</th>
                    {
                        range.map(n => <th>{n}</th>)
                    }
                </tr>
                {tableData}
            </thead>
        </table>
    );
}