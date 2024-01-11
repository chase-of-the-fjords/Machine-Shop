import { query } from '@/lib/db';

// Always revalidates data when accessed.
export const revalidate = 0;

// Creates a new machine given a machine JSON object.
export async function POST (request) {

    // Gets the body of the request which contains a 'machine' object
    let body = await request.json();

    if (!body.completed) {

        // The request:
        const jobs = await query ({
            // The SQL query:
            query: `INSERT INTO jobs (id, machine, op, notes, state, priority, start, log, starter) 
            VALUES (${body.job.id}, '${body.job.machine}', '${body.job.op}', '${body.job.notes}', ${body.job.state}, ${body.job.priority}, CONVERT_TZ(UTC_TIMESTAMP(), "+00:00", "America/Los_Angeles"), ${body.job.log}, '${body.job.starter}')`,
            values: [],
        })

        // Returns a JSON representation of the query.
        return new Response(JSON.stringify(jobs));

    } else {

        // The request:
        const jobs = await query ({
            // The SQL query:
            query: `INSERT INTO jobs (id, machine, op, notes, state, priority, start, end, log, starter) 
            VALUES (${body.job.id}, '${body.job.machine}', '${body.job.op}', '${body.job.notes}', ${body.job.state}, ${body.job.priority}, CONVERT_TZ(UTC_TIMESTAMP(), "+00:00", "America/Los_Angeles"), CONVERT_TZ(UTC_TIMESTAMP(), "+00:00", "America/Los_Angeles") + INTERVAL 7 DAY, ${body.job.log}, '${body.job.starter}')`,
            values: [],
        })

        // Returns a JSON representation of the query.
        return new Response(JSON.stringify(jobs));

    }


}

// Gets all the data from the jobs database.
export async function GET (request) {
    
    // The request:
    const jobs = await query ({
        // The SQL query:
        query: `SELECT * FROM jobs WHERE (end IS NULL OR end > CONVERT_TZ(UTC_TIMESTAMP(), "+00:00", "America/Los_Angeles")) GROUP BY id`,
        values: [],
    })

    // Returns a JSON representation of the data.
    return new Response(JSON.stringify(jobs));
}

// Deletes a given machine with the assumption it will be replaced with a duplicate object.
export async function PATCH (request) {
    
    // Gets the body of the request which contains a 'machine' object
    let body = await request.json();

    if (body.operation == 'update') {

        // The request:
        const jobs = await query ({
            // The SQL query:
            query: `UPDATE jobs SET end = CONVERT_TZ(UTC_TIMESTAMP(), "+00:00", "America/Los_Angeles"), ender = '${body.job.ender}' WHERE entry = ${body.job.entry}`,
            values: [],
        })

        // Returns a JSON representation of the query.
        return new Response(JSON.stringify(jobs));

    } else if (body.operation == 'delete') {

        // The request:
        const jobs = await query ({
            // The SQL query:
            query: `UPDATE jobs SET end = CONVERT_TZ(UTC_TIMESTAMP(), "+00:00", "America/Los_Angeles"), ender = '${body.job.ender}', log = (${body.job.log} + 2) WHERE entry = ${body.job.entry}`,
            values: [],
        })

        // Returns a JSON representation of the query.
        return new Response(JSON.stringify(jobs));

    }

    return new Response("Invalid operation")

}