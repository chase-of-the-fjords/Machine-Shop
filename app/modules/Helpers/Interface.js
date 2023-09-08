// Helper functions to deal with changes.
import { getEditedMachine } from "../Machine/DataHelper";

/**
 * Gets buildings from the SQL database and stores them in the buildings hook. 
 */
export async function getBuildings( { setBuildings } ) {

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/buildings`, postData);
        const response = await res.json();
        
        // Stores the value.
        setBuildings(response);

        // Stores the data in localStorage.
        if (typeof window !== undefined) localStorage.setItem('buildings', JSON.stringify(response));

    } catch (e) { }
    
}

/**
 * Gets machines from the SQL database and stores them in the machines hook. 
 */
export async function getMachines( { setMachines } ) {

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
        setMachines(response);

        // Stores the data in localStorage.
        if (typeof window !== undefined) localStorage.setItem('machines', JSON.stringify(response));

    } catch (e) { }
    
}

/**
 * Gets jobs from the SQL database and stores them in the jobs hook. 
 */
export async function getJobs( { setJobs } ) {

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/jobs`, postData);
        const response = await res.json();
        
        // Stores the value.
        setJobs(response);

        // Stores the data in localStorage.
        if (typeof window !== undefined) localStorage.setItem('jobs', JSON.stringify(response));

    } catch (e) { }

}

/**
 * Gets buildings from the SQL database and stores them in the buildings hook. 
 */
export async function getBuildingsMoment( { setBuildings, datetime } ) {

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/buildings/moment/${datetime}`, postData);
        const response = await res.json();
        
        // Stores the value.
        setBuildings(response);

    } catch (e) { }
    
}

/**
 * Gets machines from the SQL database and stores them in the machines hook. 
 */
export async function getMachinesMoment( { setMachines, datetime } ) {

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machines/moment/${datetime}`, postData);
        const response = await res.json();
        
        // Stores the value.
        setMachines(response);

    } catch (e) { }
    
}

/**
 * Gets jobs from the SQL database and stores them in the jobs hook. 
 */
export async function getJobsMoment( { setJobs, datetime } ) {

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/jobs/moment/${datetime}`, postData);
        const response = await res.json();
        
        // Stores the value.
        setJobs(response);

    } catch (e) { }

}

/**
 * Reloads the data from the SQL database.
 * 
 * @param {string} param - The data being updated ("buildings", "machines", "jobs", "all"). 
 */
export async function reload( param, { setBuildings, setMachines, setJobs, datetime } ) {

    // Update a specific hook.
    if (param == "buildings") await getBuildings( {setBuildings} );
    if (param == "machines") await getMachines( {setMachines} );
    if (param == "jobs") await getJobs( {setJobs} );

    // Update everything from the database.
    if (param == "all") await Promise.all([getBuildings( {setBuildings} ), getMachines( {setMachines} ), getJobs( {setJobs} )]);

    // Update everything at a given moment.
    if (param == "moment" && datetime != "") await Promise.all([getBuildingsMoment( {setBuildings, datetime} ), getMachinesMoment( {setMachines, datetime} ), getJobsMoment( {setJobs, datetime} )]);

}

/**
 * Updates the value for a given machine in the database.
 * 
 * @param {string} code - The code for the machine.
 */
export async function updateMachine( code, { machines, changes, user } ) {

    // STEP 1: Create a new, updated machine.

    let machine = machines.find((m) => {
        return m.code == code;
    });
    machine = getEditedMachine({data: machine, changes});
    machine.log = 1;
    machine.starter = user;
    machine.ender = user;

    // Sets the post-data for the machine, including its body.
    const createPostData = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            machine
        })
    }

    // Sends the actual request.
    const create_res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machines/create`, createPostData);

    // STEP 2: End the old machine.

    // Sets the post-data for the machine, including its body.
    const endPostData = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            machine
        })
    }

    // Sends the actual request.
    const end_res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machines/updateEnd`, endPostData);
}

/**
 * Deletes a given machine in the database.
 * 
 * @param {string} code - The code for the machine.
 */
export async function deleteMachine( code, { machines } ) {

    // Gets the machine
    let machine = machines.find((m) => {
        return m.code == code;
    });

    // Sets the post-data for the machine, including its body.
    const postData = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            machine
        })
    }

    // Sends the actual request.
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machines/deleteEnd`, postData);
}

