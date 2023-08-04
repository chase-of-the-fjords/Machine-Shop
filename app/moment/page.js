// This is an interactive component, so it's a client component.
'use client'

// Imports the shop component.
import Shop from './Shop';

// The style sheet for the main page.
import styles from '../modules/App.module.css';

// Basic React hooks.
import { useState, useEffect } from 'react';

/**
 * The default export for the edit page.
 * 
 * @returns JSX representation of the edit page.
 */
export default function App() {

    // These 3 hooks contain the buildings, machines, and jobs.
    const [buildings, setBuildings] = useState([]);
    const [machines, setMachines] = useState([]);
    const [jobs, setJobs] = useState([]);

    const [datetime, setDatetime] = useState("");




        // JSX (RETURN VALUE)

    return (<>

            {/* BACKGROUND */}
            <div className={styles.background}></div>

            {/* FOREGROUND */}
            <div>
                { /* The menu at the top of the screen. Likely to be updated later. */ }
                <Menu setDatetime={setDatetime} />

                { /* The rest of the machine shop. */ }
                <Shop type="moment" buildings={buildings} machines={machines} jobs={jobs} 
                    setBuildings={setBuildings} setMachines={setMachines} setJobs={setJobs}
                    datetime={datetime} />
            </div>

        </>
    );
}

// The menu bar component.
function Menu( {setDatetime} ) {

    return <div>
        <input className={styles.datetime} type="datetime-local" onChange={(e) => { setDatetime(e.target.value) } } />
    </div>

}
