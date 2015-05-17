///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/index.d.ts"/>

module lockersSpec {

    var chai = require('chai');

    var Promise = require("bluebird");
    var helpers = require("../dist/index");
    var mongojs = require("mongojs");
    var expect = chai.expect;

    beforeEach((next) => {
        var db = mongojs(process.env.MONGO_URI, ["locker"]);
        //console.log("locker.spec.ts:14>>>", db.locker);
        db["locker"].remove({}, next);
    });

    describe("locker-test", () => {

        it("lock single item many times without waiting, only first should be locked", (next) => {
            var lr = helpers.locker.connectLockerMongo({connection: process.env.MONGO_URI, collection : "locker", replicas : 1});
            var r1 = lr.lock("xxx").then(res => {
                expect(res).to.equals(true);
            });
            var r2 = lr.lock("xxx").then(res => {
                expect(res).to.equals(false);
            });
            var r3 = lr.lock("xxx").then(res => {
                expect(res).to.equals(false);
            });
            Promise.all([r1, r2, r3]).then(() => next());
        });

        it("lock single item many times with waiting, only first should be locked", (next) => {
            var lr = helpers.locker.connectLockerMongo({connection: process.env.MONGO_URI, collection : "locker", replicas : 1});
            lr.lock("xxx").then(res => {
                expect(res).to.equals(true);
                return lr.lock("xxx");
                }
            ).then(res => {
                expect(res).to.equals(false);
                return lr.lock("xxx")
                }
            ).then(res => {
                expect(res).to.equals(false);
                helpers.locker.disconnectLockerMongo(lr);
                next();
            })
        });

        it("lock different items many times without waiting", (next) => {
            var lr = helpers.locker.connectLockerMongo({connection: process.env.MONGO_URI, collection : "locker", replicas : 1});
            var r1 = lr.lock("xxx").then(res => {
                expect(res).to.equals(true);
            });
            var r2 = lr.lock("xxy").then(res => {
                expect(res).to.equals(true);
            });
            var r3 = lr.lock("xxx").then(res => {
                expect(res).to.equals(false);
            });
            Promise.all([r1, r2, r3]).then(() => next());
        });

    });
}