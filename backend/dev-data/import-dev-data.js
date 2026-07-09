const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Campaign = require('../models/campaignModel');
const Template = require('../models/templateModel');
const User = require('../models/userModel');

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DATABASE_LOCAL);

// READ JSON FILE
const template = JSON.parse(fs.readFileSync(`${__dirname}/template.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/user.json`, 'utf-8'));
const campaign = JSON.parse(fs.readFileSync(`${__dirname}/campaign.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Template.create(template);
    await User.create(users, { validateBeforeSave: false });
    await Campaign.create(campaign);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Template.deleteMany();
    await User.deleteMany();
    await Campaign.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
