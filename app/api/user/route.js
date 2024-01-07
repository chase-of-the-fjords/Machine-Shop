import { query } from '@/lib/db';

const users = JSON.parse(process.env.SHOP_USERS)

// Creates a new machine given a machine JSON object.
export async function GET (request) {

    // Returns a JSON representation of the query.
    return new Response(0);
}