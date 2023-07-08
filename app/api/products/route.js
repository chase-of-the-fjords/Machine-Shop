import { query } from '@/lib/db';

export async function GET () {
    const products = await query ({
        query: "SELECT * from machines",
        values: [],
    })
    return new Response(JSON.stringify(products, null, "\t"));
}