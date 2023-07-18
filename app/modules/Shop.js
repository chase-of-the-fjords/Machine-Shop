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

// Default export for the machine shop.
export default function Shop( { type } ) {

    // These 3 hooks contain the buildings, machines, and jobs.
    const [buildings, setBuildings] = useState([]);
    const [machines, setMachines] = useState([]);
    const [jobs, setJobs] = useState([]);
    
    // These 3 hooks contain the queued changes for the buildings, machines, and jobs.
    const [changes, setChanges] = useState({"buildings": {}, "machines": {}, "jobs": {}});

    /* 
     * The current state of the popup.
     * 
     * 0: No popup selected
     * 1: Viewing machine jobs
     */
    const [popupState, setPopupState] = useState(0);
    const [currentMachine, setCurrentMachine] = useState('');

    // Gets the shops to populate the "buildings" hook.
    async function getBuildings() {
        const postData = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": '*',
            }
        }
        // Accesses the buildings API.
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/buildings`, postData);
        const response = await res.json();
        // Sets the value of "buildings".
        setBuildings(response.filter((building) => { return (building.code != "lm" )}));
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
        // Accesses the machines API.
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machines`, postData);
        const response = await res.json();
        // Sets the value of "machines".
        setMachines(response);
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
        // Accesses the jobs API.
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/jobs`, postData);
        const response = await res.json();
        // Sets the value of "jobs".
        setJobs(response);
    }

    // A joint function to get all the necessary SQL data.
    function reload( param ) {
        if (param == "all" || param == "buildings") getBuildings();
        if (param == "all" || param == "machines") getMachines();
        if (param == "all" || param == "jobs") getJobs();
    }
    
    // This gets all the data when the page loads, and then again every 30 seconds.
    useEffect(() => {
        reload("all");

        const interval = setInterval(() => {
            reload("all");
        }, 30000);

        return () => clearInterval(interval);
    }, []);

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
    function save() {
        console.log(changes);
        Object.entries(changes.machines).forEach(([key, machine]) => {
            updateMachine(key);
        })
    }

    /* 
     * Updates values for a given machine. 2 steps:
     *  1. Delete the old entry for the machine by setting an end-time.
     *  2. Create a duplicate starting at the current moment with changes.
     * 
     * code: The code for the machine (i.e. H8, OB, ma).
     */
    async function updateMachine(code) {

        // STEP 1: End the old machine.

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
        const res1 = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machines/updateEnd`, postData1);

        // STEP 2: Create a new, updated machine.

        machine = getEditedMachine({machine, changes});

        // Sets the post-data for the machine, including its body.
        const postData2 = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                machine
            })
        }

        // Sends the actual request.
        const res2 = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machines/create`, postData2);

        // Refreshes the JSON data for the page from the database.
        doAction("reload", ["machines"]);
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
            if (type == "view") openPopup(params[0], 1);
            if (type == "edit") openPopup(params[0], 2);
        }

        /* 
         * Sets the value of something in the current machine.
         * 
         */
        if (action == "set") {

            let updatedChanges = {...changes};

            if (updatedChanges["machines"][currentMachine] == undefined) updatedChanges["machines"][currentMachine] = {};

            if (updatedChanges["machines"][currentMachine][params[0]] == params[1]) updatedChanges["machines"][currentMachine][params[0]] = 0;
            else updatedChanges["machines"][currentMachine][params[0]] = params[1];

            setChanges(updatedChanges);

        }

        /* 
         * Closes the popup box.
         */
        if (action == "closePopup") closePopup();

        /* 
         * Saves any changed machines, jobs, or shops.
         * param[0]: The table being reloaded: "machines", "shops", "jobs", "all".
         */
        if (action == "save") save();
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
                     * doAction: A function that can do a number of different actions given parameters.
                     * selectedMachine: The current machine selected.
                     */
                    buildings
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
                        doAction={(action, params) => { doAction(action, params)}}
                        selectedMachine={currentMachine} />
                    })
                }

            </div>
            { /* The EDIT, SAVE, and BACK buttons in the corners of the pages. */ }
            {type == "view" && <Link className={styles.navigation} href="/edit">EDIT</Link>}
            {type == "edit" && <Link className={styles.navigation} href="./">BACK</Link>}
            {type == "edit" && <div className={styles.save} onClick={() => doAction("save", [])}>SAVE</div>}
            { /* A popup box that shows up if it's enabled (state isn't 0). */
            popupState != 0 && 
            <InformationBox 
            doAction={(action, params) => { doAction(action, params)}}
            popupState={popupState}
            machine={machines.find((machine) => { return machine.code == currentMachine })}
            jobs={jobs.filter((job) => { return job.machine == currentMachine})} 
            changes={changes} />}
        </>
    )
}
