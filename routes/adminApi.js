import express from "express";
const adminRouter = express.Router();

import authToken from '../middleware/authToken'; // Auth token Middleware

// Routes for Login
import loginControl from '../controllers/admin/auth/LoginController';
adminRouter.route('/login').post(loginControl.getLogin);
adminRouter.route('/logout').post(loginControl.getLogout);

// Routes for User
import userControl from '../controllers/admin/UserController';
adminRouter.route('/users').get(authToken, userControl.getUsers);
adminRouter.route('/user-add').post(authToken, userControl.addUser);
adminRouter.route('/user-get/:id').get(authToken, userControl.getUser);
adminRouter.route('/user-update/:id').put(authToken, userControl.updateUser);
adminRouter.route('/user-delete/:id').delete(authToken, userControl.deleteUser);

export default adminRouter;