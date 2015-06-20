///<reference path="../../typings/tsd.d.ts"/>

module logger {

    export interface ILoggerOpts  {
        pack: {name : string; ver: string }
        tags : string[]
    }

    export interface ILogger {
        write(obj: Object) : Promise<any>
    }
}

exports.logger = logger;