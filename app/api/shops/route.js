import { query } from '@/lib/db';

export async function GET (request) {
    const shops = await query ({
        query: "SELECT * from shops",
        values: [],
    })
    return new Response(JSON.stringify(shops));
}