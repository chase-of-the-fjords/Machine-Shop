import { query } from '@/lib/db';

// Always revalidates data when accessed.
export const revalidate = 0;

// Creates a new machine given a machine JSON object.
export async function POST (request) {
    
    // Gets the body of the request which contains a 'machine' object
    let body = await request.json();

    // The request:
    const machines = await query ({
        // The SQL query:
        query: `INSERT INTO machines (code, name, building, width, height, xpos, ypos, state, start, log, starter) 
        VALUES ('${body.machine.code}', '${body.machine.name}', '${body.machine.building}', ${body.machine.width}, ${body.machine.height}, 
        ${body.machine.xpos}, ${body.machine.ypos}, ${body.machine.state}, CONVERT_TZ(UTC_TIMESTAMP(), "+00:00", "America/Los_Angeles"), ${body.machine.log}, ${body.machine.starter})`,
        values: [],
    })

    // Returns a JSON representation of the query.
    return new Response(JSON.stringify(machines));
}

// Gets all the data from the machines database.
export async function GET (request) {

    // The request:
    const machines = await query ({
        // The SQL query:
        query: "SELECT * FROM machines WHERE end IS NULL GROUP BY code",
        values: [],
    });

    // Returns a JSON representation of the data.
    return new Response(JSON.stringify(machines));
}

// Deletes a given machine with the assumption it will be replaced with a duplicate object.
export async function PATCH (request) {
    
    // Gets the body of the request which contains a 'machine' object
    let body = await request.json();

    if (body.operation == 'update') {

        // The request:
        const machines = await query ({
            // The SQL query:
            query: `UPDATE machines SET end = CONVERT_TZ(UTC_TIMESTAMP(), "+00:00", "America/Los_Angeles"), ender = '${body.machine.ender}' WHERE id = '${body.machine.id}'`,
            values: [],
        })

        // Returns a JSON representation of the query.
        return new Response(JSON.stringify(machines));

    } else if (body.operation == 'delete') {

        // The request:
        const machines = await query ({
            // The SQL query:
            query: `UPDATE machines SET end = CONVERT_TZ(UTC_TIMESTAMP(), "+00:00", "America/Los_Angeles"), log = (${body.machine.log} + 2) WHERE id = '${body.machine.id}'`,
            values: [],
        })

        // Returns a JSON representation of the query.
        return new Response(JSON.stringify(machines));

    }

    return new Response("Invalid operation")
}