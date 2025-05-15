// example for topsecret-env module

"use strict";

// load all necessary modules
const secretEnv = require("topsecret-env");

console.log("secretEnv", secretEnv);

const config = secretEnv.loadEnvFile("./server.env");
console.debug("config", config);
