import { envs } from "./config/envs";
import { MongoDatabase } from "./data/mongoose-db";




(async()=> {
    main();
  })();
  

  
async function main() {

    await MongoDatabase.connect({
      dbName: envs.MONGO_DB_NAME,
      mongoUrl: envs.MONGO_URL,
    })
  
    // const server = new Server({
    //   port: envs.PORT,
    //   routes: AppRoutes.routes,
    // });
  
    // server.start();
  }