const { Blockchain, Transaction } = require("./blockchain");

const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
  "cb14ef9fc1a41ab067deff321ea9de02227ba475d12a2c54d8e4878bea5d13c2"
);
const myWalletAddress = myKey.getPublic("hex");

let stokesCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, "public key goes here", 10);
tx1.signTransaction(myKey);
stokesCoin.addTransaction(tx1);

console.log("\nStarting the miner...");
stokesCoin.minePendingTransactions(myWalletAddress);


console.log("\nBalance:" + stokesCoin.getBalanceOfAddress(myWalletAddress));
