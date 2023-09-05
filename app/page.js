// This is an interactive component, so it's a client component.
'use client'

// Imports the shop component.
import Shop from './modules/Shop';

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
            <div className="bg-white -z-10 fixed top-0 left-0 w-full h-[150%]" />

            {/* FOREGROUND */}
            <div>

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

    return <h1 className="pb-2 mx-auto mt-5 mb-6 text-3xl font-bold text-center border-b-2 border-black w-96 font-CastleTLig">Origin Golf Machine Shop</h1>

}
