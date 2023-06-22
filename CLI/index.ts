import {loadHeader, loadHomePage} from "./controllers/homeController";
import {initConnection} from "./controllers/connectionController";

const run = async () => {
    try {
        //load header
        loadHeader();
        //init connection
        const sdk = await initConnection();
        //load main menu
        await loadHomePage(sdk);
    }catch (err) {
        console.log(err);
    }
};

run();
