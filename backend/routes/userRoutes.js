const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController")

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(authController.protect);
router.get('/user', userController.getLoggedInUser, userController.getUser);

router
  .route('/')
  .get(authController.restrictTo("Admin"), userController.getAllUsers)

router
  .route('/:id')
  .get( authController.restrictTo("Admin"),userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);


module.exports = router;
