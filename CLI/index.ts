import {homeAction} from "./src/controllers/homeController";
import {getSdk} from "./src/controllers/connectionController";
import {config} from "dotenv";
import {loadHeader} from "./src/views/header";

const run = async () => {
    try {
        config();
        //load header
        await loadHeader(undefined);
        //init connection
        await getSdk();
        //load main menu
        await homeAction();
    }catch (err) {
        console.log(err);
        process.exit(69)
    }
};

run();
