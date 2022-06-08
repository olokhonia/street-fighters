import {showModal} from "./modal";
import {createElement} from "../../helpers/domHelper";
import {createFighterImage} from "../fighterPreview";
import App from "../../app";

export function showWinnerModal(fighter) {
    // call showModal function
    const title = `${fighter.name} is WINNER 🏆🏆🏆`;
    const winnerDetails = createElement({tagName: 'div'});
    const winnerImageElement = createFighterImage(fighter);

    winnerDetails.append(winnerImageElement);

    showModal({
        title, bodyElement: winnerDetails, onClose: () => {
            App.restartApp();
        }
    });
}
