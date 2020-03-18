import { Util } from "./Util";

export type MathOperator = 'add' | 'sub' | 'mul' | 'div';

export const MathOperators: MathOperator[] = ['add', 'sub', 'mul', 'div'];

export type SessionType = MathOperator | 'mix' | 'sqr';

export const SessionTypes: SessionType[] = ['add', 'sub', 'mul', 'div', 'mix', 'sqr'];

export const MathOperatorSymbols = {
    'add': '+',
    'sub': '-',
    'mul': '*',
    'div': '/'
}

export const SessionTypeNames = {
    'add': 'Addition',
    'sub': 'Subtraction',
    'mul': 'Multiplication',
    'div': 'Division',
    'mix': 'Mixed',
    'sqr': 'Squares'
}

export type MathQuestion = {
    num1: number,
    num2: number,
    oper: MathOperator,
    ans: number
}

export type MathSession = {
    timeStarted: number,
    type: SessionType,
    questions: MathQuestion[],
    times: number[],
    progress: number,
    total: number,
    isDefault: boolean,
}

export type MathSessionOrder = 'all' | 'all-shuffle' | 'random';

export type MathSessionOptions = {
    type: SessionType,
    // Whether to use range or pool
    useRange: boolean,
    pool?: number[],
    range?: { min: number, max: number },

    // Run all questions, all but shuffled, or a random amount (uses numQuestions)
    order: MathSessionOrder,
    numQuestions?: number,

    // Whether or not this is a default session
    isDefault: boolean
}

export type MathSessionTemplate = {
    options: MathSessionOptions,
    name: string
}

export type MathSessionResults = {
    date: number,
    type: SessionType,
    totalTime: number,
    numQuestions: number,
    individual?: MathSessionIndividualResults
}

export type MathSessionIndividualResults = {
    oper: MathOperator,
    range: { min: number, max: number }
    times: number[][]
}

export const DefaultRange = {
    min: 1,
    max: 12
}

export const MathFuncs = {
    generateQuestion(num1: number, num2: number, oper: MathOperator): MathQuestion {
        if (oper === 'add') {
            return {
                num1, num2, oper, ans: num1 + num2
            }
        } else if (oper === 'sub') {
            return {
                num1: num1 + num2, num2, oper, ans: num1
            }
        } else if (oper === 'mul') {
            return {
                num1, num2, oper, ans: num1 * num2
            }
        } else if (oper === 'div') {
            return {
                num1: num1 * num2, num2, oper, ans: num1
            }
        }
        throw Error();
    },
    generateQuestionsRandom(type: SessionType, pool: number[], numQuestions: number): MathQuestion[] {
        let num1: number;
        let num2: number;
        let oper: MathOperator;
        let questions: MathQuestion[] = [];
        for (let i = 0; i < numQuestions; i++) {
            if (type === "mix") {
                oper = Util.randChoice(MathOperators);
                num1 = Util.randChoice(pool);
                num2 = Util.randChoice(pool);
            } else if (type === "sqr") {
                oper = 'mul';
                num1 = Util.randChoice(pool);
                num2 = num1;
            } else {
                oper = type;
                num1 = Util.randChoice(pool);
                num2 = Util.randChoice(pool);
            }
            let question = MathFuncs.generateQuestion(num1, num2, oper);
            questions.push(question);
        }
        return questions;
    },
    generateQuestionsOrdered(type: SessionType, pool: number[]): MathQuestion[] {
        let num1: number;
        let num2: number;
        let oper: MathOperator;
        let questions: MathQuestion[] = [];
        for (let i = 0; i < pool.length; i++) {
            for (let j = 0; j < pool.length; j++) {
                if (type === "mix") {
                    oper = Util.randChoice(MathOperators);
                    num1 = pool[i];
                    num2 = pool[j];
                } else if (type === "sqr") {
                    oper = "mul";
                    num1 = pool[i];
                    num2 = pool[j];
                    if (num1 !== num2) {
                        continue;
                    }
                } else {
                    oper = type;
                    num1 = pool[i];
                    num2 = pool[j];
                }
                let question = MathFuncs.generateQuestion(num1, num2, oper);
                questions.push(question);
            }
        }
        return questions;
    },
    generateSession(options: MathSessionOptions): MathSession {
        let type = options.type;
        let questions: MathQuestion[] = [];
        let timeStarted = 0;
        let times: number[] = [];
        let progress = 0;
        let total: number;
        let isDefault = options.isDefault;

        let pool: number[];
        if (options.useRange) {
            pool = Util.range(options.range!.min, options.range!.max);
        } else {
            pool = Util.clone(options.pool!);
        }

        // Generate Questions
        if (options.order === "random") {
            questions = MathFuncs.generateQuestionsRandom(type, pool, options.numQuestions!);
        } else if (options.order === "all") {
            questions = MathFuncs.generateQuestionsOrdered(type, pool);
        } else if (options.order === "all-shuffle") {
            questions = MathFuncs.generateQuestionsOrdered(type, pool);
            questions = Util.shuffle(questions);
        }
        total = questions.length;

        return {
            timeStarted,
            type,
            questions,
            times,
            progress,
            total,
            isDefault
        }
    },
    generateDefaultSessionOptions(type: SessionType): MathSessionOptions {
        let useRange = true;
        let range = Util.clone(DefaultRange);
        let order: "all-shuffle" = "all-shuffle";
        return {
            type,
            useRange,
            range,
            order,
            isDefault: true
        };
    },
    generateSessionResults(session: MathSession): MathSessionResults {
        let date = session.timeStarted;
        let type = session.type;
        let totalTime = session.times.reduce((a, t) => a + t, 0)
        let individual = MathFuncs.generateSessionIndividualResults(session);
        let numQuestions = session.total;
        return {
            date,
            type,
            totalTime,
            numQuestions,
            individual
        };
    },
    generateSessionIndividualResults(session: MathSession): MathSessionIndividualResults | undefined {
        // Only default math sessions where the session type is a math operator
        // are allowed
        if (!session.isDefault || !MathOperators.includes(session.type as MathOperator)) {
            return;
        }
        let oper = session.type as MathOperator;
        let range = Util.clone(DefaultRange);
        let times: number[][] = [];
        for (let i = range.min; i <= range.max; i++) {
            let arr: number[] = []
            for (let j = range.min; j <= range.max; j++) {
                arr.push(0);
            }
            times.push(arr);
        }
        for (let i = 0; i < session.questions.length; i++) {
            let question = session.questions[i];
            let time = session.times[i];
            let num1: number, num2: number;
            if (['sub', 'div'].includes(question.oper)) {
                num1 = question.ans;
                num2 = question.num2;
            } else {
                num1 = question.num1;
                num2 = question.num2;
            }
            let index1 = num1 - range.min;
            let index2 = num2 - range.min;
            times[index1][index2] = time;
        }

        return {
            oper,
            range,
            times
        };
    },
    startSession(session: MathSession): MathSession {
        session.timeStarted = new Date().getTime();
        return session;
    }
}