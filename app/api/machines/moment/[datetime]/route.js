import { query } from '@/lib/db';

// Always revalidates data when accessed.
export const revalidate = 0;

// Gets all the data from the jobs database.
export async function GET (request, {params}) {
    
    // Format: 'YYYY-MM-DDThh:mm'
    const interval = await params.datetime;
    const date = interval.substring(0, 10);
    const time = interval.substring(11, 15) + ':00';

    // The request:
    const machines = await query ({
        // The SQL query:
        query: `SELECT * FROM machines WHERE ((start < '${date} ${time}') AND (end IS NULL OR end > '${date} ${time}')) GROUP BY code`,
        values: [],
    })

    // Returns a JSON representation of the data.
    return new Response(JSON.stringify(machines));
}