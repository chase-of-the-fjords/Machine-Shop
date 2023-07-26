import { query } from '@/lib/db';

// Always revalidates data when accessed.
export const revalidate = 0;

// Gets all the data from the jobs database.
export async function GET (request) {
    
    // The request:
    const jobs = await query ({
        // The SQL query:
        query: "SELECT * FROM jobs WHERE end IS NULL GROUP BY id",
        values: [],
    })

    // Returns a JSON representation of the data.
    return new Response(JSON.stringify(jobs));
}