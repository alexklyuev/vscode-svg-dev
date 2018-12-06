export type RequestMethods = 'get' | 'set';

export type ResponseMethods = 'response';

export type Methods = RequestMethods | ResponseMethods;

export interface ListenerFn<
    Request extends {},
    Response extends {},
    Tag extends string,
> {
    (callback: (data: any) => void): () => void;
}

export interface SenderFn<
    Request extends {},
    Response extends {},
    Tag extends string,
> {
    (data: {[K in Tag]: {[M in Methods]: Request | Response}}): void;
}


/**
 * Pipe endpoint
 */
export class PipeEndpoint<
    Request extends {},
    Response extends {},
    Tag extends string,
> {

    private requestGuard: (data: any) => data is {[K in Tag]: {[M in Methods]: Request}};
    private responseGuard: (data: any) => data is {[K in Tag]: {[M in Methods]: Response}};

    private listeners = new Array<() => void>();

    constructor(
        private tag: Tag,
        private listenerFn: ListenerFn<Request, Response, Tag>,
        private senderFn: SenderFn<Request, Response, Tag>,
    ) {
        this.requestGuard = (data: any): data is {[K in Tag]: {[M in Methods]: Request}} => {
            return typeof data === 'object' && data !== null && this.tag in data;
        };
        this.responseGuard = (data: any): data is {[K in Tag]: {[M in Methods]: Response}} => {
            return typeof data === 'object' && data !== null && this.tag in data;
        };
    }

    /**
     * Make get request
     */
    makeGetRequest(request: Request) {
        return new Promise<Response>((resolve) => {
            const listener = this.listenerFn((data: {[K in Tag]: {[M in Methods]: Response}} | any) => {
                if (this.responseGuard(data)) {
                    listener();
                    resolve(data[this.tag]['response']);
                }
            });
            const payload = {[this.tag]: {get: request}} as {[K in Tag]: {[M in Methods]: Request}};
            this.senderFn(payload);
        });
    }

    /**
     * Make set request
     */
    makeSetRequest(request: Request) {
        const payload = {[this.tag]: {set: request}} as {[K in Tag]: {[M in Methods]: Request}};
        this.senderFn(payload);
    }

    /**
     * Listen to get requests
     */
    listenGetRequest<Extra>(
        preconditionFn: (request: Request) => Extra | null,
        makeResponseFn: (request: Request, extra: Extra) => Response,
    ) {
        const listener = this.listenerFn((data: any) => {
            if (this.requestGuard(data) && data[this.tag].get) {
                const request = data[this.tag].get;
                const extra = preconditionFn(request);
                if (extra) {
                    const response = makeResponseFn(request, extra);
                    const payload = {[this.tag]: {'response': response}} as {[K in Tag]: {[M in Methods]: Response}};
                    this.senderFn(payload);
                }
            }
        });
        this.listeners.push(listener);
    }

    /**
     * Listen to set requests
     */
    listenSetRequest<Extra>(
        preconditionFn: (request: Request) => Extra | null | undefined,
        applicationFn: (request: Request, extra: Extra) => void,
    ) {
        const listener = this.listenerFn((data: any) => {
            if (this.requestGuard(data) && data[this.tag].set) {
                const request = data[this.tag].set;
                const extra = preconditionFn(request);
                if (extra) {
                    applicationFn(request, extra);
                }
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
 * Pipe
 */
export class Pipe<
    Request extends {},
    Response extends {},
    Tag extends string,
> {

    constructor(
        private tag: Tag,
    ) {}

    createEndpoint(
        listenerFn: ListenerFn<Request, Response, Tag>,
        senderFn: SenderFn<Request, Response, Tag>,
    ): PipeEndpoint<Request, Response, Tag> {
        return new PipeEndpoint(this.tag, listenerFn, senderFn);
    }

    createListenerEndpoint(listenerFn: ListenerFn<Request, Response, Tag>): PipeEndpoint<Request, Response, Tag> {
        return new PipeEndpoint(this.tag, listenerFn, () => {});
    }

    createSenderEndpoint(posterFn: SenderFn<Request, Response, Tag>): PipeEndpoint<Request, Response, Tag> {
        return new PipeEndpoint(this.tag, () => () => {}, posterFn);
    }

}
