const express = require("express");
require("dotenv").config();

const mysql = require("mysql2");

// create the connection to database
let connection;

const exec = (sql, args) =>
  new Promise((resolve, reject) =>
    connection.execute(sql, args || [], (err, results, fields) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve({
          results,
          fields,
        });
      }
    })
  );

tryToConnect = async () => {
  let count = 0;
  while (!connection) {
    count += 1;
    try {
      console.log(`attempting connection ${count}...`);
      connection = mysql.createConnection({
        host: "database",
        user: "root",
        password: "foobar",
        // database: "test",
      });
      if (!connection) throw new Error(`no connection returned`);
      console.log(`connected; attempting to execute setup SQL`);
      await exec("CREATE DATABASE IF NOT EXISTS sosure", []);
      await exec(
        "CREATE TABLE IF NOT EXISTS sosure.phone (id INTEGER UNSIGNED NOT NULL, make VARCHAR(80) NOT NULL, model VARCHAR(80) NOT NULL, storage INTEGER UNSIGNED NOT NULL, monthly_premium DECIMAL(8,2) NOT NULL, excess INTEGER UNSIGNED NOT NULL, PRIMARY KEY (id))",
        []
      );
      await exec(
        "REPLACE INTO sosure.phone VALUES (1, 'LG', 'G6', 32, 4.49, 75), (2, 'Apple', 'iPhone 11', 128, 7.99, 125), (3, 'Samsung', 'Galaxy S10', 512, 9.99, 150)",
        []
      );
    } catch (err) {
      connection = null;
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
};

tryToConnect();

const app = express();
const port = process.env.NODE_PORT;

app.use(express.json()); // for parsing application/json

app.get("/phone/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const { results } = await exec(
      "SELECT id, make, model, storage, monthly_premium, monthly_premium * 11 AS annual_premium, excess FROM sosure.phone WHERE `id` = ?",
      [id]
    );
    if (results.length === 0) {
      res.status(404).send("not found");
    }
    res.json(results[0]);
  } catch (e) {
    res.status(500).send("an error occurred");
  }
});

app.delete("/phone/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const { results } = await exec("DELETE FROM sosure.phone WHERE `id` = ?", [
      id,
    ]);
    res.json(results);
  } catch (e) {
    res.status(500).send("an error occurred");
  }
});

const nonBlankString = (arg) => typeof arg === "string" && !!arg;

const isInteger = (arg) => typeof arg === "number" && arg % 1 === 0;

const isMaxTwoDecimalPlaces = (arg) =>
  typeof arg === "number" && parseFloat(arg.toFixed(2)) === arg;

const validate = (func, arg, msg) => {
  if (!func(arg)) throw new Error(msg);
};

app.put("/phone/:id", async (req, res) => {
  const id = req.params.id;
  try {
    validate(
      nonBlankString,
      req.body.make,
      "make must be supplied, and a non-blank string"
    );
    validate(
      nonBlankString,
      req.body.model,
      "model must be supplied, and a non-blank string"
    );
    validate(
      isInteger,
      req.body.storage,
      "storage must be supplied, a number, and an integer"
    );
    validate(
      isMaxTwoDecimalPlaces,
      req.body.monthly_premium,
      "monthly_premium must be supplied, a number, and at most 2 decimal places"
    );
    validate(
      isInteger,
      req.body.excess,
      "excess must be supplied, a number, and an integer"
    );
  } catch (e) {
    res.status(400).send(e.toString());
  }
  try {
    const { results } = await exec(
      "UPDATE sosure.phone SET make = ?, model = ?, storage = ?, monthly_premium = ?, excess = ? WHERE `id` = ?",
      [
        req.body.make,
        req.body.model,
        req.body.storage,
        req.body.monthly_premium,
        req.body.excess,
        id,
      ]
    );
    res.json(results);
  } catch (e) {
    res.status(500).send("an error occurred");
  }
});

app.get("/", (req, res) => res.send("Hello World - So-sure-itw !"));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
