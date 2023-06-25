import {loadHeader, loadHomePage} from "./controllers/homeController";
import {getSdk} from "./controllers/connectionController";
import {config} from "dotenv";
import {getListings} from "./services/api";

const run = async () => {
    try {
        config();
        //load header
        loadHeader();
        //init connection
        await getSdk();
        //load main menu
        await loadHomePage();
    }catch (err) {
        //todo: implement uncached errors
        console.log(err);
    }
};

run();
