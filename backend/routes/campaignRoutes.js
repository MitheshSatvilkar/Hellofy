const express = require("express");
const campaignController = require("../controllers/campaignController");
const authController = require("../controllers/authController");
const router = express.Router();

router.use(authController.protect)

router
    .route("/")
    .get(campaignController.getCampaigns)
    .post(campaignController.createCampaign)

router
    .route("/:id")
    .get(campaignController.getCampaign)
    .patch(campaignController.updateCampaign)
    .delete(campaignController.deleteCampaign)

router
    .route("/start/:id")
    .post(campaignController.startCampaign)


module.exports = router;