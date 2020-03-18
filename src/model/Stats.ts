import { SessionType, MathSessionResults, MathQuestion, MathOperator, MathFuncs, DefaultRange } from "./Math";

type QuestionTime = {
    question: MathQuestion
    time: number
}

export const StatFuncs = {
    filterType(history: MathSessionResults[], type: SessionType): MathSessionResults[] {
        return history.filter(v => v.type === type);
    },
    getLatestDefault(history: MathSessionResults[], type: SessionType): MathSessionResults | null {
        for (let i = history.length - 1; i >= 0; i--) {
            if (history[i].type === type) {
                return history[i];
            }
        }
        return null;
    },
    getHistorySorted(history: MathSessionResults[]): MathSessionResults[] {
        return history.slice().sort((h1, h2) => h1.date - h2.date);
    },
    getFastest(result: MathSessionResults, amount: number): QuestionTime[] {
        let individual = result.individual!;
        let fastest: QuestionTime[] = [];
        // Loop over each time
        for (let i = 0; i < individual.times.length; i++) {
            for (let j = 0; j < individual.times.length; j++) {
                let time = individual.times[i][j];
                // Add if it is faster than the slowest in the list
                if (fastest.length < amount || fastest[fastest.length - 1].time > time) {
                    fastest.push({
                        question:
                            MathFuncs.generateQuestion(i + individual.range.min,
                                j + individual.range.min, result.type as MathOperator),
                        time: time
                    });
                    fastest.sort((a, b) => a.time - b.time);
                    fastest.splice(amount);
                }
            }
        }
        return fastest;
    },
    getSlowest(result: MathSessionResults, amount: number): QuestionTime[] {
        let individual = result.individual!;
        let slowest: QuestionTime[] = [];
        for (let i = 0; i < individual.times.length; i++) {
            for (let j = 0; j < individual.times.length; j++) {
                let time = individual.times[i][j];
                if (slowest.length < amount || slowest[slowest.length - 1].time < time) {
                    slowest.push({
                        question:
                            MathFuncs.generateQuestion(i + individual.range.min,
                                j + individual.range.min, result.type as MathOperator),
                        time: time
                    });
                    slowest.sort((a, b) => b.time - a.time);
                    slowest.splice(amount);
                }
            }
        }
        return slowest;
    },
    getIndividualAverage(history: MathSessionResults[], type: SessionType,
        num1: number, num2: number, amount: number): number | null {

        let filtered = StatFuncs.filterType(history, type);
        let count = 0;
        let sum = 0;
        for (const res of filtered) {
            if (res.individual !== undefined) {
                count += 1;
                sum += res.individual.times[num1 - DefaultRange.min][num2 - DefaultRange.min];
            }
        }

        if (count === 0) {
            return null;
        } else {
            return sum / count;
        }
    }
}