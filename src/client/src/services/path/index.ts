import { PathPoints } from "./path-points";


function check(result: string, expect: string) {
    if (result === expect) {
        console.log(`Pass: ${ expect }`);
    } else {
        console.log(`Error, \nresult: ${ result }\nexpect: ${ expect }`);
    }
    console.log('-'.repeat(30));
}


export const pathPoints = new PathPoints();


check(pathPoints.setPointsRelative('M 50 50 V 150 H 150 V 50 Z'), 'M 50 50 v 100 h 100 v -100 Z');
check(pathPoints.setPointsRelative('M34 55V198L58 204H69L74 200V167V127L61 90L34 55Z'), 'M 34 55 v 143 l 24 6 Z');
