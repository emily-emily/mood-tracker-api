import { createConnection, getConnectionOptions } from "typeorm";
import { parse } from "pg-connection-string";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const connectDb = async (retries = 5) => {
  while (retries) {
    try {
      console.log("connecting to database...");
      await createConnection();
      console.log("successfully connected to database.");
      break;
    }
    catch(err) {
      console.log(err);
      retries -= 1;
      console.log(`retries left: ${retries}`);
      await new Promise(res => setTimeout(res, 3000));
    }
  }
};

export async function getDbConnectionOptions(databaseUrl?: string) {
  const options: PostgresConnectionOptions = (await getConnectionOptions()) as any;

  const url =
    databaseUrl ||
    process.env[`DATABASE_URL_${process.env.NODE_ENV}`] ||
    process.env.DATABASE_URL;

  if (!url) {
    throw new Error("Could not load database url");
  }

  const dbOptions = parse(url);

  const { host, password, user, port, database } = dbOptions;
  const overrides: any = { host, password, username: user, port, database };

  if (process.env.DB_LOGGING === "true") {
    overrides.logging = true;
  }

  return { ...options, ...overrides };
}
