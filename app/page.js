'use client'

// Imports the shop component.
import Shop from './modules/Shop';

// The style sheet for the main page.
import styles from './modules/App.module.css';

import { useState, useEffect } from 'react';

// The function for the full application.
export default function App() {

    // These 3 hooks contain the buildings, machines, and jobs.
    const [buildings, setBuildings] = useState(localStorage.getItem('buildings') ? JSON.parse(localStorage.getItem('buildings')) : []);
    const [machines, setMachines] = useState(localStorage.getItem('machines') ? JSON.parse(localStorage.getItem('machines')) : []);
    const [jobs, setJobs] = useState(localStorage.getItem('jobs') ? JSON.parse(localStorage.getItem('jobs')) : []);

    return (<>
            <div className={styles.view_background}></div>
            <div className={styles.app}>

                { /* The menu at the top of the screen. Likely to be updated later. */ }
                <Menu></Menu>

                { /* The rest of the machine shop. */ }
                <Shop type="view" buildings={buildings} machines={machines} jobs={jobs} 
                    setBuildings={setBuildings} setMachines={setMachines} setJobs={setJobs}></Shop>

            </div>
        </>
    );
}

// The menu bar component. So far, just an H1 title with an underline.
function Menu() {
    return <h1 className={styles.menu}>Origin Golf Machine Shop</h1>
}
