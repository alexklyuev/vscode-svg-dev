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

    /**
     * //
     * M 50 50 V 150 H 150 V 50 Z
     */
    setPointsRelative(d: string): string {
        const points = this.parseStr(d);
        const newPoints = points
        .map((point, index, collection) => {
            const [ command, coords ] = point!;
            if (command === 'Z') {
                return command;
            } else if (command === 'M') {
                return `${ command } ${ coords }`;
            } else if (command.charCodeAt(0) <= 90) {
                let coordValues = coords.split(this.delimeter).map(c => parseFloat(c));
                if (coordValues.length === 1) {
                    console.info('::', command);
                }
                for (let i = index - 1; index > -1; index--) {
                    const [ prevCommand, prevCoords ] = collection[i];
                    let prevValues = prevCoords.split(this.delimeter).slice(-2).map(c => parseFloat(c));
                    let updatedCoords: number[] | null = null;
                    if (prevValues.length === 1) {
                        console.info('++', prevCommand);
                        let prevX = prevCommand === 'H' ? prevValues[0] : null;
                        let prevY = prevCommand === 'V' ? prevValues[0] : null;
                        if (command === 'V') {
                            if (prevY) {
                                updatedCoords = [ coordValues[0] - prevY ];
                            }
                        }
                        if (command === 'H') {
                            if (prevX) {
                                updatedCoords = [ coordValues[0] - prevX ];
                            }
                        }
                    } else {
                        if (command === 'V') {
                            updatedCoords = [ coordValues[0] - prevValues[1] ];
                        }
                        if (command === 'H') {
                            updatedCoords = [ coordValues[0] - prevValues[0] ];
                        }
                    }
                    if (!updatedCoords) {
                        updatedCoords = coordValues.map((cv, index) => cv - prevValues[index % 2]);
                    }
                    if (prevCommand.charCodeAt(0) <= 90) {
                        let relCommand = command.toLowerCase();
                        return relCommand + ' ' + updatedCoords!.join(' ');
                    } else {
                        coordValues = updatedCoords!;
                    }
                }
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
