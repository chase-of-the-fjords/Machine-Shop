import { query } from '@/lib/db';

// Deletes a given machine, setting the log value to indicate that it's been deleted.
export async function PATCH (request) {
    
    // Gets the body of the request which contains a 'machine' object
    let body = await request.json();

    // The request:
    const machines = await query ({
        // The SQL query:
        query: `UPDATE machines SET end = NOW(), log = (${body.machine.log} + 2) WHERE id = '${body.machine.id}'`,
        values: [],
    })

    // Returns a JSON representation of the query.
    return new Response(JSON.stringify(machines));
}