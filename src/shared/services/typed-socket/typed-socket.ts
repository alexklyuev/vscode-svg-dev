import { Serializable } from "./serializable.interface";


export class TypedSocket<
    Tag extends string,
    RequestStruct,
    ResponseStruct,
> {

    constructor(
        public readonly tag: Tag,
        public readonly RequestCtor: {new(val: RequestStruct): Serializable<RequestStruct>},
        public readonly ResponseCtor: {new(val: ResponseStruct): Serializable<ResponseStruct>},
    ) {}

}

export const zoomts = new TypedSocket(
    'zoom',
    class RequestDataClass {
        constructor(public val: number) {}
        serialize() {return this.val;}
    },
    class ResponseDataClass {
        constructor(public val: null) {}
        serialize() {return null;}
    },
);
