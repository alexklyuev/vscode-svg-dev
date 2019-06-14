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

    public readonly parsed: DPoint_ANY[];

    constructor(
        public readonly d: string,
    ) {
        this.parsed = this.parseSpecify();
    }

    /**
     * Parses `d` attribute of <path> element
     */
    parse(): DPoint[] {
        const res = new Array<string>();
        for (let char of this.d.trim()) {
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
    parseSpecify(): DPoint_ANY[] {
        return this.parse().map(base => base.specify());
    }

    /**
     * //
     */
    setPointsRelative() {}

    /**
     * //
     */
    setPointsAbsolute() {}

}
