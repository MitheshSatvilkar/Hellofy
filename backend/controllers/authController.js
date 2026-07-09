const User = require("../models/userModel");
const { promisify } = require('util');
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");


const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =  /^(?=(?:.*[A-Za-z]){3,})(?=(?:.*\d){2,})(?=.*[^A-Za-z0-9]).+$/; //3 letters, 2Digits, 1 Special Charater



const createSendToken = async(user, statusCode, req, res)=>{
    //Generate JWT Token
    const id = user._id;
    const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    //Send JWT Token as Cookie
    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === "https"
    })

    //Send User Details as Response
    res.status(statusCode).json({
        status:'success',
        data:{
            user
        }
    })
}

exports.signup = catchAsync(async(req,res,next)=>{
    const user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        phone:req.body.phone,
        role:req.body.role,
        active:req.body.active
    })

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
        status:"success",
        data:{
            userObj
        }
    })
})
exports.login = catchAsync(async(req,res,next)=>{
    const {email, password} = req.body;
    console.log(email,password)

    //Email,Password Exists in Request
    if (!email || !password) {
        return next(new AppError('Please provide valid email and password...', 400));
    }

    //Check if email and password are in correct format(Regex) 
    if(!emailRegex.test(email) || !passwordRegex.test(password) ){
        return next(new AppError("Email/Password: Incorrect format", 401))
    }

    //Check if User exists in Database and password Valiation
    const user = await User.findOne({email}).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    //Generate and Send JWT Token
    createSendToken(user , 200, req, res);

})
exports.protect = catchAsync(async(req, res, next)=>{
    //Check for Token from headers
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }   
    else if(req.cookies.jwt){
        token = req.cookies.jwt;
    }

    if(!token){
        return next (new AppError("Please loging to access the resources...",401));
    }

    //Token Verification
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //Check if User exists
    const user = await User.findById(decoded.id);
    if (!user) {
        return next( new AppError('The user belonging to this token does no longer exist.',401));
    }

    req.user = user;
    res.locals.user = user;
    next();

})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};





