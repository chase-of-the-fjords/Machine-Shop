import { query } from '@/lib/db';

// Updates the state data for one machine in the machines database.
export async function PATCH (request) {
    
    // Gets the body of the request which contains a 'state' and 'code'
    let body = await request.json();

    // The request:
    const machines = await query ({
        // The SQL query:
        query: `UPDATE machines SET state = ${body.state} WHERE code = '${body.code}'`,
        values: [],
    })

    // Returns a JSON representation of the query.
    return new Response(JSON.stringify(machines));
}