const catchAsync = require("../utils/catchAsync");
const APIFeatures = require('../utils/apiFeatures');
const Campaign = require("../models/campaignModel");
const analyticsSchema = require("../models/analyticSchema");
const processCampaign = require("../services/worker");


//Get All Campaigns
exports.getCampaigns = catchAsync(async(req, res, next)=>{
    const filter = req.user.role === "Admin"? {}: { user: req.user._id };
    const features = new APIFeatures(Campaign.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const campaign = await features.query;

    //Response
    res.status(200).json({
        status: 'success',
        results: campaign.length,
        data: {
            campaign
        }
    });

})

//Create new Campaign
exports.createCampaign = catchAsync(async(req, res, next)=>{
    const campaign = await Campaign.create({
        campaignName: req.body.campaignName,
        user:req.user._id,
        templateId:req.body.templateId,
        contacts:req.body.contacts,
        analytics:{
            totalContacts:req.body.contacts.length
        }
    })

    res.status(201).json({
        status: 'success',
        data: {
            campaign
        }
    });
})
exports.startCampaign = catchAsync(async(req,res,next)=>{
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
        return res.status(404).json({
            status:"error",
            message: "Campaign not found"
        });
    }
    campaign.status = "Processing";
    await campaign.save();

    res.status(201).json({
        status:"success",
        data:{
            campaign
        }
    })

    //Fire and forget
    processCampaign(campaign)
    .catch(err =>{
        console.error(err);
    });
})

//Get Single Campaign
exports.getCampaign = catchAsync(async(req, res, next)=>{
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
        return next(new AppError('No Campaign found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            campaign
        }
    });
})

//Update Campaign
exports.updateCampaign = catchAsync(async(req, res, next)=>{
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!campaign) {
        return next(new AppError('No Campaign found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            campaign
        }
    });
})

//Delete Campaign
exports.deleteCampaign = catchAsync(async(req, res, next)=>{
    const campaign = await Campaign.findByIdAndDelete(req.params.id);

    if (!campaign) {
        return next(new AppError('No Campaign found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
})





