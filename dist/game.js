"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const deck_1 = require("./deck");
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const prompt = (0, prompt_sync_1.default)();
let h = "";
let playerBalance = 100;
let playerScore = 0;
let dealerScore = 0;
let isPlayerBlackJack = false;
let isDealerBlackJack = false;
let isPlayerBust = false;
let isDealerBust = false;
let keepPlaying = "y";
let bet = 0;
const deck = new deck_1.Deck();
function makeBet() {
    console.log("Your balance: " + playerBalance);
    bet = (0, utils_1.getBet)(playerBalance);
}
function resetRound() {
    h = "";
    playerScore = 0;
    dealerScore = 0;
    isPlayerBlackJack = false;
    isDealerBlackJack = false;
    isPlayerBust = false;
    isDealerBust = false;
    bet = 0;
    (0, utils_1.resetHands)();
    deck.shuffle();
}
function initialDeal() {
    makeBet();
    (0, utils_1.dealPlayerCard)(deck);
    (0, utils_1.dealPlayerCard)(deck);
    (0, utils_1.dealDealerCard)(deck);
    (0, utils_1.dealDealerCard)(deck);
    if ((0, utils_1.evaluate)(utils_1.playerCardsDealt) == 21) {
        console.log(`Your hand: ${(0, utils_1.getStrHand)(utils_1.playerCardsDealt, 0)} (Blackjack!)`);
        console.log(`Dealer's hand: ${(0, utils_1.getStrHand)(utils_1.dealerCardsDealt, 1)} [hidden]`);
        isPlayerBlackJack = true;
    }
    else {
        console.log("Your hand: " + (0, utils_1.getStrHand)(utils_1.playerCardsDealt, 0) + "(total = " + (0, utils_1.evaluate)(utils_1.playerCardsDealt) + ")");
        console.log(`Dealer's hand: ${(0, utils_1.getStrHand)(utils_1.dealerCardsDealt, 1)}[hidden]`);
        h = (0, utils_1.HitOrStand)();
    }
}
function playerTurn() {
    while ((0, utils_1.evaluate)(utils_1.playerCardsDealt) < 21 && h !== "stand") {
        (0, utils_1.dealPlayerCard)(deck);
        console.log("Your hand: " + (0, utils_1.getStrHand)(utils_1.playerCardsDealt, 0) + "(total = " + (0, utils_1.evaluate)(utils_1.playerCardsDealt) + ")");
        if ((0, utils_1.evaluate)(utils_1.playerCardsDealt) > 21) {
            isPlayerBust = true;
            console.log("Bust!");
            break;
        }
        if ((0, utils_1.evaluate)(utils_1.playerCardsDealt) == 21) {
            break;
        }
        h = (0, utils_1.HitOrStand)();
    }
    playerScore = (0, utils_1.evaluate)(utils_1.playerCardsDealt);
    if (!isPlayerBlackJack && !isPlayerBust) {
        console.log(`Your final score is ${playerScore}. Let's see how the dealer does!`);
    }
    else if (isPlayerBlackJack) {
        console.log(`Your final score is ${playerScore}. Blackjack!`);
    }
    else {
        console.log(`Your final score is ${playerScore}.`);
    }
}
function dealerTurn() {
    console.log(`Dealer's hand: ${(0, utils_1.getStrHand)(utils_1.dealerCardsDealt, 0)}(total = ${(0, utils_1.evaluate)(utils_1.dealerCardsDealt)})`);
    if ((0, utils_1.evaluate)(utils_1.dealerCardsDealt) == 21) {
        isDealerBlackJack = true;
    }
    while (!isPlayerBust && (0, utils_1.evaluate)(utils_1.dealerCardsDealt) < 17) {
        (0, utils_1.dealDealerCard)(deck);
        console.log(`Dealer hits: ${(0, utils_1.getStrHand)(utils_1.dealerCardsDealt, 0)} (total: ${(0, utils_1.evaluate)(utils_1.dealerCardsDealt)})`);
        if ((0, utils_1.evaluate)(utils_1.dealerCardsDealt) > 21) {
            isDealerBust = true;
            console.log("Dealer busts!");
            break;
        }
    }
    dealerScore = (0, utils_1.evaluate)(utils_1.dealerCardsDealt);
}
while (playerBalance >= 0) {
    if (keepPlaying == "n") {
        break;
    }
    else if (playerBalance == 0) {
        console.log("You are out of money!");
        break;
    }
    resetRound();
    console.log("\n" + "------------------------");
    initialDeal();
    playerTurn();
    if (isPlayerBust) {
        console.log(`Dealer's hand: ${(0, utils_1.getStrHand)(utils_1.dealerCardsDealt, 0)} (total: ${(0, utils_1.evaluate)(utils_1.dealerCardsDealt)})`);
        console.log(`You bust and lose $${bet}`);
        playerBalance -= bet;
        console.log("Player funds: " + playerBalance);
        keepPlaying = prompt("Continue playing? (Y/N): ").toLowerCase();
        continue;
    }
    if (isPlayerBlackJack) {
        console.log("You win $" + bet * 1.5 + "!");
        playerBalance += bet * 1.5;
        console.log("Player funds: " + playerBalance);
        keepPlaying = prompt("Continue playing? (Y/N): ").toLowerCase();
        continue;
    }
    if (!isPlayerBust) {
        dealerTurn();
        if (isDealerBust || playerScore > dealerScore) {
            console.log(`You win $${bet}`);
            playerBalance += bet;
            console.log("Player funds: " + playerBalance);
            keepPlaying = prompt("Continue playing? (Y/N): ").toLowerCase();
            continue;
        }
        if (isDealerBlackJack && playerScore != 21) {
            console.log(`Dealer has Blackjack. You lose $${bet}`);
            playerBalance -= bet;
            console.log("Player funds: " + playerBalance);
            keepPlaying = prompt("Continue playing? (Y/N): ").toLowerCase();
            continue;
        }
        if (dealerScore > playerScore) {
            console.log(`You lose $${bet}`);
            playerBalance -= bet;
            console.log("Player funds: " + playerBalance);
            keepPlaying = prompt("Continue playing? (Y/N): ").toLowerCase();
            continue;
        }
        if (isPlayerBlackJack && isDealerBlackJack) {
            console.log("Two Blackjacks! The game is over.");
            console.log("Player funds: " + playerBalance);
            break;
        }
        if (dealerScore == playerScore) {
            console.log("It's a push! Your bet is returned.");
            console.log("Player funds: " + playerBalance);
            keepPlaying = prompt("Continue playing? (Y/N): ").toLowerCase();
            continue;
        }
    }
}
if (playerBalance > 0) {
    console.log(`Your final balanace is $${playerBalance}. Congratulations!`);
}
else {
    console.log(`Your final balanace is $${playerBalance}.`);
}
//# sourceMappingURL=game.js.map