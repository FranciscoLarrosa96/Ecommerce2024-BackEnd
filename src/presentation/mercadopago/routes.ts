
// SDK de Mercado Pago
import { Router } from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { envs } from '../../config';
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: envs.MP_ACCESS_TOKEN as string });

export class MercadoPagoRoutes {

    static get routes(): Router {
        const router = Router();

        router.post('/crear-preferencia',
            (req, res) => {
                try {
                    const body = {
                        items: [
                            {
                                id: req.body.id,
                                title: req.body.title,
                                quantity: req.body.quantity,
                                unit_price: req.body.unit_price,
                            }
                        ],
                        backs_urls: {
                            success: 'https://www.netflix.com/browse',
                            failure: 'https://www.netflix.com/browse',
                            pending: 'https://www.netflix.com/browse',
                        },
                        auth_return_url: 'approved',
                    };

                    const preference = new Preference(client);
                    preference.create({ body })
                        .then((response) => {
                            res.json({ id: response.id });
                        })
                        .catch((error) => {
                            res.json(error);
                        });

                } catch (error) {

                }

            }
        )

        return router;
    }
}

