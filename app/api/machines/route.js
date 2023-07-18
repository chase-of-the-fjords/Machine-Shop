import { query } from '@/lib/db';

// Always revalidates data when accessed.
export const revalidate = 0;

// Gets all the data from the machines database.
export async function GET (request) {

    // The request:
    const machines = await query ({
        // The SQL query:
        query: "SELECT * FROM machines WHERE end IS NULL",
        values: [],
    });

    // Returns a JSON representation of the data.
    return new Response(JSON.stringify(machines));
}