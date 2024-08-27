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
    res.json({ data: dishes });
}

function bodyDataHas(propertyName) {
    return function(req, res, next) {
        const { data = {} } = req.body;

        if (data[propertyName]) {
            return next();
        }

        next({
            status: 400,
            message: `Must include a ${propertyName}`
        });
    }
}

function pricePropertyIsValid(req, res, next) {
    const { data: { price } = {} } = req.body;

    if ((price <= 0) || !Number.isInteger(price)) {
        return next({
            status: 400,
            message: `price requires a valid number`
        });
    }

    next();
}

function create(req, res) {
    const {
        data: {
            name,
            description,
            price,
            image_url
        } = {}
    } = req.body;

    const id = nextId();
    const newDish = {
        id: id,
        name: name,
        description: description,
        price: price,
        image_url: image_url
    };

    dishes.push(newDish);

    res
        .status(201)
        .json({ data: newDish });
}

function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);

    if (foundDish) {
        res.locals.dish = foundDish;
        return next();
    }

    next({
        status: 404,
        message: `Dish id not found: ${dishId}`
    });
}

function read(req, res) {
    res.json({ data: res.locals.dish });
}

function idPropertyIsValid(req, res, next) {
    const dish = res.locals.dish;
    const { data: { id } = {} } = req.body;

    if ((dish.id === id) || (!id)) {
        return next();
    }

    next({
        status: 400,
        message: `updated id ${id} does not match existing id ${dish.id}`
    });
}


function update(req, res) {
    const dish = res.locals.dish;

    const {
        data: {
            name,
            description,
            price,
            image_url
        } = {}
    } = req.body;

    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;

    res.json({ data: dish });
}

module.exports = {
    list,
    create: [
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        pricePropertyIsValid,
        create
    ],
    read: [
        dishExists,
        read
    ],
    update: [
        dishExists,
        idPropertyIsValid,
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        pricePropertyIsValid,
        update
    ]
};