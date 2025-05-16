// example for topsecret-env module

"use strict";

// load all necessary modules
const path = require("path");
const secretEnv = require("topsecret-env");
const Tenants = require("./tenants");

const encryptKey =
  "8f04a64822422bae97f8c03fff07b2bae11168023e258030fb615f4b697a8eab";

class MyTenants extends Tenants {
  constructor() {
    // call parent constructor passing  encrypt key, services and config schema
    super(encryptKey, {}, []);

    // load all the encrypted tenant configurations
    super.loadFiles("*.secret", path.resolve("./_encrypted/tenants"));
  }
}

const tenants = new MyTenants();
console.log("tenants.count", tenants.count);

const tenant = tenants.find("test.localhost");
console.log("tenant", tenant);
