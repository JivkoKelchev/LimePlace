import {App} from "./app";

const run = async () => {
    let app = new App();
    await app.start();
};

run();
