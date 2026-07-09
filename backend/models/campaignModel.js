const mongoose = require("mongoose");
const { default: contactSchema } = require("./contactSchema");
const analyticsSchema = require("./analyticSchema");


const campaignSchema = new mongoose.Schema(
    {
        campaignName: {
            type: String,
            required: [true, "Campaign name is required"],
            trim: true,
            minlength: [3, "Campaign name must be at least 3 characters"],
            maxlength: [100, "Campaign name cannot exceed 100 characters"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        templateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Template",
            required: [true, "TemplateID is required"],
        },
        status: {
            type: String,
            enum: ["Draft", "Processing", "Completed"],
            default: "Draft",
        },
        contacts:{
            type:[contactSchema],
            default:[]
        },
        analytics:{
            type:analyticsSchema,
            default: ()=>({})
        },
        completedAt:{
            type:Date,
        }
    },
    {
        timestamps: true
    }
)

const Campaign = mongoose.model('Campaign', campaignSchema);
module.exports= Campaign;