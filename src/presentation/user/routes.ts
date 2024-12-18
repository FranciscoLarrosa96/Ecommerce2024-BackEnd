import { Router } from "express";
import { UserController } from "./controller";
import { UserService } from "../services/user.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class UserRoutes {


    static get routes(): Router {

        const router = Router();
        const userSvc = new UserService();
        const controllerUser = new UserController(userSvc);

        // Definir las rutas
        // TODO:Falta agregar MIDDLEWARE que no funciona y manejar errores de token
        router.get('/' ,controllerUser.getUserById);


        return router;
    }

}