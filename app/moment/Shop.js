// This is an interactive component, so it's a client component.
'use client'

// Imports other modules.
import Building from '../modules/Building/Building';
import Popup from '../modules/Popup/Popup';

// Helper functions for saving & reloading.
import { reload, save } from '../modules/Helpers/Interface';

// React hooks used later.
import { useEffect } from 'react';
import { useState } from 'react';

// Action functions to be passed into other components.
import { clickMachine, setMachine, setJob, createJob, deleteJob, setJobState, closePopup, undo } from '../modules/Helpers/Actions';

// Default export for the machine shop.
export default function Shop( { type, machines, buildings, jobs, setMachines, setBuildings, setJobs, user, datetime, hasChanges, setHasChanges } ) {
    
        // HOOKS

    // Tracks which shops are on display.
    const [view, setView] = useState(0);

    // Tracks the state of the popup (saving, view, edit).
    const [popupState, setPopupState] = useState(0);

    // Tracks the current machine.
    const [currentMachine, setCurrentMachine] = useState('');

    // This gets all the data when the page loads, and then again every 60 seconds.
    useEffect(() => {

        // Loads the shop view from localStorage if it exists.
        setView(localStorage.getItem('view') ? JSON.parse(localStorage.getItem('view')) : 1);

    }, []);

    // This refreshes all the data whenever the datetime changes.
    useEffect(() => {

        // Loads the page.
        reload("moment", { setBuildings, setMachines, setJobs, datetime });

    }, [datetime]);




        // Calls the action helper function given an action and parameters.

    function doAction ( act, params ) {

        if (act == 'clickMachine')  clickMachine(params[0], { type, updated: [], setUpdated: () => {return;}, popupState, setPopupState, setCurrentMachine });
        if (act == 'closePopup')    closePopup({ setPopupState, setCurrentMachine });

    }

    


        // JSX (RETURN VALUE)
    
    return (
        <>
            { /* This div sets the style for the whole shop. */ }
            <div className="w-full mx-auto text-center">

                {
                    // Creates building components.
                    buildings
                    .filter((building) => {
                        // Filters buildings based on the view.
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
                        changes={{"machines": {}, "jobs": {}}}
                        updated={[]}
                        jobs={jobs}
                        doAction={(action, params) => { doAction(action, params)}}
                        selectedMachine={currentMachine} />
                    })
                }

            </div>



            {/* MENU BARS */}

            {/* LEFT MENU */}
            <div className="absolute flex space-x-1 top-2 left-2 sm:top-4 sm:left-4">

                {/* SAVE BUTTON */}
                {type == "edit" && <div className="w-8 cursor-pointer sm:w-12" title="Save Changes" onClick={() => doAction('save', [])}>
                    <img className="" src="/icons/google/save.svg" />
                </div>}
                
                {/* VIEW BUTTON */}
                {(type == "view" || type == "edit" || type == "moment") && <div className="w-8 cursor-pointer sm:w-12" title="Change View" onClick={ () => {
                    if (typeof window !== undefined) localStorage.setItem('view', (view + 1) % 3);
                    setView((view + 1) % 3);
                }}><img className="" src="/icons/google/eye.svg" /></div>}

            </div>



            {/* RIGHT MENU */}
            <div className="absolute flex space-x-1 top-2 right-2 sm:top-4 sm:right-4">

                {/* EDIT BUTTON */}
                {type == "view" && <div className="w-8 cursor-pointer sm:w-12" title="Edit">
                    <a href="./edit">
                        <img className="" src="/icons/google/edit.svg" />
                    </a>
                </div>}

                {/* HISTORY BUTTON */}
                {(type == "edit" || type == "moment") && <div className="w-8 cursor-pointer sm:w-12" title="View History">
                    <a href="./history">
                        <img className="" src="/icons/google/history.svg" />
                    </a>
                </div>}

                {/* HOME BUTTON */}
                {(type == "edit" || type == "moment") && <div className="w-8 cursor-pointer sm:w-12" title="Return to Home">
                    <a href="./">
                        <img className="" src="/icons/google/home.svg" />
                    </a>
                </div>}

            </div>
            
            { /* POPUP */
            <Popup 
                doAction={(action, params) => { doAction(action, params) }}
                popupState={popupState}
                machine={machines.find((machine) => { return machine.code == currentMachine })}
                jobs={jobs.filter((job) => { return job.machine == currentMachine})} 
                changes={{"machines": {}, "jobs": {}}} />}
        </>
    )
}
