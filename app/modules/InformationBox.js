// The stylesheet for the infobox.
import styles from './InformationBox.module.css';

// React hooks
import { useState, useEffect } from 'react';

/* 
 * Default export for the infobox.
 * 
 * doAction: Does an action in the Shop component.
 * popupState: The current state of the popup box (1: view machine, 2: edit machine, etc.)
 * machine: The current machine's object.
 * jobs: The jobs for the current machine.
 */
export default function InformationBox( { doAction, popupState, machine, jobs, changes } ) {

    // Returns the JSX for the infobox component.
    return (
        // The div for the box, which covers the whole screen.
        <div className={styles.popup_div}>
            { /* The background that darkens the screen. On click, the popup is closed. */ }
            <div className={styles.background} onClick={() => { doAction("closePopup", []) }} />
            { /* The popup box itself. */ }
            <div className={styles.info_box}>
                { /* The information inside the box. Selects a different component for each state. */ }
                { /* State 1: Views jobs for a given machine. */ }
                { popupState == 1 && <ViewJobBox doAction={doAction} popupState={popupState} machine={machine} jobs={jobs} changes={changes}></ViewJobBox> }
                { /* State 2: Edits a given machine. */ }
                { popupState == 2 && <EditJobBox doAction={doAction} popupState={popupState} machine={machine} jobs={jobs} changes={changes}></EditJobBox> }
            </div>
        </div>
    )
}

function ViewJobBox( { doAction, popupState, machine, jobs, changes } ) {
    // Divides jobs into categories.
    let currentJobs = jobs.filter((job) => { return job.state == 0 });
    let onHoldJobs = jobs.filter((job) => { return job.state == 1 });
    let queuedJobs = jobs.filter((job) => { return job.state == 2 });

    // The JSX for the view box.
    return (
        <div className={styles.content}>
            <h1 className={styles.machine_name}>{machine.name}</h1>
            { machine.state == 1 && <h2 className={styles.state}>OUT OF ORDER</h2> }
            { machine.state == 2 && <h2 className={styles.state}>PRIORITY</h2> }

            { /* The list of current jobs. */ }
            { currentJobs.length > 0 &&
            <>
                <h3 className={styles.subsection}>Currently Running:</h3>
                <ul className={styles.list}>
                {currentJobs.map((job) => {
                    return <li key={job.id}>{job.op}{job.notes == null || <p className={styles.note}>{job.notes}</p>}</li>
                })}
                </ul>
            </>}
            
            { /* The list of jobs on hold. */ }
            { onHoldJobs.length > 0 &&
            <>
                <h3 className={styles.subsection}>On Hold:</h3>
                <ul className={styles.list}>
                {onHoldJobs.map((job) => {
                    return <><li>{job.op}</li>
                    {job.notes == null || <p className={styles.note}>{job.notes}</p>}</>
                })}
                </ul>
            </>}

            { /* The list of jobs queued. */ }
            { queuedJobs.length > 0 &&
            <>
                <h3 className={styles.subsection}>Queued:</h3>
                <ul className={styles.list}>
                {queuedJobs.map((job) => {
                    return <><li>{job.op}</li>
                    {job.notes == null || <p className={styles.note}>{job.notes}</p>}</>
                })}
                </ul>
            </>}
        </div>
    )
}

function EditJobBox( { doAction, popupState, machine, jobs, changes } ) {

    const [editedMachine, setEditedMachine] = useState({});

    useEffect(() => {
        setEditedMachine(getEditedMachine({machine, changes}));
    }, [machine, changes])

    let currentJobs = jobs.filter((job) => { return job.state == 0 });
    let onHoldJobs = jobs.filter((job) => { return job.state == 1 });
    let queuedJobs = jobs.filter((job) => { return job.state == 2 });

    return (
        <div className={styles.content}>
            <div className={styles.leftButtonMenu}>
                <img className={styles.button} src={editedMachine.state == 2 ? "/icons/star-filled.svg" : "/icons/star-empty.svg"} alt="Priority Button" onClick={() => {doAction("set", ["state", 2])}}/>
                <img className={styles.button} style={{left: "52px"}} src={editedMachine.state == 1 ? "/icons/error-filled.svg" : "/icons/error-empty.svg"} alt="Out of Order Button" onClick={() => {doAction("set", ["state", 1])}}/>
            </div>

            <h1 className={styles.machine_name}>{editedMachine.name}</h1>
            { editedMachine.state == 1 && <h2 className={styles.state}>OUT OF ORDER</h2> }
            { editedMachine.state == 2 && <h2 className={styles.state}>PRIORITY</h2> }

            { /* The list of current jobs. */ }
            { currentJobs.length > 0 &&
            <>
                <h3 className={styles.subsection}>Currently Running:</h3>
                <ul className={styles.list}>
                {currentJobs.map((job) => {
                    return <li key={job.id}>{job.op}{job.notes == null || <p className={styles.note}>{job.notes}</p>}</li>
                })}
                </ul>
            </>}
            
            { /* The list of jobs on hold. */ }
            { onHoldJobs.length > 0 &&
            <>
                <h3 className={styles.subsection}>On Hold:</h3>
                <ul className={styles.list}>
                {onHoldJobs.map((job) => {
                    return <><li>{job.op}</li>
                    {job.notes == null || <p className={styles.note}>{job.notes}</p>}</>
                })}
                </ul>
            </>}

            { /* The list of jobs queued. */ }
            { queuedJobs.length > 0 &&
            <>
                <h3 className={styles.subsection}>Queued:</h3>
                <ul className={styles.list}>
                {queuedJobs.map((job) => {
                    return <><li>{job.op}</li>
                    {job.notes == null || <p className={styles.note}>{job.notes}</p>}</>
                })}
                </ul>
            </>}
        </div>
    )
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