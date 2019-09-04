import { makeIterator, findIterator } from "@/common/iterators";


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


(async () => {
    let mcount = 0;
    const events = event$;
    for await ( const item of events ) {
        mcount++;
        if (mcount > 3) {
            (events as any).return!();
            console.log(`return mcount: ${ mcount }, item: ${ item }`);
        } else {
            console.log(`1) [${ mcount }] event is ${ item } `);
        }
    }
})();

(async () => {
    let mcount = 0;
    for await ( const item of event$ ) {
        console.log(`2) [${ ++mcount }] event is ${ item } `);
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
