export interface CreateOperator {

    create(name: string, attributes: {[K: string]: string}): any;

}
