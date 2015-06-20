///<reference path="../../typings/tsd.d.ts"/>

module pubSub {

    export enum PubSubTypes { pub, sub, push, pull }

    export interface IPubSubOpts {
        uri: string
        queue: string
        type : PubSubTypes
        onSub? : (obj: Object) => void
    }

    export interface IPubSub {
        connect(opts: IPubSubOpts) : Promise<any>
        pub(obj: Object): void
        close(): void
    }
}

exports.pubSub = pubSub;

