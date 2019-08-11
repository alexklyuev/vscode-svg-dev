import { makeIterator, findIterator } from "../src/iterators";
import { takeUntil } from "@common/iterators";

export class Playground {

    @makeIterator
    event() {
        return 1;
    }

    @makeIterator
    intercept() {
        return 2;
    }

}

const playground = new Playground();

const event$ = findIterator(playground.event)!;

const intercept$ = findIterator(playground.intercept)!;

const finite$ = takeUntil(event$, intercept$);

(async () => {
    for await (const event of finite$) {
        console.log(`event1 is ${ event }`);
    }
})();

const int = setInterval(() => {
    playground.event();
}, 1000);

setTimeout(() => {
    playground.intercept();
}, 5000);

setTimeout(() => {
    clearInterval(int);
}, 10000);

// playground.event();
// playground.event();
// playground.event();
// playground.event();
// playground.event();
// playground.event();
// playground.event();
// playground.intercept();
// playground.event();
// playground.event();
// playground.event();
