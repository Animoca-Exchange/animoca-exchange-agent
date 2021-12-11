"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agent_1 = require("./agent");
const agent = new agent_1.AnimocaAgent();
agent.start().catch(console.log);
