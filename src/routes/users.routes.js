import { Router } from 'express';
import userController from '../controllers/users.controller.js';
import { authenticateToken } from '../middlewares/authenticate.middleware.js';


const router = Router();

router
.route('/')
.get(userController.getUsers)
.post(userController.createUser);

router
    .route('/:id')
    .get(authenticateToken, userController.getUser)
    .put(authenticateToken, userController.updateUser)
    .delete(authenticateToken ,userController.deleteUser)
    .patch(authenticateToken ,userController.activeInactive);

router.get('/:id/tasks',authenticateToken, userController.getTasks);    
export default router;