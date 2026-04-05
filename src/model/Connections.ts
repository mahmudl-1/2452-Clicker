import { PGlite } from "@electric-sql/pglite";

const pgliteDb = await PGlite.create("idb://2452-clicker");

export function db(): PGlite{
    return pgliteDb;
}