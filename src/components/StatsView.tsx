import React from 'react';
import { SessionType, MathSessionResults, SessionTypes, SessionTypeNames, MathOperatorSymbols, DefaultRange, MathOperator, MathOperators } from '../model/Math';
import { StatFuncs } from '../model/Stats';
import { Util } from '../model/Util';
import cross from './cross.svg';
import './StatsView.css';

type StatsViewProps = {
    history: MathSessionResults[],
    onRemoveHistory: (index: number) => void
}

type StatsViewState = {
    view: SessionType
}

export class StatsView extends React.Component<StatsViewProps, StatsViewState> {
    constructor(props: StatsViewProps) {
        super(props);
        this.state = {
            view: 'add'
        };
    }

    handleChangeView(e: React.ChangeEvent) {
        let view = (e.target as HTMLSelectElement).value as SessionType;
        this.setState({
            view
        });
    }

    handleRemoveHistory(index: number) {
        this.props.onRemoveHistory(index);
    }

    render() {
        let view = this.state.view;
        let history = this.props.history;
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
                    <RecentStats {...this.state} {...this.props} />
                    <TotalStats {...this.state} {...this.props} onRemoveHistory={this.handleRemoveHistory.bind(this)} />
                    {
                        MathOperators.includes(view as MathOperator) ? (
                            <IndividualStats {...this.state} {...this.props} />
                        ) : null
                    }
                </div>
            </div>
        );
    }
}

type RecentStatsProps = {
    view: SessionType,
    history: MathSessionResults[],
}

export function RecentStats(props: RecentStatsProps) {
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


type TotalStatsProps = {
    view: SessionType,
    history: MathSessionResults[],
    onRemoveHistory: (index: number) => void
}


export function TotalStats(props: TotalStatsProps) {
    let history = props.history;
    let sorted = StatFuncs.getHistorySorted(history);
    let filtered = StatFuncs.filterType(sorted, props.view);
    let defaultHistory = filtered.filter(s => s.individual !== undefined);
    let nonDefaultHistory = filtered.filter(s => s.individual === undefined);

    function handleRemove(date: number) {
        if (!window.confirm("Are you sure you want to remove this session?")) {
            return;
        }
        props.onRemoveHistory(history.findIndex(h => h.date === date));
    }

    return (<table className="TotalStats">
        <caption>All Sessions</caption>
        <thead>
            <tr>
                <th>&nbsp;</th>
                <th>Date</th>
                <th>Time</th>
                <th>Questions</th>
                <th>&nbsp;</th>
            </tr>
        </thead>
        <tbody>
            {
                defaultHistory.map((t, i) =>
                    <tr key={i}>
                        <td>{i + 1})</td>
                        <td>{Util.formatDate(t.date)}</td>
                        <td>{Util.formatSeconds(t.totalTime)}</td>
                        <td>{t.individual !== undefined ? "default" : t.numQuestions}</td>
                        <td>
                            <button onClick={() => handleRemove(t.date)}>
                                <img src={cross} alt="X" />
                            </button>
                        </td>
                    </tr>)
            }
            {
                nonDefaultHistory.map((t, i) =>
                    <tr key={i}>
                        <td>{i + 1})</td>
                        <td>{Util.formatDate(t.date)}</td>
                        <td>{Util.formatSeconds(t.totalTime)}</td>
                        <td>{t.individual !== undefined ? "default" : t.numQuestions}</td>
                        <td>
                            <button onClick={() => handleRemove(t.date)}>
                                <img src={cross} alt="X" />
                            </button>
                        </td>
                    </tr>)
            }
        </tbody>
    </table>);
}

type IndividualStatsState = {
    view: SessionType,
    history: MathSessionResults[],
}

export function IndividualStats(props: IndividualStatsState) {
    let history = props.history;
    let oper = props.view as MathOperator;
    let range = Util.range(DefaultRange.min, DefaultRange.max);
    let times = range.map(i => range.map(j => StatFuncs.getIndividualAverage(history, oper, i, j, 5)));
    let timesSorted: number[] = times
        .reduce((arr, times) => arr.concat(times), [])
        .filter(t => t !== null)
        .sort((a, b) => b! - a!) as number[];
    let minTime = Math.min(...timesSorted);
    let maxTime = Math.max(...timesSorted);
    let getColor = (time: number | null) => {
        if (time === null) {
            return "#777777";
        }
        // Ratio based on relative scale
        // let index = timesSorted.indexOf(time);
        // let ratio = index / timesSorted.length;
        // ----- Ratio based on relative scale 2 -----
        // let ratio = (time - minTime) / (maxTime - minTime);
        // ----- Ratio based on absolute scale -----
        //     with 4 as max time
        let ratio = Math.max(1, time / 4.0);
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