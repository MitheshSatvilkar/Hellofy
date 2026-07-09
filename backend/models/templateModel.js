const mongoose = require("mongoose");


const templateSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            enum: ["Onboarding", "Promotion", "Transactional"],
        },
        templateName:{
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        variables:{
            type:[String],
            default:[]
        }

    },
    {
        timestamps:true
    }
)
const Template = mongoose.model('Template', templateSchema);
module.exports = Template;