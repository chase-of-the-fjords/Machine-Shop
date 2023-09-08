/**
 * CLICK MACHINE ACTION
 * 
 * Does the action for when a machine is clicked.
 * 
 * @param {string} code - The ID code of the machine.
 */
export function clickMachine( code, { type, updated, setUpdated, popupState, setPopupState, setCurrentMachine } ) {

    // Removes the "updated" notification on the machine.
    if (type != "moment") {
        let newUpdated = {...updated};
        newUpdated[code] = false;
        setUpdated(newUpdated);
    }

    // Opens the popup box in either view or edit mode.
    if (type == "view" || type == "moment") openPopup(code, 1, { setPopupState, setCurrentMachine });
    if (type == "edit") if (popupState != -1) openPopup(code, 2, { setPopupState, setCurrentMachine });

}

/**
 * SET MACHINE ACTION
 * 
 * Sets the value of a field for a machine.
 * 
 * @param {string} field - The field being edited.
 * @param {*} value - The value for the field.
 */
export function setMachine( field, value, { machines, changes, setChanges, currentMachine } ) {

    // Gets a copy of the changes to modify
    let updatedChanges = {...changes};

    // If the current machine hasn't been logged, creates an object for it.
    if (updatedChanges["machines"][currentMachine] == undefined) {
        updatedChanges["machines"][currentMachine] = {};
    }

    // Finds the SQL database value, changes list value, and intended value.
    let sqlValue = machines.find((machine) => { return machine.code == currentMachine; })[field];
    let currentValue = changes["machines"][currentMachine][field] == undefined ? sqlValue : changes["machines"][currentMachine][field];
    let intendedValue = (value == currentValue) ? 0 : value;

    // If the change matches the database, remove the key/value pair from changes. Otherwise, set it to the intended value.
    if (sqlValue == intendedValue) {

        delete updatedChanges["machines"][currentMachine][field];

    } else {

        updatedChanges["machines"][currentMachine][field] = intendedValue;

    }

    // Update the changes list to match.
    setChanges(updatedChanges);

}

/**
 * SET JOB ACTION
 * 
 * Sets a job's op and notes values.
 * 
 * @param {string} machine - The code of the machine of the job.
 * @param {number} id - The ID for the job.
 * @param {string} op - The text for the op.
 * @param {string} notes - The text for the notes. 
 */
export function setJob( machine, id, op, notes, { changes, setChanges, jobs } ) {

    // Gets a copy of the changes to modify
    let updatedChanges = {...changes};
    let sqlValue = jobs.find((job) => { return job.id == id });

    if (notes == null) notes = "";

    // If the current machine hasn't been logged, creates an object for it.
    if (updatedChanges["jobs"][machine] == undefined) {
        updatedChanges["jobs"][machine] = {};
    }

    // If the current job hasn't been logged, creates an object for it.
    if (updatedChanges["jobs"][machine][id] == undefined) {
        updatedChanges["jobs"][machine][id] = {};
    }

    // Either delete the op or update it.
    if (sqlValue != undefined && sqlValue.op == op) delete updatedChanges["jobs"][machine][id].op;
    else updatedChanges["jobs"][machine][id].op = op;

    // Either delete the notes or change them.
    if (sqlValue != undefined && sqlValue.notes == notes) delete updatedChanges["jobs"][machine][id].notes;
    else updatedChanges["jobs"][machine][id].notes = notes;

    // If the job is empty, delete it.
    if (Object.entries(updatedChanges["jobs"][machine][id]).length == 0) delete updatedChanges["jobs"][machine][id];
    else if (op == "" && notes == "") delete updatedChanges["jobs"][machine][id];

    // Update the changes list to match.
    setChanges(updatedChanges);

}

/**
 * CREATE JOB ACTION
 * 
 * Creates a job for a machine with a given op, notes, and state.
 * 
 * @param {string} machine - The code of the machine of the job.
 * @param {number} id - The ID for the job.
 * @param {string} op - The text for the op.
 * @param {string} notes - The text for the notes.
 * @param {number} state - The state of the job (0 or 2).
 * @param {number} priority - The priority of the job (0 or 1).
 */
export function createJob ( machine, id, op, notes, state, priority, { changes, setChanges } ) {

    // Gets a copy of the changes to modify
    let updatedChanges = {...changes};

    if (notes == null) notes = "";

    // If the current machine hasn't been logged, creates an object for it.
    if (updatedChanges["jobs"][machine] == undefined) {
        updatedChanges["jobs"][machine] = {};
    }

    // If the current job hasn't been logged, creates an object for it.
    updatedChanges["jobs"][machine][id] = {};
    updatedChanges["jobs"][machine][id].op = op;
    updatedChanges["jobs"][machine][id].notes = notes;
    updatedChanges["jobs"][machine][id].state = state;
    updatedChanges["jobs"][machine][id].priority = priority;

    // Update the changes list to match.
    setChanges(updatedChanges);

}

/**
 * DELETE JOB ACTION
 * 
 * Deletes a given job.
 * 
 * @param {string} machine - The code of the machine of the job.
 * @param {number} id - The ID for the job.
 */
