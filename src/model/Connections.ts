import { PGlite } from "@electric-sql/pglite";
import ddl from "../../create-tables.sql?raw";

const src: string = import.meta.env.VITE_DATABASE_URL ?? "idb://candy-clicker";
const pgliteDb = await PGlite.create(src);

// every statement in the DDL is idempotent, so it's safe to run on each start
await pgliteDb.exec(ddl);

//connector to db
export function db(): PGlite {
  return pgliteDb;
}
