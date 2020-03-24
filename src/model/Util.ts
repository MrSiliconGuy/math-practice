import _ from 'lodash';
import * as randomJS from 'random-js';

const rng = new randomJS.Random();

export const Util = {
    random(): number {
        return rng.realZeroToOneExclusive();
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
    plural(amount: number, text: string) {
        return amount + " " + text + (amount === 1 ? "" : "s");
    },
    formatSeconds(mills: number): string {
        return Math.round(mills / 100) / 10 + "s";
    },
    formatDate(time: number, curTime: number = new Date().getTime()): string {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "Februrary", "March", "April", "May", "June", "July", "August", "September",
            "October", "November", "December"
        ];

        let date = new Date(time);
        let diff = (curTime - time) / (1000 * 60); // Time difference in minutes
        let minutesAgo = Math.round(diff);
        let hoursAgo = Math.round(diff / 60);
        let daysAgo = Math.round(diff / 60 / 24);

        if (diff < 1 && diff > 0) {
            return `Just now`;
        } else if (diff < 60) {
            return Util.plural(minutesAgo, "minute") + " ago";
        } else if (diff < (60 * 24)) {
            return Util.plural(hoursAgo, "hour") + " ago";
        } else if (diff < (60 * 24 * 3)) {
            return Util.plural(daysAgo, "day") + " ago";
        } else if (diff < (60 * 24 * 7)) {
            return "Last " + days[date.getDay()] + " (" + Util.plural(daysAgo, "day") + " ago)";
        } else {
            return months[date.getMonth()] + " " + date.getDate() + "(" + Util.plural(daysAgo, "days") + " ago)";
        }
    }
}