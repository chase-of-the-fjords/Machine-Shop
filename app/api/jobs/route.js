import { query } from '@/lib/db';

export const revalidate = 0;
export async function GET (request) {
    const jobs = await query ({
        query: "SELECT * FROM jobs",
        values: [],
    })
    return new Response(JSON.stringify(jobs));
}