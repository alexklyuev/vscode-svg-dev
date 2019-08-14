import { makeIterator, findIterator } from "../src/iterators";
import { takeUntil, merge } from '@/common/iterators';

export class Playground {

    @makeIterator()
    event() {
        return 1;
    }

    @makeIterator()
    intercept() {
        return 2;
    }

}

const playground = new Playground();

const event$ = findIterator(playground.event)!;

const intercept$ = findIterator(playground.intercept)!;

const finite$ = takeUntil(event$, intercept$);

const merged$ = merge(event$, intercept$);

let count = 0;

(async () => {
    for await ( const event of finite$() ) {
        console.log(`[${ ++count }] event1 is ${ event }`);
    }
    console.log('--------------!!!-----------');
})();

(async () => {
    for await ( const event of event$() ) {
        console.log(`[${ ++count }] event2 is ${ event }`);
    }
})();

(async () => {
    for await ( const event of event$() ) {
        console.log(`[${ ++count }] event3 is ${ event }`);
    }
})();

let mcount = 0;

(async () => {
    for await ( const item of merged$() ) {
        console.log(`[${ ++mcount }] merged event is ${ item } `);
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
