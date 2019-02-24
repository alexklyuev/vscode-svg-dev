import { DataClass } from "./data-class.interface";
import { createDataClass } from "./create-data-class.function";


export type RequestMethods = 'get' | 'set';

export type ResponseMethods = 'response';

export interface ListenerFn<
    Tag extends string,
    Request,
    Response,
> {
    (callback: (data: any) => void): () => void;
}

export type SenderData<
    Tag extends string,
    Request,
    Response,
> = {
    [K in Tag]: {
        [M in RequestMethods]?: Request
    } | {
        [M in ResponseMethods]?: Response
    }
};

export interface SenderFn<
    Tag extends string,
    Request,
    Response,
> {
    (data: SenderData<Tag, Request, Response>): void;
}

/**
 * //
 */
export class TypedWireEndpoint<
    Tag extends string,
    Request,
    Response,
> {

    private requestGuard: (data: any) => data is {[K in Tag]: {[M in RequestMethods]: Request}};
    private responseGuard: (data: any) => data is {[K in Tag]: {[M in ResponseMethods]: Response}};

    private listeners = new Array<() => void>();

    constructor(
        public readonly tag: Tag,
        public readonly RequestDataClass: {new (value: Request): DataClass<Request>},
        public readonly ResponseDataClass: {new (value: Response): DataClass<Response>},
        private readonly listenerFn: ListenerFn<Tag, Request, Response>,
        private readonly senderFn: SenderFn<Tag, Request, Response>,
    ) {
        this.requestGuard = (data: any): data is {[K in Tag]: {[M in RequestMethods]: Request}} => {
            const methods: RequestMethods[] = ['get', 'set'];
            return (
                typeof data === 'object'
                && data !== null
                && this.tag in data
                && methods.some(method => method in data[this.tag])
            );
        };
        this.responseGuard = (data: any): data is {[K in Tag]: {[M in ResponseMethods]: Response}} => {
            const methods: ResponseMethods[] = ['response'];
            return (
                typeof data === 'object'
                && data !== null
                && this.tag in data
                && methods.some(method => method in data[this.tag])
            );
        };
    }

    /**
     * Make get request
     */
    get(request: Request) {
        return new Promise<Response>(resolve => {
            const listener = this.listenerFn((data: {[K in Tag]: {[M in ResponseMethods]: Response}} | any) => {
                if (this.responseGuard(data)) {
                    listener();
                    resolve(data[this.tag].response);
                }
            });
            const payload: SenderData<Tag, Request, Response> = {[this.tag]: {get: request}} as SenderData<Tag, Request, Response>;
            this.senderFn(payload);
        });
    }

    /**
     * Make set request
     */
    set(request: Request) {
        const payload: SenderData<Tag, Request, Response> = {[this.tag]: {set: request}} as SenderData<Tag, Request, Response>;
        this.senderFn(payload);
    }

    /**
     * Listen to get requests
     */
    listenGet(
        makeResponseFn: (request: Request) => Response | Promise<Response>,
    ) {
        const listener = this.listenerFn((data: any) => {
            if (this.requestGuard(data) && data[this.tag].get) {
                const request = data[this.tag].get;
                const response = makeResponseFn(request);
                if (response instanceof Promise) {
                    (async () => {
                        try {
                            const payload: SenderData<Tag, Request, Response> = {[this.tag]: {response: await response}} as SenderData<Tag, Request, Response>;
                            this.senderFn(payload);
                        } catch {}
                    })();
                } else {
                    const payload: SenderData<Tag, Request, Response> = {[this.tag]: {response}} as SenderData<Tag, Request, Response>;
                    this.senderFn(payload);
                }
            }
        });
        this.listeners.push(listener);
    }

    /**
     * Listen to set requests
     */
    listenSet(
        applicationFn: (request: Request) => void,
    ) {
        const listener = this.listenerFn((data: any) => {
            if (this.requestGuard(data) && data[this.tag].set) {
                const request = data[this.tag].set;
                applicationFn(request);
            }
        });
        this.listeners.push(listener);
    }

    /**
     * Stop listening
     */
    removeListeners() {
        this.listeners.forEach(listener => listener());
        this.listeners.length = 0;
    }

}

/**
 * //
 */
export class TypedWire<
    Tag extends string,
    Request,
    Response,
> {

    constructor(
        public readonly tag: Tag,
        public readonly RequestDataClass: {new (value: Request): DataClass<Request>},
        public readonly ResponseDataClass: {new (value: Response): DataClass<Response>},
    ) {}

    /**
     * //
     */
    createEndpoint(
        listenerFn: ListenerFn<Tag, Request, Response>,
        senderFn: SenderFn<Tag, Request, Response>,
    ): TypedWireEndpoint<Tag, Request, Response> {
        return new TypedWireEndpoint(
            this.tag,
            this.RequestDataClass,
            this.ResponseDataClass,
            listenerFn,
            senderFn,
        );
    }

}

export const zoomTW = new TypedWire(
    'zoom',
    createDataClass<number>(),
    createDataClass<null>(),
);

const ee = {
    callbacks: new Set<(value: any) => void>(),
    on(cb: (value: any) => void) {
        this.callbacks.add(cb);
    },
    off(cb: (value: any) => void) {
        this.callbacks.delete(cb);
    },
    emit(value: any) {
        this.callbacks.forEach(cb => cb(value));
    },
};

export function createListenerFn<A extends string, B, C>(): ListenerFn<A, B, C> {
    return fn => {
        const callback = (value: B) => fn(value);
        ee.on(callback);
        return () => ee.off(callback);
    };
}

export function createSenderFn<A extends string, B, C>(): SenderFn<A, B, C> {
    return data => {
        ee.emit(data);
    };
}

export const hostZoomTW = zoomTW.createEndpoint(createListenerFn(), createSenderFn());

export const clientZoomTW = zoomTW.createEndpoint(createListenerFn(), createSenderFn());


