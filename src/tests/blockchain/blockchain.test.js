const BlockChain = require('../../blockchain');
const Block = require('../../blockchain/block');

describe('BlockChain', () => {

    let blockChain, blockChain2;

    beforeEach(() => {
        blockChain = new BlockChain;
        blockChain2 = new BlockChain;
    });

    it('starts with genesis block', () => {
        expect(blockChain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block', () => {
        const data = 'File.pdf';
        blockChain.addBlock(data);

        expect(blockChain.chain[blockChain.chain.length - 1].data).toEqual(data);
    });

    it('validates a valid chain', () => {
        blockChain2.addBlock('500€');
        
        expect(blockChain.isValidChain(blockChain2.chain)).toBe(true);
    });

    it('invalidates a chain with a corrupt genesis block', () => {
        blockChain2.chain[0].data = 'corrupt';

        expect(blockChain.isValidChain(blockChain2.chain)).toBe(false);
    });

    it('invalidate a corrupt chain', () => {
        blockChain2.addBlock('200€');
        blockChain2.chain[1].data = 'corrupt';

        expect(blockChain.isValidChain(blockChain2.chain)).toBe(false);
    });

    it('replaces the chain with a valid chain', () => {
        blockChain2.addBlock('200€');
        blockChain.replaceChain(blockChain2.chain);

        expect(blockChain.chain).toEqual(blockChain2.chain);
    });

    it('does not replace the chain with onde of less or equal lenght', () => {
        blockChain.addBlock('200€');
        blockChain.replaceChain(blockChain2.chain);

        expect(blockChain.chain).not.toEqual(blockChain2.chain);
    });

});