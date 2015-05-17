///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/index.d.ts"/>

module pubSubSpec {

    var chai = require('chai');

    var helpers = require("../dist/index");
    var expect = chai.expect;


    describe("pub-sub-test", () => {

        it("sub and pub event", (next) => {
            var pub = new helpers.pubSub.PubSubRabbit();
            var sub = new helpers.pubSub.PubSubRabbit();

            var pubOpts = {
                uri: process.env.RABBITMQ_URI,
                queue: "test",
                type: helpers.pubSub.PubSubTypes.pub
            };
            var subOpts = {
                uri: process.env.RABBITMQ_URI,
                queue: "test",
                type: helpers.pubSub.PubSubTypes.sub,
                onSub(res) {
                    expect(res).to.deep.equal({test : "xxx"});
                    pub.close();
                    sub.close();
                    next();
                }
            };
            pub.connect(pubOpts)
                .then(() => sub.connect(subOpts))
                .then(() => pub.pub({test: "xxx"}));

        });

    });
}