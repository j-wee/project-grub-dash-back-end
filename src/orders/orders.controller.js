const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

/*
    add handlers and middleware functions to create, read, update, delete, and list orders.
 */

function list(req, res) {
    res.json({ data: orders });
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

function validateDishes(req, res, next) {
    const { data: { dishes } = {} } = req.body;

    if (!Array.isArray(dishes) || dishes.length === 0) {
        return next({
            status: 400,
            message: `Must include dishes`
        });
    }

    for (let i = 0; i < dishes.length; i++) {
        const { quantity } = dishes[i];

        if (!quantity || (quantity <= 0) || !Number.isInteger(quantity)) {
            return next({
                status: 400,
                message: `quantity from dish ${i} must have a quantity that is an integer greater than 0`
            });
        }
    }

    next();
}

function create(req, res) {
    const {
        data: {
            deliverTo,
            mobileNumber,
            dishes
        } = {}
    } = req.body;

    const newOrder = {
        id: nextId(),
        deliverTo: deliverTo,
        mobileNumber: mobileNumber,
        dishes: dishes
    }

    orders.push(newOrder);

    res
        .status(201)
        .json({ data: newOrder });
}

function orderExists(req, res, next) {
    const { orderId } = req.params;
    const orderFound = orders.find((order) => order.id === orderId);

    if (orderFound) {
        res.locals.order = orderFound;
        return next();
    }

    next({
        status: 404,
        message: `Order id not found: ${orderId}`
    });
}

function read(req, res) {
    res.json({ data: res.locals.order });
}

function idPropertyIsValid(req, res, next) {
    const order = res.locals.order;
    const { data: { id } = {} } = req.body;

    if ((order.id === id) || (!id)) {
        return next();
    }

    next({
        status: 400,
        message: `Order id does not match route id. Order: ${id}, Route: ${order.id}`
    });
}

function statusPropertyIsValid(req, res, next) {
    const { data: { status } = {} } = req.body;
    const validStatus = ["pending", "preparing", "out-for-delivery", "delivered"];

    if (validStatus.includes(status)) {
        return next();
    }

    next({
        status: 400,
        message: `Order must have a status of ${validStatus}. Received: ${status}`
    });

}

function update(req, res) {
    const order = res.locals.order;

    const {
        data: {
            deliverTo,
            mobileNumber,
            dishes,
            status
        } = {}
    } = req.body;

    order.deliverTo = deliverTo;
    order.mobileNumber = mobileNumber;
    order.dishes = dishes;
    order.status = status;

    res.json({ data: order });
}

function readyForDeletion(req, res, next) {
    const { status } = res.locals.order;

    if (status === "pending") {
        return next();
    }

    next({
        status: 400,
        message: `An order cannot be deleted unless it is pending. Order status: ${status}`
    });
}

function remove(req, res) {
    const { orderId } = req.params;
    const index = orders.findIndex((order) => order.id === orderId);
    orders.splice(index, 1);
    res.sendStatus(204);
}

module.exports = {
   list,
    create: [
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("dishes"),
        validateDishes,
        create
    ],
    read: [
        orderExists,
        read
    ],
    update: [
        orderExists,
        idPropertyIsValid,
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("dishes"),
        bodyDataHas("status"),
        validateDishes,
        statusPropertyIsValid,
        update
    ],
    delete: [
        orderExists,
        readyForDeletion,
        remove
    ]
};