import {loadHeader, homeAction} from "./controllers/homeController";
import {getSdk} from "./controllers/connectionController";
import {config} from "dotenv";

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
        //todo: implement uncached errors
        console.log(err);
    }
};

run();
