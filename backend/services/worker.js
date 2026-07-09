const Campaign = require("../models/campaignModel");
const {emitToUser} = require("../socket");

const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const processCampaign = async(campaign) => {
    try{
        let totalContacts = campaign.analytics.totalContacts;
        let sent = campaign.analytics.sent;
        let delivered = campaign.analytics.delivered;
        let failed = campaign.analytics.failed;

        for(let i = 0 ; i < campaign.contacts.length; i++){
            const contact = campaign.contacts[i];
            await delay(1000);
            await Campaign.updateOne(
                {_id: campaign._id},
                {
                    $inc:{
                        "analytics.sent":1,
                        "analytics.delivered":1
                    }
                },{
                    new:true
                }
            )
            sent++;
            delivered++;

            await emitToUser(campaign.user, "campaignUpdate" ,
                {
                    campaignId: campaign._id,
                    analytics:{
                        totalContacts,
                        sent,
                        delivered,
                        failed
                    }
                }
            );
            console.log("Proccessed : Count : " + sent);
            
        }

        const completedCampaign = await Campaign.updateOne(
            { _id: campaign._id },
            {
                $set: {
                    status: "Completed",
                    completedAt: new Date()
                }
            }
        );
        await emitToUser(campaign.user, "campaignCompleted", 
        {
            campaignId: campaign._id,
            status:"Completed"
        });
        console.log(campaign._id + ": Completed")
    }
    catch(err){
        console.log(err)
    }
    
}


module.exports = processCampaign;