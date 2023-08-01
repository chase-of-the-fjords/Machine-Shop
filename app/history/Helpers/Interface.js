/**
 * Gets jobs from the SQL database for a given interval.
 * 
 * @param {string} start - The starting date ('YYYY-MM-DD').
 * @param {string} end - The ending date ('YYYY-MM-DD').
 * 
 * @return All jobs for a given interval.
 */
export async function getJobsInterval(start, end) {

    // The data being passed into the API.
    const postData = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": '*',
        }
    }

    // Gets the data.
    try {

        // Accesses the jobs API.
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/jobs/${start}:${end}`, postData);
        const response = await res.json();
        
        // Stores the value.
        return response;

    } catch (e) { }

    return null;

}

/**
 * Gets machines from the SQL database for a given interval.
 * 
 * @param {string} start - The starting date ('YYYY-MM-DD').
 * @param {string} end - The ending date ('YYYY-MM-DD').
 * 
 * @return All machines for a given interval.
 */
export async function getMachinesInterval(start, end) {

    // The data being passed into the API.
    const postData = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": '*',
        }
    }

    // Gets the data.
    try {

        // Accesses the jobs API.
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machines/${start}:${end}`, postData);
        const response = await res.json();
        
        // Stores the value.
        return response;

    } catch (e) { }

    return null;

}

/**
 * Gets machines from the SQL database and stores them in the machines hook. 
 */
export async function getMachines() {

    // The data being passed into the API.
    const postData = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": '*',
        }
    }

    // Gets the data.
    try {

        // Accesses the jobs API.
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machines`, postData);
        const response = await res.json();
        
        // Stores the value.
        return response;

    } catch (e) { }
    
}

export async function getLog(start, end) {

    let jobs = await getJobsInterval(start, end);
    let machines = await getMachinesInterval(start, end);
    
    let current_machines = await getMachines();

    // Get Created Jobs

    let created_jobs = [];

    let created_job_entries = jobs.started.filter( (entry) => { return entry.log == 0 || entry.log == 2; } );

    for (let i = 0; i < created_job_entries.length; i++) {

        let job = created_job_entries[i];

        let log = {timestamp: job.start, 
                   action: 'created job', 
                   user: getUser(job.starter), 
                   machine: getMachine(job.machine, {machines: current_machines}), 
                   op: job.op, 
                   notes: job.notes, 
                   state: getJobState(job.state)};
        
        created_jobs.push(log);
        
    }

    // Get Updated Jobs

    let updated_jobs = [];

    let updated_job_entries = jobs.started.filter( (entry) => { return entry.log == 1 || entry.log == 3; } );

    for (let i = 0; i < updated_job_entries.length; i++) {

        let job = updated_job_entries[i];

        let old_versions = jobs.ended.filter( (entry) => { return entry.id == job.id && entry.start < job.start });
        let previous_version = old_versions[old_versions.length - 1];

        let log = {timestamp: job.start, 
                   action: 'updated job', 
                   user: getUser(job.starter), 
                   machine: getMachine(job.machine, {machines: current_machines}), 
                   changes: {}};
        
        if (job.op != previous_version.op) log.changes.op = {new: job.op, old: previous_version.op};
        if (job.notes != previous_version.notes) log.changes.notes = {new: job.notes, old: previous_version.notes};
        if (job.state != previous_version.state) log.changes.state = {new: getJobState(job.state), old: getJobState(previous_version.state)};
        
        updated_jobs.push(log);
        
    }

    // Get Deleted Jobs

    let deleted_jobs = [];

    let deleted_job_entries = jobs.ended.filter( (entry) => { return entry.log == 2 || entry.log == 3; } );

    for (let i = 0; i < deleted_job_entries.length; i++) {

        let job = deleted_job_entries[i];

        let log = {timestamp: job.end, 
                   action: 'deleted job', 
                   user: getUser(job.ender), 
                   machine: getMachine(job.machine, {machines: current_machines}), 
                   op: job.op, 
                   notes: job.notes, 
                   state: getJobState(job.state)};
        
        deleted_jobs.push(log);
        
    }

    // Get Updated Machines

    let updated_machines = [];

    let updated_machine_entries = machines.started.filter( (entry) => { return entry.log == 1 || entry.log == 3; } );

    for (let i = 0; i < updated_machine_entries.length; i++) {

        let machine = updated_machine_entries[i];

        let old_versions = machines.ended.filter( (entry) => { return entry.code == machine.code && entry.start < machine.start });
        let previous_version = old_versions[old_versions.length - 1];

        let log = {timestamp: machine.start, 
                   action: 'updated machine', 
                   name: machine.name,
                   user: getUser(machine.starter), 
                   changes: {}};
        
        if (machine.state != previous_version.state) log.changes.state = {new: getMachineState(machine.state), old: getMachineState(previous_version.state)};
        
        updated_machines.push(log);
        
    }

    // Merge All the Lists

    let merged_jobs = [...created_jobs, ...updated_jobs, ...deleted_jobs, ...updated_machines];

    merged_jobs = merged_jobs.sort((a, b) => { return new Date(a.timestamp) - new Date(b.timestamp) });

    // Divide by date

    let output = {};

    for (let i = 0; i < merged_jobs.length; i++) {

        let job = merged_jobs[i];

        let date = new Date(job.timestamp).toLocaleString('sv').substring(0, 10);

        if (output[date] == undefined) output[date] = [];

        output[date].push(job);

    }

    return output;

}

function getUser( id ) {

    if (id == 1) return "Kevin";
    if (id == 2) return "Chase";
    if (id == 3) return "Ernie";
    if (id == 4) return "Rocky";
    else return "N/A";

}

function getMachine( code, {machines} ) {

    return machines.find( (machine) => {return machine.code == code} ).name;

}

function getJobState( state ) {

    if (state == 0) return "Current";
    if (state == 2) return "Queued";
    else return "N/A";

}

function getMachineState( state ) {

    if (state == 0) return "Operational";
    if (state == 1) return "Out of Order";
    if (state == 2) return "Priority";
    else return "N/A";

}