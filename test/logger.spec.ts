///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/index.d.ts"/>

module loggerSpec {

    var chai = require('chai');

    var Promise = require("bluebird");
    var helpers = require("../dist/index");
    var mongojs = require("mongojs");
    var expect = chai.expect;

    beforeEach((next) => {
        var db = mongojs(process.env.MONGO_URI, ["logger"]);
        db["logger"].remove({}, next);
    });

    describe("logger-test", () => {

        it("log some data to compose logger (manual checking needed)", (next) => {
            var mongoOpts = {
                connection: process.env.MONGO_URI,
                collection: "logger"
            };
            var logglyOpts = {
                token: process.env.LOGGLY_KEY,
                subdomain: process.env.LOGGLY_SUBDOMAIN
            };
            var loggerOpts = {
                pack : {name : "logger-test", ver : "1.0.0"},
                tags : ["test"]
            };
            var logger = new helpers.logger.LoggerCompose(loggerOpts, {mongo: mongoOpts, loggly: logglyOpts, console: true});
            logger.write({msg : "This is the test message"}).then(res => next());
        });

    });
}