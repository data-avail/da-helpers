///<reference path="../../typings/tsd.d.ts"/>
var mongojs = require("mongojs");
var promise = require("bluebird");
var locker;
(function (locker_1) {
    function connectLockerMongo(opts) {
        var locker = new LockerMongo(opts);
        locker.connect();
        return locker;
    }
    locker_1.connectLockerMongo = connectLockerMongo;
    function disconnectLockerMongo(locker) {
        locker.disconnect();
    }
    locker_1.disconnectLockerMongo = disconnectLockerMongo;
    var LockerMongo = (function () {
        function LockerMongo(opts) {
            this.opts = opts;
        }
        LockerMongo.prototype.connect = function () {
            this.db = mongojs(this.opts.connection, [this.opts.collection]);
            this.runCommandAsync = promise.promisify(this.db.runCommand, this.db);
        };
        LockerMongo.prototype.disconnect = function () {
            this.db.close();
        };
        LockerMongo.prototype.lock = function (id) {
            var command = {
                insert: this.opts.collection,
                documents: [{ _id: id }],
                ordered: false,
                writeConcern: { w: this.opts.replicas }
            };
            return this.runCommandAsync(command).then(function (res) { return res.ok && res.n == 1; });
        };
        return LockerMongo;
    })();
})(locker || (locker = {}));
///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../../typings/tsd.d.ts"/>
var promise = require("bluebird");
var logger;
(function (logger) {
    var LoggerCompose = (function () {
        function LoggerCompose(opts, composeOpts) {
            this.loggers = [];
            if (composeOpts.loggly)
                this.loggers.push(new logger.LoggerLoggly(opts, composeOpts.loggly));
            if (composeOpts.mongo)
                this.loggers.push(new logger.LoggerMongo(opts, composeOpts.mongo));
            if (composeOpts.console)
                this.loggers.push({ write: function (obj) { console.log("logger>>>", obj); return promise.resolve(); } });
        }
        LoggerCompose.prototype.write = function (obj) {
            return promise.all(this.loggers.map(function (m) { return m.write(obj); }));
        };
        return LoggerCompose;
    })();
    logger.LoggerCompose = LoggerCompose;
})(logger || (logger = {}));
///<reference path="../../typings/tsd.d.ts"/>
var loggly = require("loggly");
var promise = require("bluebird");
var logger;
(function (logger) {
    var LoggerLoggly = (function () {
        function LoggerLoggly(opts, logglyOpts) {
            var tags = [opts.pack.name, opts.pack.ver].concat(opts.tags).filter(function (f) { return !!f; });
            var logOpts = {
                token: logglyOpts.token,
                subdomain: logglyOpts.subdomain,
                tags: tags,
                json: true
            };
            this.loggly = promise.promisifyAll(loggly.createClient(logOpts));
        }
        LoggerLoggly.prototype.write = function (obj) {
            return this.loggly.logAsync(obj);
        };
        return LoggerLoggly;
    })();
    logger.LoggerLoggly = LoggerLoggly;
})(logger || (logger = {}));
///<reference path="../../typings/tsd.d.ts"/>
var loggly = require("loggly");
var promise = require("bluebird");
var mongojs = require("mongojs");
var logger;
(function (logger) {
    var LoggerMongo = (function () {
        function LoggerMongo(opts, mongoOpts) {
            this.tags = [opts.pack.name, opts.pack.ver].concat(opts.tags).filter(function (f) { return !!f; });
            this.db = mongojs(mongoOpts.connection, [mongoOpts.collection]);
            this.insertAsync = promise.promisify(this.db[mongoOpts.collection].insert, this.db[mongoOpts.collection]);
        }
        LoggerMongo.prototype.write = function (obj) {
            var doc = { tags: this.tags, msg: obj, date: new Date() };
            return this.insertAsync(doc);
        };
        return LoggerMongo;
    })();
    logger.LoggerMongo = LoggerMongo;
})(logger || (logger = {}));
///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../../typings/tsd.d.ts"/>
var rabbit = require("rabbit.js");
var promise = require("bluebird");
var pubSub;
(function (pubSub) {
    var PubSubRabbit = (function () {
        function PubSubRabbit() {
        }
        PubSubRabbit.prototype.connect = function (opts) {
            var _this = this;
            var context = rabbit.createContext(opts.uri);
            var deferred = promise.defer();
            context.on('error', deferred.reject);
            context.on('ready', function () {
                var socket = context.socket(pubSub.PubSubTypes[opts.type].toUpperCase());
                socket.connect(opts.queue, function (res) {
                    if (res && res.status == "error") {
                        deferred.reject(res);
                    }
                    else {
                        _this.context = context;
                        _this.socket = socket;
                        if (opts.onSub) {
                            _this.socket.setEncoding("utf8");
                            _this.socket.on("data", function (data) {
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
        };
        PubSubRabbit.prototype.pub = function (obj) {
            this.socket.write(JSON.stringify(obj), "utf8");
        };
        PubSubRabbit.prototype.close = function () {
            this.socket.close();
            this.context.close();
        };
        return PubSubRabbit;
    })();
    pubSub.PubSubRabbit = PubSubRabbit;
})(pubSub || (pubSub = {}));
///<reference path="../../typings/tsd.d.ts"/>
var pubSub;
(function (pubSub) {
    (function (PubSubTypes) {
        PubSubTypes[PubSubTypes["pub"] = 0] = "pub";
        PubSubTypes[PubSubTypes["sub"] = 1] = "sub";
        PubSubTypes[PubSubTypes["push"] = 2] = "push";
        PubSubTypes[PubSubTypes["pull"] = 3] = "pull";
    })(pubSub.PubSubTypes || (pubSub.PubSubTypes = {}));
    var PubSubTypes = pubSub.PubSubTypes;
})(pubSub || (pubSub = {}));
