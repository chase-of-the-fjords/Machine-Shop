import { query } from '@/lib/db';

// Deletes a given machine with the assumption it will be replaced with a duplicate object.
export async function PATCH (request) {
    
    // Gets the body of the request which contains a 'machine' object
    let body = await request.json();

    // The request:
    const machines = await query ({
        // The SQL query:
        query: `UPDATE machines SET end = NOW() WHERE id = '${body.machine.id}'`,
        values: [],
    })

    // Returns a JSON representation of the query.
    return new Response(JSON.stringify(machines));
}