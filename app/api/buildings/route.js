import { query } from '@/lib/db';

export const revalidate = 0;
export async function GET (request) {
    const buildings = await query ({
        query: "SELECT * FROM buildings",
        values: [],
    })
    return new Response(JSON.stringify(buildings));
}