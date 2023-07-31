// This is an interactive component, so it's a client component.
'use client'

// Imports the shop component.
import Shop from './modules/Shop';

// The style sheet for the main page.
import styles from './modules/App.module.css';

// Basic React hook.
import { useState } from 'react';

/**
 * The default export for the view page.
 * 
 * @returns JSX representation of the edit page.
 */
export default function App() {

    // These 3 hooks contain the buildings, machines, and jobs.
    const [buildings, setBuildings] = useState([]);
    const [machines, setMachines] = useState([]);
    const [jobs, setJobs] = useState([]);

        // JSX (RETURN VALUE)

    return (<>

            {/* BACKGROUND */}
            <div className={styles.view_background}></div>

            {/* FOREGROUND */}
            <div className={styles.app}>

                { /* The menu at the top of the screen. Likely to be updated later. */ }
                <Menu />

                { /* The rest of the machine shop. */ }
                <Shop type="view" buildings={buildings} machines={machines} jobs={jobs} 
                    setBuildings={setBuildings} setMachines={setMachines} setJobs={setJobs}></Shop>

            </div>
        </>
    );
}

// The menu bar component.
function Menu() {

    return <h1 className={styles.menu}>Origin Golf Machine Shop</h1>

}
