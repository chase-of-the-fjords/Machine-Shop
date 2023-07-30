/*
 * A set of helper functions to deal with edited Machine data.
 */



/**
 * GET EDITED MACHINE
 * 
 * Returns an edited machine object based on the "changes" object.
 * 
 * @param {Object} data - The data for the given machine.
 * @param {Object} changes - The list of changes for the machine shop.
 * 
 * @returns {Object} A modified machine object including "changes".
 */
export function getEditedMachine ({data, changes}) {

    // Copies the data object for the machine.
    let editedMachine = {...data};

    // Finds all edits on the machine directly.
    let edits = changes["machines"][data.code];

    // If there are edits to the machine:
    if (edits != undefined) {

        // Iterates through all the changes.
        for (const [key, value] of Object.entries(edits)) {

            // Updates each change's value in the editedMachine object.
            editedMachine[key] = value;

            // If the value is the state, set "newState" to true.
            if (key == 'state') editedMachine.newState = true;

            // Sets the machine to "unsaved", given that there was at least one change.
            editedMachine["unsaved"] = true;
        }

    }

    // If there were changes to the jobs on the machine:
    if (changes["jobs"][data.code] != undefined && Object.entries(changes["jobs"][data.code]).length > 0) {

        // Sets the machine to "unsaved", given that there was at least one change.
        editedMachine["unsaved"] = true;

    }

    // Returns the edited machine.
    return editedMachine;

}

/**
 * GET EDITED JOBS
 * 
 * Returns an edited jobs object based on the "changes" object.
 * 
 * @param {Object} data - The data for the given machine.
 * @param {Array} jobs - The list of jobs for the given machine.
 * @param {Object} changes - The list of changes for the machine shop.
 * 
 * @returns {Object} A list of jobs including changes.
 */
export function getEditedJobs ({data, jobs, changes}) {

    // Creates a copy of the jobs array.
    let editedJobs = JSON.parse(JSON.stringify(jobs));

    // Gets a list of changes to jobs on the machine.
    let edits = changes["jobs"][data.code];

    // If there were edits:
    if (edits != undefined) {

        // Iterate through every edit (each representing 1 job):
        for (const [key, value] of Object.entries(edits)) {

            // Checks to make sure the job has a positive key. This means it was from the SQL database.
            if (key > 0) {

                // Checks to make sure the job's change list has values to change.
                if (Object.entries(value).length > 0) {

                    // Finds the matching job in the database.
                    let match = editedJobs.find((job) => { return job.id == key });

                    // If the match was found:
                    if (match != undefined) {
                        // Set the op, notes, state, and deleted values if they were changed.
                        if (value.op != undefined) match.op = value.op;
                        if (value.notes != undefined) match.notes = value.notes;
                        if (value.state != undefined) match.state = value.state;
                        if (value.deleted == true) match.deleted = true;

                        // Mark the machine as unsaved, as it had changes listed.
                        match.unsaved = true;
                    }
                }
            }

            // Otherwise, this job is new, so create a new job object.
            else {

                // Creates the new job object.
                let newJob = {id: key, machine: data.code, op: value.op, notes: value.notes, state: value.state, new: true, unsaved: true};

                // Adds it to the list.
                editedJobs.push(newJob);

            }

        }

    }

    // Returns the list of edited jobs.
    return editedJobs;

}