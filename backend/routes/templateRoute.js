const express = require("express");
const templateController = require("../controllers/templateController");
const authController = require("../controllers/authController");
const router = express.Router();

router.use(authController.protect)

router
    .route("/")
    .get(templateController.getTemplates)
    .post(authController.restrictTo("Admin"), templateController.createTemplate)

router
    .route("/:id")
    .get(templateController.getTemplate)
    .patch(authController.restrictTo("Admin"),templateController.updatetemplate)
    .delete(authController.restrictTo("Admin"),templateController.deleteTemplate)

module.exports = router;