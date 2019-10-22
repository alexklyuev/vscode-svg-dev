import { Pipe } from "@/common/pipe/pipe";


export type ListAttributesRequest = {};
export type ListAttributesResponse = string[];
export const listAttributesPipe = new Pipe<ListAttributesRequest, ListAttributesResponse, 'list-attributes'>('list-attributes');
