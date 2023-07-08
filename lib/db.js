import mysql from 'mysql2/promise';

export async function query({ query, values = [] }) {
    const dbconnection = await mysql.createConnection({
        host: '162.241.252.41',
        database: 'storyoj7_og_machineshop',
        user: 'storyoj7_chaseplays',
        password: 'Apr1l_2002',
    });

    try {
        const [results] = await dbconnection.execute(query, values);
        dbconnection.end();
        return results;
    } catch (error) {
        throw Error(error.message);
        return { error };
    }
}