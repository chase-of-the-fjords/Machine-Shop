import { query } from '@/lib/db';

// Creates a new machine given a machine JSON object.
export async function POST (request) {
    
    // Gets the body of the request which contains a 'machine' object
    let body = await request.json();

    // The request:
    const machines = await query ({
        // The SQL query:
        query: `INSERT INTO machines (code, name, building, width, height, xpos, ypos, state, log) 
        VALUES ('${body.machine.code}', '${body.machine.name}', '${body.machine.building}', ${body.machine.width}, ${body.machine.height}, 
        ${body.machine.xpos}, ${body.machine.ypos}, ${body.machine.state}, ${body.machine.log})`,
        values: [],
    })

    // Returns a JSON representation of the query.
    return new Response(JSON.stringify(machines));
}