// This is an interactive component, so it's a client component.
'use client'

// Imports other modules.
import Building from './Building';
import InformationBox from './InformationBox';

// React hooks used later.
import { useEffect } from 'react';
import { useState } from 'react';

// Stylesheet for the main page.
import styles from './App.module.css';

// Default export for the machine shop.
export default function Shop() {

    // These 3 hooks contain the buildings, machines, and jobs.
    const [buildings, setBuildings] = useState([]);
    const [machines, setMachines] = useState([]);
    const [jobs, setJobs] = useState([]);

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
        setBuildings(response);
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

    function openPopup(code) {
        setPopupState(1);
        setCurrentMachine(code);
    }

    function closePopup() {
        setPopupState(0);
        setCurrentMachine('');
    }

    function doAction(action, params) {
        console.log(params);
        if (action == "reload") reload(params[0]);
        if (action == "openPopup") openPopup(params[0]);
        if (action == "closePopup") closePopup();
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
                     * reload: The reload method for the SQL databases. Can be used to reload from inside each component.
                     *      note - This is likely to be changed later.
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
                        doAction={(action, params) => { doAction(action, params)}}
                        selectedMachine={currentMachine} />
                    })
                }

            </div>
            { // TODO
            popupState != 0 && 
            <InformationBox 
            doAction={(action, params) => { doAction(action, params)}}
            popupState={popupState}
            machine={machines.find((machine) => { return machine.code == currentMachine })}
            jobs={jobs.filter((job) => { return job.machine == currentMachine})} />}
        </>
    )
}
