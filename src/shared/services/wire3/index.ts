interface Message {
    tag: string;
    method: string;
    data: any;
}

type Sender<R> = (message: Message) => Promise<R>;


function wire3<Send, Respond, T extends string>(this: void, tag: T, senderFn: Sender<Respond>, receiverFn: Function) {
    return {
        async get(data: Send): Promise<Respond> {
            const method = 'get';
            const message = { tag, method, data };
            const response = await senderFn(message);
            return response;
        },
        async set(data: Send) {
            const method = 'set';
            const message = { tag, method, data };
            senderFn(message);
        },
        async respond(data: Respond) {
            const method = 'respond';
            const message = { tag, method, data };
            receiverFn(message);
        },
        async receive() {},
    };
}
