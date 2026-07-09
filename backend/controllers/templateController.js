const catchAsync = require("../utils/catchAsync");
const APIFeatures = require('../utils/apiFeatures');
const Template = require("../models/templateModel");

//Get All Template
exports.getTemplates = catchAsync(async(req, res, next)=>{
    const features = new APIFeatures(Template.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const template = await features.query;

    //Response
    res.status(200).json({
        status: 'success',
        results: template.length,
        data: {
            template
        }
    });

})

//Create new Template
exports.createTemplate = catchAsync(async(req, res, next)=>{
    const newTemplate = await Template.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            template: newTemplate
        }
    });
})

//Get Single Template
exports.getTemplate = catchAsync(async(req, res, next)=>{
    const template = await Template.findById(req.params.id);

    if (!template) {
        return next(new AppError('No Template found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            template
        }
    });
})

//Update Template
exports.updatetemplate = catchAsync(async(req, res, next)=>{
    const template = await Template.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!template) {
        return next(new AppError('No Template found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            template
        }
    });
})

//Delete Template
exports.deleteTemplate = catchAsync(async(req, res, next)=>{
    const template = await Template.findByIdAndDelete(req.params.id);

    if (!template) {
        return next(new AppError('No Template found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
})





