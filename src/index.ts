if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

import { IMicroService, micro } from '@artlife/micro';

//
// Application entry point.
//
export async function main(service: IMicroService): Promise<void> {

    //
    // HTTP get route.
    // Same format as Express.js. Uses Express.js under the hood.
    //
    service.rest.get("/is-alive", async (req, res) => {
        res.json({
            msg: "I am alive",
        });
    }); 

    //
    // Responds to the "a-message" message, does some work, then broadcasts a new message to the application.
    // Uses RabbitMQ under the hood.
    //
    await service.on("a-message", async (req, res) => {

        console.log("Received a message!");

        // Do some work!

        const messagePayload = { /* Data goes here. */ };
        service.emit("a-new-message", messagePayload);

        res.ack();
    });

    await service.start();
}

if (require.main === module) {
    const service = micro();
    main(service)
        .then(() => console.log("Online"))
        .catch(err => {
            console.log("Failed to start!");
            console.log(err && err.stack || err);
        })
}

