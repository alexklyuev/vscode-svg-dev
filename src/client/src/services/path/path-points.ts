// tslint:disable:class-name

/**
 * @link https://developer.mozilla.org/ru/docs/Web/SVG/Tutorial/Paths
 */
export const DPointsDir = Object.freeze({
    M: 'M',
    m: 'm',
    L: 'L',
    l: 'l',
    H: 'H',
    h: 'h',
    V: 'V',
    v: 'v',
    Z: 'Z',
    z: 'z',
    C: 'C',
    c: 'c',
    S: 'S',
    s: 's',
    Q: 'Q',
    q: 'q',
    T: 'T',
    t: 't',
    A: 'A',
    a: 'a',
});

export class DPoint_ANY {

    constructor(
        public readonly base: DPoint,
    ) {}

    toString(): string {
        return `${this.base.command} ${this.base.params}`;
    }

}

export class DPoint_M extends DPoint_ANY {
}

export class DPoint_m extends DPoint_ANY {
}

export class DPoint_L extends DPoint_ANY {
}

export class DPoint_l extends DPoint_ANY {
}

export class DPoint_H extends DPoint_ANY {
}

export class DPoint_h extends DPoint_ANY {
}

export class DPoint_V extends DPoint_ANY {
}

export class DPoint_v extends DPoint_ANY {
}

export class DPoint_Z extends DPoint_ANY {
}

export class DPoint_z extends DPoint_ANY {
}

export class DPoint_C extends DPoint_ANY {
}

export class DPoint_c extends DPoint_ANY {
}

export class DPoint_S extends DPoint_ANY {
}

export class DPoint_s extends DPoint_ANY {
}

export class DPoint_Q extends DPoint_ANY {
}

export class DPoint_q extends DPoint_ANY {
}

export class DPoint_T extends DPoint_ANY {
}

export class DPoint_t extends DPoint_ANY {
}

export class DPoint_A extends DPoint_ANY {
}

export class DPoint_a extends DPoint_ANY {
}


/**
 * 
 */
export class DPoint {

    public readonly command: string;
    public readonly params: string;
    public readonly absolute: boolean;

    constructor(commandOrValue: string)
    constructor(commandOrValue: string, params?: string) {
        if (params && commandOrValue.length === 1) {
            this.command = commandOrValue;
            this.params = params;
        } else {
            this.command = commandOrValue[0];
            this.params = commandOrValue.slice(1).trim();
        }
        this.absolute = this.command.charCodeAt(0) <= 90;
    }

    specify(): DPoint_ANY {
        return eval(`new DPoint_${ this.command }(this)`);
    }

}

/**
 * 
 */
export class PathPoints {

    /**
     * //
     */
    parseStr(d: string): string[][] {
        const res = new Array<string>();
        for (let char of d.trim()) {
            if (char in DPointsDir) {
                res.push(char);
            } else {
                res[res.length - 1] += char;
            }
        }
        return res
        .map(str => str.trim())
        .map(str => [
            str[0],
            str.slice(1).trim(),
        ])
        ;
    }

    /**
     * Parses `d` attribute of <path> element
     */
    parse(d: string): DPoint[] {
        const res = new Array<string>();
        for (let char of d.trim()) {
            if (char in DPointsDir) {
                res.push(char);
            } else {
                res[res.length - 1] += char;
            }
        }
        return res
        .map(str => str.trim())
        .map(str => new DPoint(str))
        ;
    }

    /**
     * //
     */
    parseSpecify(d: string): DPoint_ANY[] {
        return this.parse(d).map(base => base.specify());
    }

    /**
     * //
     */
    setPointsRelative(d: string): string {
        const points = this.parseStr(d);
        const newPoints = points.map((point, index, collection) => {
            const [command, coords] = point;
            switch (command) {
                case 'Z': return command;
                case 'm':
                case 'l':
                case 's':
                case 'M': return `${ command } ${ coords }`;
                case 'L':
                    let [curX, curY] = coords.split(/\s/).map(c => parseInt(c));
                    for (let i = index - 1; index > -1; index--) {
                        const [prevCommand, prevCoords] = collection[i];
                        switch (prevCommand) {
                            case 'M':
                            case 'L':
                                const [prevXL, prevYL] = prevCoords.split(/\s/).map(c => parseInt(c));
                                return `l ${ curX - prevXL } ${ curY - prevYL }`;
                            case 'l':
                                const [prevXl, prevYl] = prevCoords.split(/\s/).map(c => parseInt(c));
                                curX -= prevXl;
                                curY -= prevYl;
                                break;
                            case 'S':
                                let [ , [prevXS, prevYS] ] = prevCoords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseInt(c)));
                                return `l ${ curX - prevXS } ${ curY - prevYS }`;
                            case 's':
                                let [ , [prevXs, prevYs] ] = prevCoords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseInt(c)));
                                curX -= prevXs;
                                curY -= prevYs;
                                break;
                        }
                    }
                case 'S':
                    let [ [x2, y2], [x, y] ] = coords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseInt(c)));
                    for (let i = index - 1; index > -1; index--) {
                        const [prevCommand, prevCoords] = collection[i];
                        switch (prevCommand) {
                            case 'M':
                            case 'L':
                                const [prevXL, prevYL] = prevCoords.split(/\s/).map(c => parseInt(c));
                                return `s ${ x2 - prevXL } ${ y2 - prevYL }, ${ x - prevXL } ${ y - prevYL }`;
                            case 'l':
                                const [prevXl, prevYl] = prevCoords.split(/\s/).map(c => parseInt(c));
                                x -= prevXl;
                                y -= prevYl;
                                x2 -= prevXl;
                                y2 -= prevYl;
                                break;
                            case 'S':
                                let [ , [prevXS, prevYS] ] = prevCoords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseInt(c)));
                                return `s ${ x2 - prevXS } ${ y2 - prevYS }, ${ x - prevXS } ${ y - prevYS }`;
                            case 's':
                                let [ , [prevXs, prevYs] ] = prevCoords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseInt(c)));
                                x -= prevXs;
                                y -= prevYs;
                                x2 -= prevXs;
                                y2 -= prevYs;
                                break;
                        }
                    }
                default: return `${ command } ${ coords }`;
            }
        });
        return newPoints.join(' ');
    }

    /**
     * //
     */
    setPointsAbsolute() {}

}
