import Fastify, {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import fastifyCors from "fastify-cors";
import {readFileSync} from "fs";
import {Contract, providers, Wallet} from "ethers";
import {hexlify, parseUnits} from "ethers/lib/utils";
import {walletHandlerABI} from "./abi";

export class AnimocaAgent {
    server: FastifyInstance
    private privateKey!: string;
    private serverAddress!: string;
    private serverPort!: number;
    private polygonRpc!: string;
    private provider!: providers.JsonRpcProvider;
    private wallet!: Wallet;
    private walletSigner!: Wallet;
    private walletHandlerAddress!: string;
    private walletHandlerContract!: Contract;

    constructor() {
        this.loadSettings();
        this.initChainClient();
        this.server = Fastify();
        this.server.register(fastifyCors);
        this.addRoutes();
    }

    private addRoutes() {
        this.server.post('/withdrawal_handler', async (request: FastifyRequest, reply: FastifyReply) => {
            const body = request.body as any;
            if (Object.keys(body).length === 0) {
                // empty object body for health check only
                reply.status(200).send({status: true, ts: Date.now()});
            } else {
                console.log(body);
                // TODO: add custom logic here

                // call withdraw function
                console.log(body.address, body.destinationAddress, body.tokenAmount);

                try {
                    await this.withdraw(body.address, body.destinationAddress, body.tokenAmount);
                    reply.status(200).send({status: true});
                } catch (e: any) {
                    reply.status(400).send({status: false, error: e.message});
                }
            }
        });
        this.server.post('/deposit_handler', async (request: FastifyRequest, reply: FastifyReply) => {
            const body = request.body as any;
            if (Object.keys(body).length === 0) {
                // empty object body for health check only
                reply.status(200).send({status: true, ts: Date.now()});
            } else {
                console.log(body);
                // TODO: add custom logic here
                reply.status(200).send({status: true});
            }
        });
    }

    async start() {
        try {
            await this.server.listen(this.serverPort, this.serverAddress);
            const address = this.server.server.address();
            const port = typeof address === 'string' ? address : address?.port
            console.log(`Server listening on port: ${port} | address: ${this.serverAddress}`);
        } catch (err) {
            this.server.log.error(err);
            process.exit(1);
        }
    }

    private loadSettings() {
        const configFile = readFileSync('agent.config.json');
        let parsedConfig;
        try {
            parsedConfig = JSON.parse(configFile.toString());
        } catch (e: any) {
            console.log('Failed to parse agent.config.json:', e.message);
        }

        if (parsedConfig.port) {
            this.serverPort = parseInt(parsedConfig.port);
        } else {
            this.serverPort = 13007;
        }

        if (parsedConfig.walletHandlerAddress) {
            this.walletHandlerAddress = parsedConfig.walletHandlerAddress;
        } else {
            this.walletHandlerAddress = '0x6E93A888Ee687957D8AC3CC6cCD817445c79632D';
        }

        if (parsedConfig.serverAddress) {
            this.serverAddress = parsedConfig.serverAddress;
        } else {
            this.serverAddress = '127.0.0.1';
        }

        if (parsedConfig.polygonRpc) {
            this.polygonRpc = parsedConfig.polygonRpc;
        } else {
            this.polygonRpc = 'https://polygon-rpc.com';
        }

        if (parsedConfig.privateKey) {
            this.privateKey = parsedConfig.privateKey;
            if (!this.privateKey.startsWith('0x')) {
                this.privateKey = '0x' + this.privateKey;
            }
        } else {
            console.log('Private key not present!');
            process.exit(1);
        }
    }

    private initChainClient() {
        this.provider = new providers.JsonRpcProvider(this.polygonRpc);
        this.provider.ready.then(value => {
            if (value.chainId !== 137) {
                console.log('Wrong chain!');
                process.exit(1);
            }
            this.wallet = new Wallet(this.privateKey);
            this.walletSigner = this.wallet.connect(this.provider);
            this.walletHandlerContract = new Contract(this.walletHandlerAddress, walletHandlerABI, this.walletSigner);
        });
    }

    async withdraw(gameToken: string, to: string, amount: string) {
        let _amount = parseUnits(amount, 0);
        console.log(`Withdrawing ${_amount} of ${gameToken} to wallet: ${to}`);
        const currentGasPrice = await this.provider.getGasPrice();
        const gas_price = hexlify(currentGasPrice);
        console.log(`gas_price: ${gas_price}`)
        try {
            const transferResult = await this.walletHandlerContract.withdraw(gameToken, to, _amount, {
                gasPrice: gas_price,
                gasLimit: hexlify(100000)
            });
            console.log(transferResult);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}
