import { PathPoints } from "./path-directives";


const pathDirs = new PathPoints(
    `
    M10 315
               L 110 215
               A 30 50 0 0 1 162.55 162.45
               L 172.55 152.45
               A 30 50 -45 0 1 215.1 109.9
               L 315 10
    `
);

console.info(pathDirs.parseSpecify());
