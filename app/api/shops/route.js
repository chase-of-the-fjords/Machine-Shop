import { query } from '@/lib/db';

const revalidate = 0;
export async function GET (request) {
    const shops = await query ({
        query: "SELECT * FROM shops",
        values: [],
    })
    return new Response(JSON.stringify(shops));
}