/**
 * Creates a job in the database.
 * 
 * @param {number} id - The ID of the job.
 * @param {Object} job - The job being created.
 * @param {string} code - The code of the machine it's for.
 */
export async function createJob( id, job, code, { user } ) {

    // Create a new, updated job.

    job = {id: id, machine: code, op: job.op, notes: job.notes, state: job.state, starter: user, log: 0};

    // Sets the post-data for the job, including its body.
    const postData = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            job
        })
    }

    // Sends the actual request.
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/jobs/create`, postData);
}

/**
 * Updates a job in the database.
 * 
 * @param {number} id - The ID of the job.
 */
export async function updateJob( id, { jobs, changes, user } ) {

    // STEP 1: Create a new, updated job.

    let job = jobs.find((j) => {
        return j.id == id;
    });

    if (changes["jobs"][job.machine][id].op != undefined) job.op = changes["jobs"][job.machine][id].op;
    if (changes["jobs"][job.machine][id].notes != undefined) job.notes = changes["jobs"][job.machine][id].notes;
    if (changes["jobs"][job.machine][id].state != undefined) job.state = changes["jobs"][job.machine][id].state;
    if (changes["jobs"][job.machine][id].priority != undefined) job.priority = changes["jobs"][job.machine][id].priority;
    job.starter = user;
    job.ender = user;
    job.log = 1;

    // Sets the post-data for the job, including its body.
    const createPostData = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            job
        })
    }

    // Sends the actual request.
    if (job.state == 3) await fetch(`${process.env.NEXT_PUBLIC_URL}/api/jobs/create/completed`, createPostData);
    else await fetch(`${process.env.NEXT_PUBLIC_URL}/api/jobs/create`, createPostData);

    // STEP 2: End the old job.

    // Sets the post-data for the job, including its body.
    const endPostData = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            job
        })
    }

    // Sends the actual request.
    const end_res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/jobs/updateEnd`, endPostData);
}

/**
 * Deletes a job in the database.
 * 
 * @param {number} id - The ID of the job.
 */
export async function deleteJob( id, { jobs, user } ) {

    // Find the job and set its ender.

    let job = jobs.find((j) => {
        return j.id == id;
    });

    job.ender = user;

    // End the job.

    // Sets the post-data for the job, including its body.
    const postData = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            job
        })
    }

    // Sends the actual request.
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/jobs/deleteEnd`, postData);
}

/**
 * Saves all changes into the database.
 */
export async function save( { user, changes, setChanges, setBuildings, machines, setMachines, jobs, setJobs, setPopupState } ) {

    // Starts the "SAVE" popup.
    setPopupState(-1);

    // For any machines that have been updated, run the update.
    for (let [key, machine] of Object.entries(changes.machines)) {

        if (Object.entries(machine).length != 0) {

            await updateMachine(key, { machines, changes, user });

        }

    }

    // For any machines with updated jobs...
    for (let [machine, data] of Object.entries(changes.jobs)) {

        // Iterate through every job...
        for (let [key, job] of Object.entries(data)) {

            // For every job with changes...
            if (Object.entries(job).length > 0) {

                // If the job was a pre-existing job...
                if (key > 0) {

                    // Update the job if it hasn't been deleted.
                    if (!job.deleted) await updateJob(key, {jobs, changes, user});

                    // Otherwise, delete it.
                    else await deleteJob(key, {jobs, user});

                }
                
                // If the job is new, create it.
                else await createJob(key, job, machine, {user});

            }

        }

    }

    // Reload the page.
    await reload("all", { setBuildings, setMachines, setJobs });

    // Clear changes.
    setChanges({"buildings": {}, "machines": {}, "jobs": {}});

    // Close the popup.
    setPopupState(0);

}