///<reference path="../../typings/tsd.d.ts"/>
var rabbit = require("rabbit.js");
var promise = require("bluebird");


module pubSub {
    
    export class PubSubRabbit implements IPubSub {

        private context:any;
        private socket:any;

        connect(opts: IPubSubOpts):Promise<any> {

            var context = rabbit.createContext(opts.uri);

            var deferred = promise.defer();

            context.on('error', deferred.reject);

            context.on('ready', () => {

                var socket = context.socket(PubSubTypes[opts.type].toUpperCase());

                socket.connect(opts.queue, (res) => {

                    if (res && res.status == "error") {
                        deferred.reject(res);
                    }
                    else {
                        this.context = context;
                        this.socket = socket;

                        if (opts.onSub) {

                            this.socket.setEncoding("utf8");

                            this.socket.on("data", (data) => {
                                var json;
                                try {
                                    json = JSON.parse(data);
                                }
                                catch (err) {
                                    console.log("Failed to parse data", data);
                                    return;
                                }
                                opts.onSub(json);
                            });
                        }

                        deferred.resolve();
                    }
                });

            });

            return deferred.promise;
        }


        pub(obj:any) {
            this.socket.write(JSON.stringify(obj), "utf8");
        }

        close() {
            this.socket.close();
            this.context.close();
        }
    }
   
}

 
