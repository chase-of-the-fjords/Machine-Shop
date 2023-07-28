// This is an interactive component, so it's a client component.
'use client'

// Imports other modules.
import Building from './Building';
import InformationBox from './InformationBox';

// React hooks used later.
import { useEffect } from 'react';
import { useState } from 'react';

// Link from Next.JS, used to Link to edit page.
import Link from 'next/link';

// Stylesheet for the main page.
import styles from './App.module.css';
import { update } from 'react-spring';

// Default export for the machine shop.
export default function Shop( { type, machines, buildings, jobs, setMachines, setBuildings, setJobs, user, hasChanges, setHasChanges } ) {
    
    // These 3 hooks contain the queued changes for the buildings, machines, and jobs.
    const [changes, setChanges] = useState({"buildings": {}, "machines": {}, "jobs": {}});

    // Variables to track whether individual machines have been updated
    const [updated, setUpdated] = useState({"initial": true});

    // A record of the shop
    const [shopRecord, setShopRecord] = useState({"machines": {}, "immune": -1});

    const [saving, setSaving] = useState(false);

    const [view, setView] = useState(0);

    /* 
     * The current state of the popup.
     * 
     * 0: No popup selected
     * 1: Viewing machine jobs
     */
    const [popupState, setPopupState] = useState(0);
    const [currentMachine, setCurrentMachine] = useState('');

    // This gets all the data when the page loads, and then again every 30 seconds.
    useEffect(() => {
        setUpdated(localStorage.getItem('updated') ? JSON.parse(localStorage.getItem('updated')) : {"initial": false});
        setShopRecord({"machines": {}, "immune": (localStorage.getItem('new') ? 1 : 3)});
        setBuildings(localStorage.getItem('buildings') ? JSON.parse(localStorage.getItem('buildings')) : []);
        setMachines(localStorage.getItem('machines') ? JSON.parse(localStorage.getItem('machines')) : []);
        setJobs(localStorage.getItem('jobs') ? JSON.parse(localStorage.getItem('jobs')) : []);
        setView(localStorage.getItem('view') ? JSON.parse(localStorage.getItem('view')) : 0);
        localStorage.setItem('new', true);
        reload("all");

        const interval = setInterval(() => {
            reload("all");
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!updated.initial) localStorage.setItem('updated', JSON.stringify(updated));
    }, [updated])

    useEffect(() => {

        if (!updated.initial) {

            let newShop = {"machines": {}, "immune": shopRecord.immune}
            let newUpdated = {...updated};

            machines.forEach(machine => {
                newShop["machines"][machine.code] = {};
                newShop["machines"][machine.code].id = machine.id;
                newShop["machines"][machine.code].jobs = jobs.filter((job) => { return job.machine == machine.code; }).map((job) => { return job.entry });
                newShop["machines"][machine.code].jobs.sort();
                if (shopRecord.immune == 0) {
                    if (shopRecord["machines"][machine.code] == undefined) {
                        newUpdated[machine.code] = true;
                    }
                    else if (JSON.stringify(shopRecord["machines"][machine.code].jobs) != JSON.stringify(newShop["machines"][machine.code].jobs)) {
                        newUpdated[machine.code] = true;
                    }
                    else if (shopRecord["machines"][machine.code].id != machine.id) {
                        newUpdated[machine.code] = true;
                    }
                }
            });

            setUpdated(newUpdated);

            if (shopRecord.immune != 0) newShop.immune = newShop.immune - 1;

            setShopRecord(newShop);

        }

    }, [machines, jobs]);

    useEffect(() => {
        let hasChanges = false;
        Object.entries(changes["machines"]).forEach(([key, value]) => {
            if (Object.entries(value).length > 0) hasChanges = true;
        });
        Object.entries(changes["jobs"]).forEach(([key, value]) => {
            if (Object.entries(value).length > 0) hasChanges = true;
        });
        if (type == "edit") setHasChanges(hasChanges);
    }, [changes])

    // A joint function to get all the necessary SQL data.
    async function reload( param ) {
        if (param == "buildings") await getBuildings();
        if (param == "machines") await getMachines();
        if (param == "jobs") await getJobs();
        if (param == "all") {
            await Promise.all([getBuildings(), getMachines(), getJobs()]);
        }
    }

    // Gets the shops to populate the "buildings" hook.
    async function getBuildings() {
        const postData = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*',
            }
        }
        try {
            // Accesses the buildings API.
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/buildings`, postData);
            const response = await res.json();
            // Sets the value of "buildings".
            setBuildings(response);
            if (typeof window !== undefined) localStorage.setItem('buildings', JSON.stringify(response));
        } catch (e) { }
    }

    // Gets the machines to populate the "machines" hook.
    async function getMachines() {
        const postData = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*',
            }
        }
        try {
            // Accesses the machines API.
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machines`, postData);
            const response = await res.json();
            // Sets the value of "machines".
            setMachines(response);
            if (typeof window !== undefined) localStorage.setItem('machines', JSON.stringify(response));
        } catch (e) { }
    }

    // Gets the jobs to populate the "jobs" hook.
    async function getJobs() {
        const postData = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*',
            }
        }
        try {
            // Accesses the jobs API.
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/jobs`, postData);
            const response = await res.json();
            // Sets the value of "jobs".
            setJobs(response);
            if (typeof window !== undefined) localStorage.setItem('jobs', JSON.stringify(response));
        } catch (e) { }
    }

    // Opens the popup box, sets its state, & sets the selected machine.
    function openPopup(code, state) {
        setPopupState(state);
        setCurrentMachine(code);
    }

    // Closes the popup box and deselects the selected machine.
    function closePopup() {
        setPopupState(0);
        setCurrentMachine('');
    }

    // TODO
    async function save() {
        setSaving(true);
        setPopupState(-1);
        for (let [key, machine] of Object.entries(changes.machines)) {
            if (Object.entries(machine).length != 0) {
                await updateMachine(key);
            }
        }
        for (let [machine, data] of Object.entries(changes.jobs)) {
            for (let [key, job] of Object.entries(data)) {
                if (Object.entries(job).length > 0) {
                    if (key > 0) {
                        if (!job.deleted) {
                            await updateJob(key);
                        }
                        else await deleteJob(key);
                    } else {
                        await createJob(key, job, machine);
                    }
                }
            }
        }
        await reload("all");
        setChanges({"buildings": {}, "machines": {}, "jobs": {}});
        setSaving(false);
        setPopupState(0);
    }

    /* 
     * Updates values for a given machine. 2 steps:
     *  1. Delete the old entry for the machine by setting an end-time.
     *  2. Create a duplicate starting at the current moment with changes.
     * 
     * code: The code for the machine (i.e. H8, OB, ma).
     */
    async function updateMachine(code) {

        // STEP 1: Create a new, updated machine.

        let machine = machines.find((m) => {
            return m.code == code;
        });
        machine = getEditedMachine({machine, changes});
        machine.starter = user;
        machine.ender = user;

        // Sets the post-data for the machine, including its body.
        const postData1 = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                machine
            })
        }

        // Sends the actual request.
        const res1 = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machines/create`, postData1);

        // STEP 2: End the old machine.

        // Sets the post-data for the machine, including its body.
        const postData2 = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                machine
            })
        }

        // Sends the actual request.
        const res2 = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machines/updateEnd`, postData2);
    }

    /* 
     * Updates values for a given machine. 2 steps:
     *  1. Delete the old entry for the machine by setting an end-time.
     *  2. Create a duplicate starting at the current moment with changes.
     * 
     * code: The code for the machine (i.e. H8, OB, ma).
     */
    async function updateJob(id) {

        // STEP 1: Create a new, updated job.

        let job = jobs.find((j) => {
            return j.id == id;
        });

        if (changes["jobs"][job.machine][id].op != undefined) job.op = changes["jobs"][job.machine][id].op;
        if (changes["jobs"][job.machine][id].notes != undefined) job.notes = changes["jobs"][job.machine][id].notes;
        if (changes["jobs"][job.machine][id].state != undefined) job.state = changes["jobs"][job.machine][id].state;
        job.starter = user;
        job.ender = user;
        job.log = 1;

        // Sets the post-data for the machine, including its body.
        const postData1 = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                job
            })
        }

        // Sends the actual request.
        const res1 = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/jobs/create`, postData1);

        // STEP 2: End the old machine.

        // Sets the post-data for the machine, including its body.
        const postData2 = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                job
            })
        }

        // Sends the actual request.
        const res2 = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/jobs/updateEnd`, postData2);
    }

    /* 
     * Updates values for a given machine. 2 steps:
     *  1. Delete the old entry for the machine by setting an end-time.
     *  2. Create a duplicate starting at the current moment with changes.
     * 
     * code: The code for the machine (i.e. H8, OB, ma).
     */
    async function deleteJob(id) {

        let job = jobs.find((j) => {
            return j.id == id;
        });

        if (changes["jobs"][job.machine][id].op != undefined) job.op = changes["jobs"][job.machine][id].op;
        if (changes["jobs"][job.machine][id].notes != undefined) job.notes = changes["jobs"][job.machine][id].notes;
        if (changes["jobs"][job.machine][id].state != undefined) job.state = changes["jobs"][job.machine][id].state;
        job.ender = user;

        // End the job.

        // Sets the post-data for the machine, including its body.
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

    /* 
     * Updates values for a given machine. 2 steps:
     *  1. Delete the old entry for the machine by setting an end-time.
     *  2. Create a duplicate starting at the current moment with changes.
     * 
     * code: The code for the machine (i.e. H8, OB, ma).
     */
    async function createJob(id, job, machine) {

        // STEP 1: Create a new, updated job.

        job = {id: id, machine: machine, op: job.op, notes: job.notes, state: job.state, starter: user, log: 0};

        // Sets the post-data for the machine, including its body.
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

    /*
    * Given a list of changes, returns modified data for the machine.
    */
    function getEditedMachine ({machine, changes}) {
        let editedMachine = {...machine};
        let edits = changes["machines"][machine.code];
        if (edits != undefined) {
            for (const [key, value] of Object.entries(edits)) {
                editedMachine[key] = value;
            }
        }
        return editedMachine;
    }

    /* 
     * Deletes entry for a given machine.
     * 
     * code: The code for the machine (i.e. H8, OB, ma).
     */
    async function deleteMachine(code) {

        // Gets the machine
        let machine = machines.find((m) => {
            return m.code == code;
        });

        // Sets the post-data for the machine, including its body.
        const postData1 = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                machine
            })
        }

        // Sends the actual request.
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machines/deleteEnd`, postData1);

        // Refreshes the JSON data for the page from the database.
        doAction("reload", ["machines"]);
    }

    /* 
     * Does an action, mostly tied to other functions. To be passed into child components.
     * 
     * action: The action being performed (i.e. "reload", "save", etc.)
     * params: An array of parameters to be passed in.
     */
    function doAction(action, params) {
        /* 
         * Reloads data from the SQL database.
         * param[0]: The table being reloaded: "machines", "shops", "jobs", "all".
         */
        if (action == "reload") reload(params[0]);

        /* 
         * The effect when a machine is clicked.
         * param[0]: The code of the machine.
         */
        if (action == "clickMachine") {
            // Different effects on the "view" and "edit" pages.
            let newUpdated = {...updated};
            newUpdated[params[0]] = false;
            setUpdated(newUpdated);
            if (type == "view") openPopup(params[0], 1);
            if (type == "edit") if (!saving) openPopup(params[0], 2);
        }

        /* 
         * Sets the value of something in the current machine.
         * 
         */
        if (action == "setMachine") {

            // Gets a copy of the changes to modify
            let updatedChanges = {...changes};

            // If the current machine hasn't been logged, creates an object for it.
            if (updatedChanges["machines"][currentMachine] == undefined) {
                updatedChanges["machines"][currentMachine] = {};
            }

            // Finds the SQL database value, changes list value, and intended value.
            let sqlValue = machines.find((machine) => { return machine.code == currentMachine; })[params[0]];
            let currentValue = changes["machines"][currentMachine][params[0]] == undefined ? sqlValue : changes["machines"][currentMachine][params[0]];
            let intendedValue = (params[1] == currentValue) ? 0 : params[1];

            // If the change matches the database, remove the key/value pair from changes. Otherwise, set it to the intended value.
            if (sqlValue == intendedValue) {

                delete updatedChanges["machines"][currentMachine][params[0]];

            } else {

                updatedChanges["machines"][currentMachine][params[0]] = intendedValue;

            }

            // Update the changes list to match.
            setChanges(updatedChanges);

        }

        /* 
         * Sets the value of something in a given job.
         * 
         * params[0]: machine code
         * params[1]: job ID
         * params[2]: op
         * params[3]: notes
         */
        if (action == "setJob") {

            // Gets a copy of the changes to modify
            let updatedChanges = {...changes};
            let sqlValue = jobs.find((job) => { return job.id == params[1] });

            if (params[3] == null) params[3] = "";

            // If the current machine hasn't been logged, creates an object for it.
            if (updatedChanges["jobs"][params[0]] == undefined) {
                updatedChanges["jobs"][params[0]] = {};
            }

            // If the current job hasn't been logged, creates an object for it.
            if (updatedChanges["jobs"][params[0]][params[1]] == undefined) {
                updatedChanges["jobs"][params[0]][params[1]] = {};
            }

            // Either delete the op or update it.
            if (sqlValue != undefined && sqlValue.op == params[2]) delete updatedChanges["jobs"][params[0]][params[1]].op;
            else updatedChanges["jobs"][params[0]][params[1]].op = params[2];

            // Either delete the notes or change them.
            if (sqlValue != undefined && sqlValue.notes == params[3]) delete updatedChanges["jobs"][params[0]][params[1]].notes;
            else updatedChanges["jobs"][params[0]][params[1]].notes = params[3];

            // If the job is empty, delete it.
            if (Object.entries(updatedChanges["jobs"][params[0]][params[1]]).length == 0) delete updatedChanges["jobs"][params[0]][params[1]];
            else if (params[2] == "" && params[3] == "") delete updatedChanges["jobs"][params[0]][params[1]];

            // Update the changes list to match.
            setChanges(updatedChanges);

        }

        /* 
         * Sets the value of something in a given job.
         * 
         * params[0]: machine code
         * params[1]: job ID
         * params[2]: op
         * params[3]: notes
         */
        if (action == "createJob") {

            // Gets a copy of the changes to modify
            let updatedChanges = {...changes};
            let sqlValue = jobs.find((job) => { return job.id == params[1] });

            if (params[3] == null) params[3] = "";

            // If the current machine hasn't been logged, creates an object for it.
            if (updatedChanges["jobs"][params[0]] == undefined) {
                updatedChanges["jobs"][params[0]] = {};
            }

            // If the current job hasn't been logged, creates an object for it.
            updatedChanges["jobs"][params[0]][params[1]] = {};
            updatedChanges["jobs"][params[0]][params[1]].op = params[2];
            updatedChanges["jobs"][params[0]][params[1]].notes = params[3];
            updatedChanges["jobs"][params[0]][params[1]].state = params[4];

            // Update the changes list to match.
            setChanges(updatedChanges);

        }

        if (action == "deleteJob") {
            
            // Gets a copy of the changes to modify
            let updatedChanges = {...changes};

            // If the current machine hasn't been logged, creates an object for it.
            if (updatedChanges["jobs"][params[0]] == undefined) {
                updatedChanges["jobs"][params[0]] = {};
            }

            // If the current job hasn't been logged, creates an object for it.
            if (updatedChanges["jobs"][params[0]][params[1]] == undefined) {
                updatedChanges["jobs"][params[0]][params[1]] = {};
            }

            if (updatedChanges["jobs"][params[0]][params[1]].deleted) delete updatedChanges["jobs"][params[0]][params[1]].deleted;
            else updatedChanges["jobs"][params[0]][params[1]].deleted = true;

            if (Object.entries(updatedChanges["jobs"][params[0]][params[1]]).length == 0) delete updatedChanges["jobs"][params[0]][params[1]];
            else if (params[1] < 0) delete updatedChanges["jobs"][params[0]][params[1]];

            // Update the changes list to match.
            setChanges(updatedChanges);
            
        }

        if (action == "setJobState") {
            
            // Gets a copy of the changes to modify
            let updatedChanges = {...changes};
            let sqlValue = jobs.find((job) => { return job.id == params[1] });

            // If the current machine hasn't been logged, creates an object for it.
            if (updatedChanges["jobs"][params[0]] == undefined) {
                updatedChanges["jobs"][params[0]] = {};
            }

            // If the current job hasn't been logged, creates an object for it.
            if (updatedChanges["jobs"][params[0]][params[1]] == undefined) {
                updatedChanges["jobs"][params[0]][params[1]] = {};
            }

            if (sqlValue != undefined && sqlValue.state == params[2]) delete updatedChanges["jobs"][params[0]][params[1]].state;
            else updatedChanges["jobs"][params[0]][params[1]].state = params[2];

            // Update the changes list to match.
            setChanges(updatedChanges);
            
        }

        if (action == "undoJob") {
            
            // Gets a copy of the changes to modify
            let updatedChanges = {...changes};

            // If the current machine hasn't been logged, creates an object for it.
            if (updatedChanges["jobs"][params[0]] == undefined) {
                updatedChanges["jobs"][params[0]] = {};
            }

            // Delete the job.
            delete updatedChanges["jobs"][params[0]][params[1]];

            // Update the changes list to match.
            setChanges(updatedChanges);
            
        }

        /* 
         * Closes the popup box.
         */
        if (action == "closePopup") closePopup();

        if (action == "undo") {
            let newChanges = {...changes};
            delete newChanges["machines"][params[0]];
            delete newChanges["jobs"][params[0]];
            setChanges(newChanges);
        }

        /* 
         * Saves any changed machines, jobs, or shops.
         */
        if (action == "save") {
            if (!saving) save();
        }
    }

    // Returns the JSX for the whole shop.
    return (
        <>
            { /* This div sets the style for the whole shop. */ }
            <div className={styles.shop}>

                {
                    /* 
                     * Creates a building component from each building in the data. 
                     * 
                     * key: The code for the building (i.e. lm, s2, or s3)
                     * data: Gives the JSON data from the SQL database for the building.
                     * machines: Gives the JSON data from the SQL database for all machines in the building (filtered).
                     * jobs: Gives the JSON data from the SQL database for all the jobs.
                     *      note - Because jobs are tied to machines, not buildings, they aren't filtered here.
                     * changes: Includes all changes made on the edit page.
                     * updated: Whether or not machines have been updated.
                     * doAction: A function that can do a number of different actions given parameters.
                     * selectedMachine: The current machine selected.
                     */
                    buildings
                    .filter((building) => {
                        if (view == 0) return true;
                        if (view == 1) return building.code != "lm";
                        if (view == 2) return building.code == "lm";
                    })
                    .map((building) => {
                        return <Building 
                        key={building.code} 
                        data={building}
                        machines={
                            /* Filters for only machines in the given building. */
                            machines.filter((machine) => {
                                return (machine.building == building.code);
                            })
                        }
                        jobs={jobs}
                        changes={changes}
                        updated={updated}
                        doAction={(action, params) => { doAction(action, params)}}
                        selectedMachine={currentMachine} />
                    })
                }

            </div>
            { /* The EDIT, SAVE, and BACK buttons in the corners of the pages. */ }
            <div className={styles.left_bar}>
                {type == "edit" && <div className={styles.left_button} title="Save Changes" onClick={save}><img className={styles.button_image} src="/icons/google/save.svg" /></div>}
                {(type == "view" || type == "edit") && <div className={styles.right_button} title="Change View" onClick={ () => {
                    if (typeof window !== undefined) localStorage.setItem('view', (view + 1) % 3);
                    setView((view + 1) % 3);
                }}><img className={styles.button_image} src="/icons/google/eye.svg" /></div>}
            </div>

            <div className={styles.right_bar}>
                {type == "view" && <div className={styles.right_button} title="Edit">
                    <a href="./edit">
                        <img className={styles.button_image} src="/icons/google/edit.svg" />
                    </a>
                </div>}
                {type == "edit" && <div className={styles.right_button} title="Return to Home">
                    <a href="./">
                        <img className={styles.button_image} src="/icons/google/back_arrow.svg" />
                    </a>
                </div>}
            </div>
            
            { /* A popup box that shows up if it's enabled (state isn't 0). */
            popupState != 0 && 
            <InformationBox 
            doAction={(action, params) => { doAction(action, params) }}
            popupState={popupState}
            machine={machines.find((machine) => { return machine.code == currentMachine })}
            jobs={jobs.filter((job) => { return job.machine == currentMachine})} 
            changes={changes} />}
        </>
    )
}
