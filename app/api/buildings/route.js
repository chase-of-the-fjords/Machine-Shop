import { query } from '@/lib/db';

// Always revalidates data when accessed.
export const revalidate = 0;

// Gets all the data from the buildings database.
export async function GET (request) {

    // The request:
    const buildings = await query ({
        // The SQL query:
        query: "SELECT * FROM buildings WHERE end IS NULL GROUP BY code",
        values: [],
    });

    // Returns a JSON representation of the data.
    return new Response(JSON.stringify(buildings));
}