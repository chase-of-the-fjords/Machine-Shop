import { query } from '@/lib/db';

// Always revalidates data when accessed.
export const revalidate = 0;

// Gets all the data from the jobs database in an interval.
export async function GET (request, { params }) {
    
    // Format: 'YYYY-MM-DD:YYYY-MM-DD'
    const interval = await params.interval;
    const start_date = interval.substring(0, 10);
    const end_date = interval.substring(11, 21);

    // Gets all jobs that started in the interval.
    const jobs_started = await query ({
        // The SQL query:
        query: `SELECT entry, id, machine, op, notes, state, start, end, log, starter, ender FROM jobs WHERE (start >= '${start_date} 00:00:00') AND (start < ('${end_date} 00:00:00' + INTERVAL 1 DAY))`,
        values: [],
    });

    // Gets all jobs that ended in the interval.
    const jobs_ended = await query ({
        // The SQL query:
        query: `SELECT entry, id, machine, op, notes, state, start, end, log, starter, ender FROM jobs WHERE (end >= ('${start_date} 00:00:00' - INTERVAL 5 MINUTE)) AND (end < ('${end_date} 00:00:00' + INTERVAL 1 DAY))`,
        values: [],
    });

    // Combines both responses into one response.
    const combined_jobs = {started: jobs_started, ended: jobs_ended};

    // Returns a JSON representation of the data.
    return new Response(JSON.stringify(combined_jobs, null, 2));
}