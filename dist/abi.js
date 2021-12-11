"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletHandlerABI = void 0;
exports.walletHandlerABI = [{
        "anonymous": false,
        "inputs": [{ "indexed": true, "internalType": "address", "name": "gameToken", "type": "address" }, {
                "indexed": true,
                "internalType": "bytes32",
                "name": "userID",
                "type": "bytes32"
            }, { "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }],
        "name": "Deposited",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }],
        "name": "OwnershipTransferred",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{ "indexed": true, "internalType": "address", "name": "gameToken", "type": "address" }, {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }],
        "name": "Withdrew",
        "type": "event"
    }, {
        "inputs": [{ "internalType": "address", "name": "_gameToken", "type": "address" }],
        "name": "add",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{ "internalType": "address", "name": "_gameToken", "type": "address" }, {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }, { "internalType": "string", "name": "_userID", "type": "string" }],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{ "internalType": "address", "name": "_gameToken", "type": "address" }, {
                "internalType": "address",
                "name": "_withdrawer",
                "type": "address"
            }, { "internalType": "bool", "name": "_isWithdrawer", "type": "bool" }],
        "name": "setWithdrawer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "whitelist",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{ "internalType": "address", "name": "_gameToken", "type": "address" }, {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "withdrawers",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    }];
