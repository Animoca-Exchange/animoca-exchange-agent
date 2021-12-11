"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimocaAgent = void 0;
const fastify_1 = __importDefault(require("fastify"));
const fastify_cors_1 = __importDefault(require("fastify-cors"));
const fs_1 = require("fs");
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const abi_1 = require("./abi");
class AnimocaAgent {
    server;
    privateKey;
    serverAddress;
    serverPort;
    polygonRpc;
    provider;
    wallet;
    walletSigner;
    walletHandlerAddress;
    walletHandlerContract;
    constructor() {
        this.loadSettings();
        this.initChainClient();
        this.server = (0, fastify_1.default)();
        this.server.register(fastify_cors_1.default);
        this.addRoutes();
    }
    addRoutes() {
        this.server.post('/withdrawal_handler', async (request, reply) => {
            const body = request.body;
            if (Object.keys(body).length === 0) {
                // empty object body for health check only
                reply.status(200).send({ status: true, ts: Date.now() });
            }
            else {
                console.log(body);
                // TODO: add custom logic here
                // call withdraw function
                console.log(body.address, body.destinationAddress, body.tokenAmount);
                await this.withdraw(body.address, body.destinationAddress, body.tokenAmount);
                reply.status(200).send({ status: true });
            }
        });
        this.server.post('/deposit_handler', async (request, reply) => {
            const body = request.body;
            if (Object.keys(body).length === 0) {
                // empty object body for health check only
                reply.status(200).send({ status: true, ts: Date.now() });
            }
            else {
                console.log(body);
                // TODO: add custom logic here
                reply.status(200).send({ status: true });
            }
        });
    }
    async start() {
        try {
            await this.server.listen(this.serverPort, this.serverAddress);
            const address = this.server.server.address();
            const port = typeof address === 'string' ? address : address?.port;
            console.log(`Server listening on port: ${port} | address: ${this.serverAddress}`);
        }
        catch (err) {
            this.server.log.error(err);
            process.exit(1);
        }
    }
    loadSettings() {
        const configFile = (0, fs_1.readFileSync)('agent.config.json');
        let parsedConfig;
        try {
            parsedConfig = JSON.parse(configFile.toString());
        }
        catch (e) {
            console.log('Failed to parse agent.config.json:', e.message);
        }
        if (parsedConfig.port) {
            this.serverPort = parseInt(parsedConfig.port);
        }
        else {
            this.serverPort = 13007;
        }
        if (parsedConfig.walletHandlerAddress) {
            this.walletHandlerAddress = parsedConfig.walletHandlerAddress;
        }
        else {
            this.walletHandlerAddress = '0x6E93A888Ee687957D8AC3CC6cCD817445c79632D';
        }
        if (parsedConfig.serverAddress) {
            this.serverAddress = parsedConfig.serverAddress;
        }
        else {
            this.serverAddress = '127.0.0.1';
        }
        if (parsedConfig.polygonRpc) {
            this.polygonRpc = parsedConfig.polygonRpc;
        }
        else {
            this.polygonRpc = 'https://polygon-rpc.com';
        }
        if (parsedConfig.privateKey) {
            this.privateKey = parsedConfig.privateKey;
            if (!this.privateKey.startsWith('0x')) {
                this.privateKey = '0x' + this.privateKey;
            }
        }
        else {
            console.log('Private key not present!');
            process.exit(1);
        }
    }
    initChainClient() {
        this.provider = new ethers_1.providers.JsonRpcProvider(this.polygonRpc);
        this.provider.ready.then(value => {
            if (value.chainId !== 137) {
                console.log('Wrong chain!');
                process.exit(1);
            }
            this.wallet = new ethers_1.Wallet(this.privateKey);
            this.walletSigner = this.wallet.connect(this.provider);
            this.walletHandlerContract = new ethers_1.Contract(this.walletHandlerAddress, abi_1.walletHandlerABI, this.walletSigner);
        });
    }
    async withdraw(gameToken, to, amount) {
        let _amount = (0, utils_1.parseUnits)(amount, 0);
        console.log(`Withdrawing ${_amount} of ${gameToken} to wallet: ${to}`);
        const currentGasPrice = await this.provider.getGasPrice();
        const gas_price = (0, utils_1.hexlify)(currentGasPrice);
        console.log(`gas_price: ${gas_price}`);
        try {
            const transferResult = await this.walletHandlerContract.withdraw(gameToken, to, _amount, {
                gasPrice: gas_price,
                gasLimit: (0, utils_1.hexlify)(100000)
            });
            console.log(transferResult);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
}
exports.AnimocaAgent = AnimocaAgent;
