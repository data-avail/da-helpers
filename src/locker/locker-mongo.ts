///<reference path="../../typings/tsd.d.ts"/>
module locker {

    var mongojs = require("mongojs");
    var Promise = require("bluebird");

    export interface ILockerMongoOpts {
        connection: string
        collection: string
        replicas: number
    }

    export function connectLockerMongo(opts: ILockerMongoOpts) : ILocker {
        var locker = new LockerMongo(opts);
        locker.connect();
        return locker;
    }

    export function disconnectLockerMongo(locker: ILocker) : void {
        (<LockerMongo>locker).disconnect();
    }

    class LockerMongo implements ILocker {

        constructor(private opts: ILockerMongoOpts) {
        }

        private db: any;
        private runCommandAsync: (command: any) => Promise<any>;

        connect(){
            this.db = mongojs(this.opts.connection, [this.opts.collection]);
            this.runCommandAsync = Promise.promisify(this.db.runCommand, this.db);
        }

        disconnect() : void {
            this.db.close();
        }

        lock(id: string): Promise<boolean> {

            var command = {
                insert: this.opts.collection,
                documents: [{_id: id}],
                ordered: false,
                writeConcern: {w: this.opts.replicas}
            };

            return this.runCommandAsync(command).then((res) => res.ok && res.n == 1);
        }
    }
}