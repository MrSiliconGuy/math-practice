import _ from 'lodash';

export const Util = {
    random(): number {
        return Math.random();
    },
    randInt(min: number, max?: number): number {
        if (max === undefined) {
            max = min;
            min = 0;
        }
        return Math.floor(Util.random() * (max - min)) + min;
    },
    randChoice<T>(arr: T[]): T {
        return arr[Util.randInt(0, arr.length)];
    },
    range(min: number, max: number) {
        return _.range(min, max + 1);
    },
    clone<T>(obj: T): T {
        return _.cloneDeep(obj);
    },
    shuffle<T>(arr: T[]): T[] {
        arr = arr.slice();
        for (let i = 0; i < arr.length; i++) {
            let j = Util.randInt(0, arr.length);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },
    extend<TSource, TObj>(obj: TSource, prop: TObj): TSource & TObj {
        return _.extend(obj, prop)
    },
    plural(amount: number,text: string) {
        return amount + " " + text + (amount === 1 ? "" : "s");
    },
    formatSeconds(mills: number): string {
        return Math.round(mills / 100) / 10 + "s";
    },
    formatDate(time: number, curTime: number = new Date().getTime()): string {
        return new Date(time).toISOString();
    }
}