///<reference path="../../typings/tsd.d.ts"/>
var promise = require("bluebird");

module logger {

    export interface ILoggerComposeOpts {
        loggly?: ILoggerLogglyOpts
        mongo?: ILoggerMongoOpts
        console?: boolean

    }

    export class LoggerCompose implements ILogger {

        private loggers: ILogger[];

        constructor(opts: ILoggerOpts, composeOpts : ILoggerComposeOpts) {
            this.loggers = [];
            if (composeOpts.loggly)
                this.loggers.push(new LoggerLoggly(opts, composeOpts.loggly));
            if (composeOpts.mongo)
                this.loggers.push(new LoggerMongo(opts, composeOpts.mongo));
            if (composeOpts.console)
                this.loggers.push({write(obj) { console.log("logger>>>", obj); return promise.resolve(); } });
        }

        write(obj: Object) : Promise<any> {
            return promise.all(this.loggers.map(m => m.write(obj)));
        }
    }
}
