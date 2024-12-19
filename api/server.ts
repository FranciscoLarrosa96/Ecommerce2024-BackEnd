import { createServer } from '../src/app';

export default async function handler(req: any, res: any) {
  const server = await createServer();

  server(req, res); // Pasa el control de la solicitud a la instancia de Express
}
