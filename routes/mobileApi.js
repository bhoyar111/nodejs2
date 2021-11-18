import express from "express";
const mobileRouter = express.Router();

import authToken from '../middleware/authToken'; // Farmer token Middleware

// Routes for register and login
import loginControl from '../controllers/mobile/auth/LoginController';
mobileRouter.route('/register').post(loginControl.getRegister);
mobileRouter.route('/verify-register').post(loginControl.getVerifyRegister);
mobileRouter.route('/login').post(loginControl.getLogin);
mobileRouter.route('/verify-login').post(loginControl.getVerifyLogin);
mobileRouter.route('/logout').post(loginControl.getLogout);
mobileRouter.route('/token').post(loginControl.getToken);

// Routes for farmer
import farmerControl from '../controllers/mobile/FarmerController';
mobileRouter.route('/farmers-ds').get(authToken, farmerControl.getFarmersDS);
mobileRouter.route('/farmers-list').get(authToken, farmerControl.getFarmers);

export default mobileRouter;