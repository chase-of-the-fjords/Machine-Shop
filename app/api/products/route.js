import { query } from '@/lib/db';

export async function GET () {
    const products = await query ({
        query: "SELECT name FROM machines",
        values: [],
    })
    return new Response(products[0]["name"]);
}