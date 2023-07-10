import { query } from '@/lib/db';

export async function GET (request) {
    const machines = await query ({
        query: "SELECT * FROM machines",
        values: [],
    })
    return new Response(JSON.stringify(machines));
}