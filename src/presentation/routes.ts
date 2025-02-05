import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { UserRoutes } from './user/routes';
import { MercadoPagoRoutes } from './mercadopago/routes';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/user', UserRoutes.routes);
    router.use('/api/mercadopago', MercadoPagoRoutes.routes); // Añadir las rutas de MercadoPago



    return router;
  }


}

