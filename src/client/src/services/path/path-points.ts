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
                case 'c':
                case 'M': return `${ command } ${ coords }`;
                case 'L':
                    let [lx, ly] = coords.split(/\s/).map(c => parseFloat(c));
                    for (let i = index - 1; index > -1; index--) {
                        const [prevCommand, prevCoords] = collection[i];
                        switch (prevCommand) {
                            case 'M':
                            case 'L':
                                const [prevXL, prevYL] = prevCoords.split(/\s/).map(c => parseFloat(c));
                                return `l ${ lx - prevXL } ${ ly - prevYL }`;
                            case 'l':
                                const [prevXl, prevYl] = prevCoords.split(/\s/).map(c => parseFloat(c));
                                lx -= prevXl;
                                ly -= prevYl;
                                break;
                            case 'S':
                                let [ , [prevXS, prevYS] ] = prevCoords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseFloat(c)));
                                return `l ${ lx - prevXS } ${ ly - prevYS }`;
                            case 's':
                                let [ , [prevXs, prevYs] ] = prevCoords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseFloat(c)));
                                lx -= prevXs;
                                ly -= prevYs;
                                break;
                            case 'C':
                                let [ , , [prevXC, prevYC] ] = prevCoords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseFloat(c)));
                                return `l ${ lx - prevXC } ${ ly - prevYC }`;
                            case 'c':
                                let [ , , [prevXc, prevYc] ] = prevCoords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseFloat(c)));
                                lx -= prevXc;
                                ly -= prevYc;
                                break;
                        }
                    }
                case 'S':
                    let [ [sx2, sy2], [sx, sy] ] = coords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseFloat(c)));
                    for (let i = index - 1; index > -1; index--) {
                        const [prevCommand, prevCoords] = collection[i];
                        switch (prevCommand) {
                            case 'M':
                            case 'L':
                                const [prevXL, prevYL] = prevCoords.split(/\s/).map(c => parseFloat(c));
                                return `s ${ sx2 - prevXL } ${ sy2 - prevYL }, ${ sx - prevXL } ${ sy - prevYL }`;
                            case 'l':
                                const [prevXl, prevYl] = prevCoords.split(/\s/).map(c => parseFloat(c));
                                sx -= prevXl;
                                sy -= prevYl;
                                sx2 -= prevXl;
                                sy2 -= prevYl;
                                break;
                            case 'S':
                                let [ , [prevXS, prevYS] ] = prevCoords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseFloat(c)));
                                return `s ${ sx2 - prevXS } ${ sy2 - prevYS }, ${ sx - prevXS } ${ sy - prevYS }`;
                            case 's':
                                let [ , [prevXs, prevYs] ] = prevCoords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseFloat(c)));
                                sx -= prevXs;
                                sy -= prevYs;
                                sx2 -= prevXs;
                                sy2 -= prevYs;
                                break;
                            case 'C':
                                let [ , , [prevXC, prevYC] ] = prevCoords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseFloat(c)));
                                return `s ${ sx2 - prevXC } ${ sy2 - prevYC }, ${ sx - prevXC } ${ sy - prevYC }`;
                            case 'c':
                                let [ , , [prevXc, prevYc] ] = prevCoords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseFloat(c)));
                                sx -= prevXc;
                                sy -= prevYc;
                                sx2 -= prevXc;
                                sy2 -= prevYc;
                                break;
                        }
                    }
                case 'C':
                    let [ [cx1, cy1], [cx2, cy2], [cx, cy] ] = coords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseFloat(c)));
                    for (let i = index - 1; index > -1; index--) {
                        const [prevCommand, prevCoords] = collection[i];
                        switch (prevCommand) {
                            case 'M':
                            case 'L':
                                const [prevXL, prevYL] = prevCoords.split(/\s/).map(c => parseFloat(c));
                                return `c ${ cx1 - prevXL } ${ cy1 - prevYL }, ${ cx2 - prevXL } ${ cy2 - prevYL }, ${ cx - prevXL } ${ cy - prevYL }`;
                            case 'l':
                                const [prevXl, prevYl] = prevCoords.split(/\s/).map(c => parseFloat(c));
                                cx -= prevXl;
                                cy -= prevYl;
                                cx1 -= prevXl;
                                cy1 -= prevYl;
                                cx2 -= prevXl;
                                cy2 -= prevYl;
                                break;
                            case 'S':
                                let [ , [prevXS, prevYS] ] = prevCoords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseFloat(c)));
                                return `c ${ cx1 - prevXS } ${ cy1 - prevYS }, ${ cx2 - prevXS } ${ cy2 - prevYS }, ${ cx - prevXS } ${ cy - prevYS }`;
                            case 's':
                                let [ , [prevXs, prevYs] ] = prevCoords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseFloat(c)));
                                cx -= prevXs;
                                cy -= prevYs;
                                cx1 -= prevXs;
                                cy1 -= prevYs;
                                cx2 -= prevXs;
                                cy2 -= prevYs;
                                break;
                            case 'C':
                                let [ , , [prevXC, prevYC] ] = prevCoords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseFloat(c)));
                                return `c ${ cx1 - prevXC } ${ cy1 - prevYC }, ${ cx2 - prevXC } ${ cy2 - prevYC }, ${ cx - prevXC } ${ cy - prevYC }`;
                            case 'c':
                                let [ , , [prevXc, prevYc] ] = prevCoords.split(',').map(pair => pair.trim().split(/\s/).map(c => parseFloat(c)));
                                cx -= prevXc;
                                cy -= prevYc;
                                cx1 -= prevXc;
                                cy1 -= prevYc;
                                cx2 -= prevXc;
                                cy2 -= prevYc;
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
    setPointsAbsolute() {
        throw new Error('PathPoints#setPointsAbsolute: Not implemented');
    }

}
