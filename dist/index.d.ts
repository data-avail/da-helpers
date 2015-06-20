/// <reference path="../typings/tsd.d.ts" />
declare var mongojs: any;
declare var promise: any;
declare module locker {
    interface ILockerMongoOpts {
        connection: string;
        collection: string;
        replicas: number;
    }
    function connectLockerMongo(opts: ILockerMongoOpts): ILocker;
    function disconnectLockerMongo(locker: ILocker): void;
}
declare module locker {
    interface ILocker {
        /**
         * Lock entity, which means checking if some item already was locked and if so return false,
         * but if this the first lock, lock it and return true.
         * @param id
         * Lock id
         */
        lock(id: string): Promise<boolean>;
    }
}
declare var promise: any;
declare module logger {
    interface ILoggerComposeOpts {
        loggly?: ILoggerLogglyOpts;
        mongo?: ILoggerMongoOpts;
        console?: boolean;
    }
    class LoggerCompose implements ILogger {
        private loggers;
        constructor(opts: ILoggerOpts, composeOpts: ILoggerComposeOpts);
        write(obj: Object): Promise<any>;
    }
}
declare var loggly: any;
declare var promise: any;
declare module logger {
    interface ILoggerLogglyOpts {
        token: string;
        subdomain: string;
    }
    class LoggerLoggly implements ILogger {
        private loggly;
        constructor(opts: ILoggerOpts, logglyOpts: ILoggerLogglyOpts);
        write(obj: Object): Promise<any>;
    }
}
declare var loggly: any;
declare var promise: any;
declare var mongojs: any;
declare module logger {
    interface ILoggerMongoOpts {
        connection: string;
        collection: string;
    }
    class LoggerMongo implements ILogger {
        private tags;
        private db;
        private insertAsync;
        constructor(opts: ILoggerOpts, mongoOpts: ILoggerMongoOpts);
        write(obj: Object): Promise<any>;
    }
}
declare module logger {
    interface ILoggerOpts {
        pack: {
            name: string;
            ver: string;
        };
        tags: string[];
    }
    interface ILogger {
        write(obj: Object): Promise<any>;
    }
}
declare var rabbit: any;
declare var promise: any;
declare module pubSub {
    class PubSubRabbit implements IPubSub {
        private context;
        private socket;
        connect(opts: IPubSubOpts): Promise<any>;
        pub(obj: any): void;
        close(): void;
    }
}
declare module pubSub {
    enum PubSubTypes {
        pub = 0,
        sub = 1,
        push = 2,
        pull = 3,
    }
    interface IPubSubOpts {
        uri: string;
        queue: string;
        type: PubSubTypes;
        onSub?: (obj: Object) => void;
    }
    interface IPubSub {
        connect(opts: IPubSubOpts): Promise<any>;
        pub(obj: Object): void;
        close(): void;
    }
}
