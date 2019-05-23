import { PipeConnection } from "./pipe-connection";

/**
 * 
 */
export class ConnectionsManager {

    private readonly collection = new Map<string, PipeConnection<any, any, any>>();

    /**
     * 
     */
    add(connection: PipeConnection<any, any, any>) {
        this.collection.set(connection.pipe.tag, connection);
    }

    /**
     * 
     */
    addMulti(...connections: Array<PipeConnection<any, any, any>>) {
        connections.forEach(connection => this.add(connection));
    }

    /**
     * 
     */
    each(fn: (connection: PipeConnection<any, any, any>) => void) {
        this.collection.forEach((connection, key) => {
            fn(connection);
        });
    }

    /**
     * 
     */
    getByTag<T extends string>(tag: T): PipeConnection<any, any, T> | undefined {
        return this.collection.get(tag);
    }

}
