const router = require("express").Router({ mergeParams: true });
const controller = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /orders routes needed to make the tests pass

/*
    add two routes: /orders and /orders/:orderId. Attach the handlers (create, read, update, delete, and list)
    exported from src/orders/orders.controller.js.
 */

router.route("/")
    .get(controller.list)
    .all(methodNotAllowed);

module.exports = router;
