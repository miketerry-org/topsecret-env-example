// example for topsecret-env module

// load all necessary modules
const loadEnvFile = require("../lib/loadEnvFile.js");

console.log("hello world");

const env = loadEnvFile("./server.env");
console.log("env", env);
