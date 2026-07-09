const User = require("../models/userModel");
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require("../utils/catchAsync");


exports.getAllUsers = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(User.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const users = await features.query;

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});
exports.getUser = catchAsync(async (req, res,next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError('No User found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});
exports.getLoggedInUser = catchAsync(async(req,res,next)=>{
  req.params.id = req.user.id;
  next();
})



exports.updateUser = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword.',400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

