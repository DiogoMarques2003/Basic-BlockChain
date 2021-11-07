const express = require('express');
const BlockChain = require('../blockchain');
const HTTP_PORT = process.env.HTTP_PORT || 3001;
const P2pServer = require('./p2p-server');

const app = express();
const blockChain = new BlockChain();
const p2pServer = new P2pServer(blockChain);

app.use(express.json());

app.get('/blocks', (req, res) => {
    res.json(blockChain.chain);
});

app.post('/mine', (req, res) => {
    const { data } = req.body;
    const block = blockChain.addBlock(data);
    console.log(`New block added: ${block.toString()}`);

    p2pServer.syncChain();

    res.redirect('/blocks');
});

app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
});
p2pServer.listen();