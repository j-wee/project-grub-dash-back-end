const router = require("express").Router({ mergeParams: true });
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /dishes routes needed to make the tests pass

/*
    add two routes: /dishes and /dishes/:dishId. Attach the handlers (create, read, update, and list)
    exported from src/dishes/dishes.controller.js.

 */

router.route("/")
    .get(controller.list)
    .all(methodNotAllowed);

module.exports = router;
