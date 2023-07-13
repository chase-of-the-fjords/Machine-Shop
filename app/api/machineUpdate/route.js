import { query } from '@/lib/db';

export async function PATCH (request) {
    let body = await request.json();
    const machines = await query ({
        query: `UPDATE machines SET state = ${body.state} WHERE id = '${body.id}'`,
        values: [],
    })
    return new Response(JSON.stringify(machines));
}