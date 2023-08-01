import { query } from '@/lib/db';

// Always revalidates data when accessed.
export const revalidate = 0;

// Gets all the data from the machines database in an interval.
export async function GET (request, { params }) {
    
    // Format: 'YYYY-MM-DD:YYYY-MM-DD'
    const interval = await params.interval;
    const start_date = interval.substring(0, 10);
    const end_date = interval.substring(11, 21);

    // Gets all machines that started in the interval.
    const machines_started = await query ({
        // The SQL query:
        query: `SELECT * FROM machines WHERE (start >= '${start_date} 00:00:00') AND (start < ('${end_date} 00:00:00' + INTERVAL 1 DAY))`,
        values: [],
    });

    // Gets all machines that ended in the interval.
    const machines_ended = await query ({
        // The SQL query:
        query: `SELECT * FROM machines WHERE (end >= ('${start_date} 00:00:00' - INTERVAL 5 MINUTE)) AND (end < ('${end_date} 00:00:00' + INTERVAL 1 DAY))`,
        values: [],
    });

    // Combines both responses into one response.
    const combined_machines = {started: machines_started, ended: machines_ended};

    // Returns a JSON representation of the data.
    return new Response(JSON.stringify(combined_machines, null, 2));
}