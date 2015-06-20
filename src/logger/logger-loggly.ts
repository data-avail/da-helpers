///<reference path="../../typings/tsd.d.ts"/>
var loggly = require("loggly");
var promise = require("bluebird");

module logger {

    export interface ILoggerLogglyOpts  {
        token: string
        subdomain: string
    }

    export class LoggerLoggly implements ILogger {

        private loggly: any;

        constructor(opts: ILoggerOpts, logglyOpts : ILoggerLogglyOpts) {
            var tags = [opts.pack.name, opts.pack.ver].concat(opts.tags).filter((f) => !!f);
            var logOpts = {
                token: logglyOpts.token,
                subdomain: logglyOpts.subdomain,
                tags: tags,
                json:true
            };
            this.loggly = promise.promisifyAll(loggly.createClient(logOpts));
        }

        write(obj: Object) : Promise<any> {
            return this.loggly.logAsync(obj);
        }
    }
}
