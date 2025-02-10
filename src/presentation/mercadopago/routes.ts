
// SDK de Mercado Pago
import { Router } from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { envs } from '../../config';
import axios from 'axios';
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: envs.MP_ACCESS_TOKEN as string });

export class MercadoPagoRoutes {

    static get routes(): Router {
        const router = Router();

        router.post('/crear-preferencia',
            (req, res) => {
                try {
                    const mappedItems = req.body.items.map((item:any) => ({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        unit_price: item.unit_price,
                        quantity: item.quantity,
                        currency_id: "ARS" // Asegurar que tenga la moneda
                    }));
                    const body = {
                        payment_methods: {
                            // Excluimos los métodos de pago que no queremos
                            excluded_payment_methods: [],
                            // Le permitimos al usuario pagar con tarjeta de crédito y efectivo
                            excluded_payment_types: [],
                            // Le permitimos al usuario pagar en cuotas
                            installments: 12,
                        },
                        items: mappedItems,
                        // shipments: {
                        //     mode: 'custom', // Usa custom en lugar de me2
                        //     cost: 5000, // Define un costo fijo de envío
                        //     receiver_address: {
                        //         zip_code: req.body.zip_code,
                        //     },
                        // },
                        backs_urls: {
                            success: 'https://franciscolarrosa96.github.io/Ecommerce/home',
                            failure: 'https://franciscolarrosa96.github.io/Ecommerce/home',
                            pending: 'https://franciscolarrosa96.github.io/Ecommerce/home',
                        }
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
        // router.post('/calcular-envio', async (req, res) => {
        //     const { codigoPostal } = req.body;
        //     try {
        //         const response = await axios.get(`https://api.mercadopago.com/shipping_options`, {
        //             params: {
        //                 zip_code: codigoPostal,
        //                 item_price: 100000, // Cambiar según el producto
        //                 dimensions: "10x10x10,500", // Dimensiones del paquete (largo, alto, ancho en cm y peso en gr)
        //             },
        //             headers: {
        //                 Authorization: `Bearer ${envs.MP_ACCESS_TOKEN}`
        //             }
        //         });

        //         const opcionesEnvio = response.data.options;
        //         if (opcionesEnvio.length > 0) {
        //             res.json({ costo: opcionesEnvio[0].cost });
        //         } else {
        //             res.json({ error: "No hay opciones de envío disponibles" });
        //         }
        //     } catch (error: any) {
        //         console.error("Error al obtener costos de envío:", error.response?.data || error.message);
        //         res.status(500).json({ error: "No se pudo calcular el costo de envío" });
        //     }
        // });

        return router;
    }
}

