const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

/*
    add handlers and middleware functions to create, read, update, and list dishes.
    Note that dishes cannot be deleted.

 */

function list(req, res) {
    res.json({ dishes });
}

module.exports = {
    list
};