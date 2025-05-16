// tenants.js:

"use strict";

// load all necessary modules
const fs = require("fs");
const path = require("path");
const SecretEnv = require("topsecret-env");
const findFiles = require("./findFiles");

class Tenants {
  // private variables
  #list = [];
  #encryptKey;
  #schema;
  #services;

  constructor(encryptKey, services = {}, schema = []) {
    // ensure the encryption keys is defined and is the correct length
    if (encryptKey && encryptKey.length === 64) {
      this.#encryptKey = encryptKey;
    } else {
      throw new Error("Tenants.constructor requires a valid encryption key");
    }

    // assign the services object
    this.#services = services;

    // assign the schema array
    this.#schema = schema;
  }

  find(domain) {
    return this.#list.find(item => {
      return domain.toLowerCase() === item.domain.toLowerCase();
    });
  }

  loadFile(filename) {
    const config = SecretEnv.loadFromFile(
      filename,
      this.#encryptKey,
      this.#schema
    );

    // if one or more errors in schema validation
    if (config.errors.length > 0) {
      throw new Error(`${filename}: ${config.errors.join()}`);
    }

    // add the new tenant config to the array
    this.#list.push(config);
  }

  loadFiles(filemask, startDir = process.cwd()) {
    const files = findFiles(filemask, startDir);
    files.forEach(filename => {
      this.loadFile(filename);
    });
  }

  middleware(req, res, next) {
    // use the request host property to find the tenant
    let tenant = this.find(req.hostname);

    // if tenant found then attach tenant object to request and  call next middleware
    if (tenant) {
      req.tenant = tenant;
      next();
    } else {
      // if not found, then pass tenant not found error to next callback
      next(new Error(`Tenant Not Found (${req.hostname})`));
    }
  }

  get count() {
    return this.#list.length;
  }
}

module.exports = Tenants;
