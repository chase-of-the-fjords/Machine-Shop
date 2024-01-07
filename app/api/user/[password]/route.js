import { query } from '@/lib/db';

const users = JSON.parse(process.env.SHOP_USERS)

// Creates a new machine given a machine JSON object.
export async function GET (request, { params }) {

    let password = params.password;

    for (let user of users){
        if (user.password == password) {
            return new Response(user.id)
        }
    }

    // Returns a JSON representation of the query.
    return new Response(0);
}