export function deleteJob( machine, id, { changes, setChanges } ) {

    // Gets a copy of the changes to modify
    let updatedChanges = {...changes};

    // If the current machine hasn't been logged, creates an object for it.
    if (updatedChanges["jobs"][machine] == undefined)
        updatedChanges["jobs"][machine] = {};

    // If the current job hasn't been logged, creates an object for it.
    if (updatedChanges["jobs"][machine][id] == undefined)
        updatedChanges["jobs"][machine][id] = {};

    // Either remove the deleted tag (if it's true) or add it and set it to true.
    if (updatedChanges["jobs"][machine][id].deleted) delete updatedChanges["jobs"][machine][id].deleted;
    else updatedChanges["jobs"][machine][id].deleted = true;

    // If there are now no changes, remove the job from the changes list.
    if (Object.entries(updatedChanges["jobs"][machine][id]).length == 0) delete updatedChanges["jobs"][machine][id];
    else if (id < 0) delete updatedChanges["jobs"][machine][id];

    // Update the changes list to match.
    setChanges(updatedChanges);
    
}

/**
 * SET JOB STATE ACTION
 * 
 * Sets a job's state.
 * 
 * @param {string} machine - The code of the machine of the job.
 * @param {number} id - The ID for the job.
 * @param {number} state - The new state for the job.
 */
export function setJobState( machine, id, state, { changes, setChanges, jobs } ) {

    // Gets a copy of the changes to modify
    let updatedChanges = {...changes};
    let sqlValue = jobs.find((job) => { return job.id == id });

    // If the current machine hasn't been logged, creates an object for it.
    if (updatedChanges["jobs"][machine] == undefined) {
        updatedChanges["jobs"][machine] = {};
    }

    // If the current job hasn't been logged, creates an object for it.
    if (updatedChanges["jobs"][machine][id] == undefined) {
        updatedChanges["jobs"][machine][id] = {};
    }

    // If the machine is already in the database, and the new state matches it, delete that field. Otherwise, store the new value.
    if (sqlValue != undefined && sqlValue.state == state) delete updatedChanges["jobs"][machine][id].state;
    else updatedChanges["jobs"][machine][id].state = state;

    // Update the changes list to match.
    setChanges(updatedChanges);

}

/**
 * SET JOB PRIORITY ACTION
 * 
 * Sets a job's priority.
 * 
 * @param {string} machine - The code of the machine of the job.
 * @param {number} id - The ID for the job.
 * @param {number} priority - The new priority for the job.
 */
export function setJobPriority( machine, id, priority, { changes, setChanges, jobs } ) {

    // Gets a copy of the changes to modify
    let updatedChanges = {...changes};
    let sqlValue = jobs.find((job) => { return job.id == id });

    // If the current machine hasn't been logged, creates an object for it.
    if (updatedChanges["jobs"][machine] == undefined) {
        updatedChanges["jobs"][machine] = {};
    }

    // If the current job hasn't been logged, creates an object for it.
    if (updatedChanges["jobs"][machine][id] == undefined) {
        updatedChanges["jobs"][machine][id] = {};
    }

    // If the machine is already in the database, and the new priority matches it, delete that field. Otherwise, store the new value.
    if (sqlValue != undefined && sqlValue.priority == priority) delete updatedChanges["jobs"][machine][id].priority;
    else updatedChanges["jobs"][machine][id].priority = priority;

    // Update the changes list to match.
    setChanges(updatedChanges);

}

/**
 * UNDO ACTION
 * 
 * Clears all changes on a machine.
 * 
 * @param {string} machine - The code of the machine of the job.
 */
export function undo( machine, { changes, setChanges } ) {

    // Duplicates the changes list.
    let newChanges = {...changes};

    // Deletes all changes.
    delete newChanges["machines"][machine];
    delete newChanges["jobs"][machine];
    
    // Applies the changes.
    setChanges(newChanges);
}

/**
 * OPEN POPUP ACTIONS
 * 
 * Opens a popup.
 * 
 * @param {string} machine - The code of the machine (assuming view or edit).
 * @param {number} popupState - The state of the popup box.
 */
export function openPopup( machine, popupState, { setPopupState, setCurrentMachine } ) {

    // Closes the popup.
    setPopupState(popupState);
    
    // Deselects the current machine.
    setCurrentMachine(machine);

}

/**
 * CLOSE POPUP ACTIONS
 * 
 * Closes a popup.
 */
export function closePopup( { setPopupState, setCurrentMachine } ) {
    
    // Closes the popup.
    setPopupState(0);
    
    // Deselects the current machine.
    setCurrentMachine('');

}

/**
 * UNDO JOB ACTION
 * 
 * @param {string} machine - The code of the machine.
 * @param {number} id - The ID of the job.
 */
export function undoJob( machine, id, { changes, setChanges } ) {

    // Gets a copy of the changes to modify
    let updatedChanges = {...changes};

    // If the current machine hasn't been logged, creates an object for it.
    if (updatedChanges["jobs"][machine] == undefined) {
        updatedChanges["jobs"][machine] = {};
    }

    // Delete the job.
    delete updatedChanges["jobs"][machine][id];

    // Update the changes list to match.
    setChanges(updatedChanges);

}