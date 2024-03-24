"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helper/check.connect");
const {
  db: { host, pass, name },
  app: { name: appName },
} = require("../configs/config.mongodb");

const connectString = `mongodb+srv://${host}:${pass}@${name}.20puzll.mongodb.net/?retryWrites=true&w=majority&appName=${appName}`;


class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString)
      .then((_) => {
        console.log("Connection Mongodb success", countConnect());
        console.log(connectString);
      })
      .catch((err) => console.log(err.message));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
