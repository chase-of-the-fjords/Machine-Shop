    // IMPORTS

// Stylesheet for the machine component.
import styles from './Machine.module.css';

// Two common React hooks.
import { useEffect, useState } from 'react';

// A custom hook for finding window dimensions.
import useWindowDimensions from '../CustomHooks/useWindowDimensions';

// Custom functions for finding edits machine & jobs data.
import { getEditedJobs, getEditedMachine } from './DataHelper';

/**
 * MACHINE: DEFAULT EXPORT
 * 
 * @param {Object} data JSON data for this specific machine.
 * @param {Array} jobs The JSON  
 * @param {Object} data - The JSON data for this specific machine.
 * @param {Array} jobs - The JSON data for all the jobs for this machine.
 * @param {Object} changes - An object containing all edits currently being made.
 * @param {Array} updated - An array tracking if machines have been updated.
 * @param {string} selectedMachine - The code of the currently selected machine.
 * @param {Function} doAction - A function passed in to do some action.
 * 
 * @returns {Object} JSX representation of the machine.
 */
export default function Machine( {data, jobs, changes, updated, selectedMachine, doAction} ) {

        // REACT HOOKS

    // A hook containing JSON data for the machine, edited with changes from the "changes" object.
    const [editedData, setEditedData] = useState({});

    // A hook containing JSON data for the machine's jobs, edited with changes from the "changes" object.
    const [editedJobs, setEditedJobs] = useState({});

    // A hook containing the height and width of the window.
    const { height, width } = useWindowDimensions();

    // Whenever the data or changes object change, updates the editedData hook.
    useEffect(() => {
        setEditedData(getEditedMachine( {data, changes} ));
    }, [data, changes])

    // Whenever the data, jobs, or changes object change, updates the editedJobs hook.
    useEffect(() => {
        setEditedJobs(getEditedJobs( {data, jobs, changes} ));
    }, [data, jobs, changes])




        // SIZING AND STYLING

    // The size of the machine in pixels, and the buffer size around the edges of the machines.
    // Changes based on the width of the screen.
    let machine_size = (width <= 700 ? (width <= 500 ? 75 : 100) : 120);
    let machine_buffer = (width <= 700 ? (width <= 500 ? 3 : 4) : 5);

    // The height and width of the machine in pixels.
    let machine_width = (editedData.width * machine_size) - machine_buffer;
    let machine_height = (editedData.height * machine_size) - machine_buffer;

    // The position of the machine on the screen.
    let x = machine_buffer + (editedData.xpos * machine_size);
    let y = machine_buffer + (editedData.ypos * machine_size);

    // Applies the above values to a style object.
    let style = {
        width: `${machine_width}px`,
        height: `${machine_height}px`,
        top: `${y}px` ,
        left: `${x}px`
    }

    // The set of styles applied based on the machine's state, etc.
    // - Sets the machine's main style by default.
    // - If the state is 1, that means the machine is out of order, so the out_of_order style is applied.
    // - If the machine has been updated, the updated style is applied.
    // - If the machine has been modified & its unsaved, the unsaved style is applied.
    // - If the machine is currently selected, the selected style is applied.
    let className = 
       `${styles.machine}
        ${editedData.state == 1 && styles.out_of_order}
        ${updated[data.code] && styles.updated}
        ${editedData.unsaved && styles.unsaved}
        ${editedData.code == selectedMachine && styles.selected}`;




        // JSX (RETURN VALUE)
    
    return (
        <>
            { /* 
               * The main element for the machine. Uses a button to make it naturally clickable.
               * 
               * key: The code for the machine (i.e. H3, OB, or ma)
               * className: The set of classes for the stylesheet, calculated above.
               * style: Sets the height, width, and position.
               * onClick: Does a "clickMachine" action upon being clicked.
               */ }
            <button
                key={data.code} 
                className={className}
                style={style}
                onClick={ () => doAction("clickMachine", [data.code]) } >

                { /* If the machine is a priority, adds a star. */ }
                { editedData.state == 2 && <img className={styles.priority_star} src="/icons/star-filled.svg" alt="Priority"/> }

                { /* The name of the machine in the top-right corner. */ }
                <div className={`${styles.name}`}>{data.name}</div>

                { /* The div that contains the text for the jobs. */ }
                <div className={`${styles.jobs}`}>
                    { getCurrentJobsText(editedJobs) }
                </div>

                { /* The div that contains the text for the queued jobs. */ }
                <div className={`${styles.queued}`}>
                    { getQueuedJobsText(editedJobs) }
                </div>

            </button>
        </>
    )
}




    // HELPER FUNCTIONS

/**
 * GET CURRENT JOBS TEXT
 * 
 * Given a list of jobs, get text to display on the machine representing the current jobs.
 * 
 * @param {Array} jobs - The JSON data for the jobs for the machine.
 * 
 * @returns {string} "X job(s)" depending on count of current jobs.
 */
function getCurrentJobsText (jobs) {
    
    // Make sure there are jobs to display.
    if (jobs.length > 0) {

        // Filters through the jobs to find "currently running" jobs.
        let currentJobs = jobs.filter((job) => { return (job.state == 0 && !job.deleted) });
        
        // Returns "X job(s)", or nothing, depending on the quantity.
        if (currentJobs.length == 0) return "";
        if (currentJobs.length == 1) return "1 job";
        return currentJobs.length + " jobs";
    }

    // If there are no jobs, return an empty string.
    return "";

}

/**
 * GET QUEUED JOBS TEXT
 * 
 * Given a list of jobs, get text to display on the machine representing the queued jobs.
 * 
 * @param {Array} jobs - The JSON data for the jobs for the machine.
 * 
 * @returns {string} "X job(s)" depending on count of queued jobs.
 */
function getQueuedJobsText (jobs) {
    
    // Make sure there are jobs to display.
    if (jobs.length > 0) {

        // Filters through the jobs to find "queued" jobs.
        let queuedJobs = jobs.filter((job) => { return (job.state == 2 && !job.deleted) });
        
        // Returns "X job(s) queued", or nothing, depending on the quantity.
        if (queuedJobs.length == 0) return "";
        if (queuedJobs.length == 1) return "1 job queued";
        return queuedJobs.length + " jobs queued";
    }

    // If there are no jobs, return an empty string.
    return "";

}