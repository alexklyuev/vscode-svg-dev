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

    private readonly delimeter = /[\s,]+/;

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

    getAbsDims(points: string[][]): number[][] {
        const dims = Array<number[]>();
        for (let i = 0; i < points.length; i++) {
            const [ command, coords ] = points[i];
            const coordValues = coords.split(this.delimeter).slice(-2).map(c => parseFloat(c));
            if (command === 'M' || command === 'm') {
                dims.push(coordValues);
            } else if (command === 'Z') {
                continue;
            } else if (coordValues.length === 2) {
                if (command.charCodeAt(0) <= 90) {
                    dims.push(coordValues);
                } else {
                    dims.push( dims[dims.length - 1].map((v, index) => v + coordValues[index]) );
                }
            } else if (coordValues.length === 1) {
                const [x, y] = dims[dims.length - 1];
                switch (command) {
                    case 'H':
                        dims.push([coordValues[0], y]);
                        break;
                    case 'h':
                        dims.push([coordValues[0] + x, y]);
                        break;
                    case 'V':
                        dims.push([x, coordValues[0]]);
                        break;
                    case 'v':
                        dims.push([x, y + coordValues[0]]);
                        break;
                }
            } else {
                console.error(`PathPoints#getAbsDims: unsuspected condition: ${ command } ${ coords }`);
            }
        }
        return dims;
    }

    /**
     * //
     * M 50 50 V 150 H 150 V 50 Z
     */
    setPointsRelative(d: string): string {
        const points = this.parseStr(d);
        const dims = this.getAbsDims(points);
        const newPoints = points
        .map((point, index, collection) => {
            const [ command, coords ] = point!;
            if (command === 'Z') {
                return command;
            } else if (command === 'M') {
                return `${ command } ${ coords }`;
            } else if (command.charCodeAt(0) <= 90) {

                const prevValues = dims[index - 1];
                let coordValues = coords.split(this.delimeter).map(c => parseFloat(c));
                let updatedCoords = Array<number>();
                if (coordValues.length > 1) {
                    updatedCoords = coordValues.map((cv, index) => cv - prevValues[index % 2]);
                } else {
                    const [prevX, prevY] = prevValues;
                    switch (command) {
                        case 'H':
                            updatedCoords = [ coordValues[0] - prevX ];
                            break;
                            case 'V':
                            updatedCoords = [ coordValues[0] - prevY ];
                            break;
                    }
                }
                return `${ command.toLowerCase() } ${ updatedCoords.join(' ') }`;
            } else {
                return `${ command } ${ coords }`;
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
