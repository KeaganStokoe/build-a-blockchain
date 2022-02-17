const sha256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}
class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return sha256(
      this.previousHash + this.timestamp + JSON.stringify(this.transactions)
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined:" + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 0;
    this.miningReward = 100;
    this.pendingTransaction = [];
  }

  createGenesisBlock() {
    return new Block("01/01/2022", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransaction);
    block.mineBlock(this.difficulty);
    this.chain.push(block);

    this.pendingTransaction = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  createTransaction(transaction) {
    this.pendingTransaction.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      } else if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

let stokesCoin = new Blockchain();
stokesCoin.createTransaction(new Transaction("address1", "address2", 100));
stokesCoin.createTransaction(new Transaction("address2", "address1", 150));
console.log("\nStarting the miner...");
stokesCoin.minePendingTransactions("stokes-address");

console.log(
  "\nBalance of stokes-address: " +
    stokesCoin.getBalanceOfAddress("stokes-address")
);
console.log("\nStarting the miner again...");
stokesCoin.minePendingTransactions("stokes-address");
console.log(
  "\nBalance of stokes-address: " +
    stokesCoin.getBalanceOfAddress("stokes-address")
);
