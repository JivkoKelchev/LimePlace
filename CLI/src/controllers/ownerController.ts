import {getSdk} from "./connectionController";
import {BACK_MENU_ITEM, FEES_MENU_ITEM, WITHDRAW_MENU_ITEM} from "../views/menu/menuItemsConstants";
import {ownerMenu} from "../views/menu/ownerMenu";
import {infoMsg} from "../views/genericUI/infoMsg";
import {homeAction} from "./homeController";

export const ownerAction = async () => {
    //render page
    const sdk = await getSdk();
    const pendingFees = await sdk.getPendingFees();
    const fees = await sdk.getFees();

    console.log('Pending fees :', pendingFees.toString());
    console.log('Fees         :', fees.toString());
    //render menu
    const selected = await ownerMenu();

    //redirect ot actions
    switch (selected.menu) {
        case WITHDRAW_MENU_ITEM: {
            await sdk.withdraw();
            await sdk.getBalance(true);
            await infoMsg('Withdraw is done.', true)
            break;
        }
        case BACK_MENU_ITEM: 
        default:{
            await homeAction();
            break;
        }
    }
}