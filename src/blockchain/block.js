const SHA256 = require('crypto-js/sha256');
const { DIFICULTY, MINE_RATE } = require('../config');

class Block {

    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFICULTY;
    }

    toString() {
        return `Block -
            Timestamp : ${this.timestamp}
            Last Hash : ${this.lastHash.substring(0, 10)}
            Hash      : ${this.hash.substring(0, 10)}
            Nonce     : ${this.nonce}
            Difficulty: ${this.difficulty}
            Data      : ${this.data}`;
    }

    static genesis() {
        return new this('Genesis time', '-----', 'f1r57-h45h', [], 0);
    }

    static mineBlock(lastBlock, data) {
        const lastHash = lastBlock.hash;
        let nonce = 0, hash, timestamp;
        let { difficulty } = lastBlock;
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash({timestamp, lastHash, data, nonce, difficulty});
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static hash({timestamp, lastHash, data, nonce, difficulty}) {
        return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block) {
        return Block.hash(block);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        const { difficulty, timestamp } = lastBlock;
        return timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    }

}

module.exports = Block;