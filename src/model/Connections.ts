import { PGlite } from "@electric-sql/pglite";
import ddl from '../../create-tables.sql?raw'

let src = import.meta.env.VITE_DATABASE_URL;
const pgliteDb = await PGlite.create(src);

if(src === 'memory://'){
    db().exec(ddl);
}

//connector to db
export function db(): PGlite{
    return pgliteDb;
}