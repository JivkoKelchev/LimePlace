import {homeAction} from "./src/controllers/homeController";
import {getSdk} from "./src/controllers/connectionController";
import {config} from "dotenv";
import {loadHeader} from "./src/views/header";
import chalk from "chalk";
import {AxiosError} from "axios";

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
        if(err instanceof AxiosError) {
            if(err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED') {
                console.log(chalk.red('Api connection error...'));
                process.exit(69);
            }
        }
        console.log(err);
        process.exit(69)
    }
};

run();
