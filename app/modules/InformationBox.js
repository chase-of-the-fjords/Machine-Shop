// The stylesheet for the infobox.
import styles from './InformationBox.module.css';

// React hooks
import { useState, useEffect } from 'react';

import TextareaAutosize from 'react-textarea-autosize';

let newJobCounter = -1;

/* 
 * Default export for the infobox.
 * 
 * doAction: Does an action in the Shop component.
 * popupState: The current state of the popup box (1: view machine, 2: edit machine, etc.)
 * machine: The current machine's object.
 * jobs: The jobs for the current machine.
 */
export default function InformationBox( { doAction, popupState, machine, jobs, changes } ) {

    const [jobOp, setJobOp] = useState("");
    const [jobNotes, setJobNotes] = useState("");

    const [selectedJob, setSelectedJob] = useState(0);

    const [editedJobs, setEditedJobs] = useState([]);

    useEffect(() => {
        if (popupState != -1) setEditedJobs(getEditedJobs({machine, jobs, changes}));
    }, [jobs, changes])

    // Returns the JSX for the infobox component.
    return (
        // The div for the box, which covers the whole screen.
        <div className={styles.popup_div}>
            { /* The background that darkens the screen. On click, the popup is closed. */ }
            <div className={styles.background} onClick={() => { 
                if (popupState == 2 && selectedJob != 0) save({jobs: editedJobs, selectedJob, jobOp, jobNotes, doAction});
                if (popupState == 2) setSelectedJob(0);
                if (popupState != -1) doAction("closePopup", [])
            }} />
            { /* The popup box itself. */ }
            { popupState != -1 &&
            <div className={styles.info_box}>
                { /* The information inside the box. Selects a different component for each state. */ }
                { /* State 1: Views jobs for a given machine. */ }
                { popupState == 1 && <ViewJobBox doAction={doAction} popupState={popupState} machine={machine} jobs={editedJobs} changes={changes} selectedJob={selectedJob}></ViewJobBox> }
                { /* State 2: Edits a given machine. */ }
                { popupState == 2 && <EditJobBox doAction={doAction} popupState={popupState} machine={machine} jobs={editedJobs} 
                                                changes={changes} selectedJob={selectedJob} setSelectedJob={(id) => {setSelectedJob(id)}}
                                                jobOp={jobOp} setJobOp={setJobOp} jobNotes={jobNotes} setJobNotes={setJobNotes}></EditJobBox> }
            </div> }
        </div>
    )
}

function ViewJobBox( { doAction, popupState, machine, jobs, changes, selectedJob } ) {
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

            { /* The list of jobs queued. */ }
            { queuedJobs.length > 0 &&
            <>
                <h3 className={styles.subsection}>Queued:</h3>
                <ul className={styles.list}>
                {queuedJobs.map((job) => {
                    return <div key={job.id}><li>{job.op}</li>
                    {job.notes == null || <p className={styles.note}>{job.notes}</p>}</div>
                })}
                </ul>
            </>}
        </div>
    )
}

function EditJobBox( { doAction, machine, jobs, changes, selectedJob, setSelectedJob, jobOp, setJobOp, jobNotes, setJobNotes } ) {

    const [editedMachine, setEditedMachine] = useState({});

    useEffect(() => {
        setEditedMachine(getEditedMachine({machine, changes}));
    }, [machine, changes])

    let currentJobs = jobs.filter((job) => { return job.state == 0 });
    let queuedJobs = jobs.filter((job) => { return job.state == 2 });

    return (
        <div className={styles.content} onClick={(e) => {
            if (e.currentTarget != e.target) return;
            if (selectedJob != 0) save({jobs, selectedJob, jobOp, jobNotes, doAction});
            setSelectedJob(0);
        }}>
            <div onClick={(e) => {
                if (selectedJob != 0) save({jobs, selectedJob, jobOp, jobNotes, doAction});
                setSelectedJob(0);
            }}>
                { /* Menu buttons for setting a machine to be a priority or out of service. */ }
                <div className={styles.button_menu}>
                    <img className={styles.button} src={editedMachine.state == 2 ? "/icons/google/star_filled.svg" : "/icons/google/star_empty.svg"} alt="Priority Button" title={editedMachine.state == 2 ? "Unset as Priority" : "Set as Priority"} onClick={() => {doAction("setMachine", ["state", 2])}}/>
                    <img className={styles.button} style={{left: "52px"}} src={editedMachine.state == 1 ? "/icons/google/broken_filled.svg" : "/icons/google/broken_empty.svg"} alt="Out of Order Button" title={editedMachine.state == 1 ? "Set as Operational" : "Set as Out of Order"} onClick={() => {doAction("setMachine", ["state", 1])}}/>
                </div>

                { /* Menu button for reverting machine to its original state. */ }
                <div className={styles.button_menu}>
                    <img className={styles.button} style={{right: "0px"}} src="/icons/google/undo.svg" alt="Revert Button" title="Undo Changes" onClick={() => {doAction("undo", [machine.code])}}/>
                </div>

                { /* Machine name & its current state. */ }
                <h1 className={styles.machine_name}>{editedMachine.name}</h1>
                { editedMachine.state == 0 && <h2 className={`${styles.state} ${editedMachine.state != machine.state && styles.edited_state}`}>OPERATIONAL</h2> }
                { editedMachine.state == 1 && <h2 className={`${styles.state} ${editedMachine.state != machine.state && styles.edited_state}`}>OUT OF ORDER</h2> }
                { editedMachine.state == 2 && <h2 className={`${styles.state} ${editedMachine.state != machine.state && styles.edited_state}`}>PRIORITY</h2> }
            </div>

            { /* The list of current jobs. */ }
            <h3 className={styles.subsection} onClick={(e) => {
                if (selectedJob != 0) save({jobs, selectedJob, jobOp, jobNotes, doAction});
                setSelectedJob(0);
            }}>Currently Running:</h3>
            <ul className={styles.list}>
                { /* Maps each current job to a list entry. */ }
                {currentJobs.map((job) => {
                    return <Job key={job.id} doAction={doAction} jobs={jobs} job={job} selectedJob={selectedJob} setSelectedJob={setSelectedJob} 
                                jobOp={jobOp} jobNotes={jobNotes} setJobOp={setJobOp} setJobNotes={setJobNotes} ></Job>
                })}
            </ul>
            <div className={styles.add_job} title="Create New Job" onClick={
                    () => {
                        if (selectedJob != 0) save({jobs, selectedJob, jobOp, jobNotes, doAction});
                        doAction("createJob", [machine.code, newJobCounter, "New Job", "", 0]);
                        setSelectedJob(newJobCounter);
                        setJobOp("New Job");
                        setJobNotes("");
                        newJobCounter--;
                    }
                }>+</div>

            { /* The list of current jobs. */ }
            <h3 className={styles.subsection} onClick={(e) => {
                if (selectedJob != 0) save({jobs: jobs, selectedJob, jobOp, jobNotes, doAction});
                setSelectedJob(0);
            }}>Queued:</h3>
            <ul className={styles.list}>
                { /* Maps each current job to a list entry. */ }
                {queuedJobs.map((job) => {
                    return <Job key={job.id} doAction={doAction} jobs={jobs} job={job} selectedJob={selectedJob} setSelectedJob={setSelectedJob} 
                                jobOp={jobOp} jobNotes={jobNotes} setJobOp={setJobOp} setJobNotes={setJobNotes} ></Job>
                })}
            </ul>
            <div className={styles.add_job} title="Create New Job" onClick={
                    () => {
                        if (selectedJob != 0) save({jobs, selectedJob, jobOp, jobNotes, doAction});
                        doAction("createJob", [machine.code, newJobCounter, "New Job", "", 2]);
                        setSelectedJob(newJobCounter);
                        setJobOp("New Job");
                        setJobNotes("");
                        newJobCounter--;
                    }
                }>+</div>
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

/*
 * Given a list of changes, returns modified data for jobs.
 */
function getEditedJobs ({machine, jobs, changes}) {
    let editedJobs = JSON.parse(JSON.stringify(jobs));
    let edits = changes["jobs"][machine.code];
    if (edits != undefined) {
        for (const [key, value] of Object.entries(edits)) {
            if (key > 0 && Object.entries(value).length > 0) {
                let match = editedJobs.find((job) => { return job.id == key });
                if (value.op != undefined) match.op = value.op;
                if (value.notes != undefined) match.notes = value.notes;
                if (value.state != undefined) match.state = value.state;
                if (value.deleted == true) match.deleted = true;
                match.unsaved = true;
            } else {
                let newJob = {id: key, machine: machine.code, op: value.op, notes: value.notes, state: value.state};
                newJob.new = true;
                editedJobs.push(newJob);
            }
        }
    }
    return editedJobs;
}

function Job ( { doAction, jobs, job, selectedJob, setSelectedJob, jobOp, jobNotes, setJobOp, setJobNotes } ) {

    if (selectedJob != job.id) {
        return <li 
            className={`${job.deleted && styles.deleted} ${job.unsaved && styles.unsaved} ${job.new && styles.new} ${styles.list_entry}`}
            onClick={() => {
                if (selectedJob != 0) save({jobs, selectedJob, jobOp, jobNotes, doAction});
                setSelectedJob(job.id);
                setJobOp(job.op);
                setJobNotes(job.notes);
            }}>
                {job.op}
            {(job.notes == null || job.notes == "") || <p className={styles.note}>{job.notes}</p>}
        </li>
    }

    if (job.id == selectedJob) {
        return <li className={styles.list_edit}>
            <form onSubmit={e => { e.preventDefault(); }} className={styles.job_form} >
                <div className={styles.first_line}>
                    <input autoFocus onFocus={e => e.target.select()} type="text" placeholder="OP" defaultValue={job.op} 
                            className={styles.input_op} onChange={(e) => setJobOp(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    save({jobs, selectedJob, jobOp, jobNotes, doAction});
                                    setSelectedJob(0);
                                }
                                if (e.key === 'Escape') {
                                    setSelectedJob(0);
                                }
                            }}></input>
                    

                    <img className={styles.form_button} src="/icons/google/save.svg" alt="Save Button" title="Save" onClick={() => {
                        save({jobs, selectedJob, jobOp, jobNotes, doAction});
                        setSelectedJob(0);
                    }}/>

                    <img className={styles.form_button} src={job.state == 0 ? "/icons/google/down_arrow.svg" : "/icons/google/up_arrow.svg"} title={job.state == 0 ? "Queue" : "Set Current"} alt={job.state == 0 ? "Move to Queue" : "Set to Currently Running"} onClick={() => {
                        doAction("setJob", [job.machine, job.id, jobOp, jobNotes]);
                        doAction("setJobState", [job.machine, job.id, (job.state + 2) % 4]);
                        setSelectedJob(0);
                    }}/>

                    { /* <img className={styles.form_button} src={"/icons/google/undo.svg"} alt={"Undo Changes"} onClick={() => {
                        doAction("undoJob", [job.machine, selectedJob]);
                        setSelectedJob(0);
                    }}/> */ }

                    <img className={styles.form_button} src={"/icons/google/delete.svg"} alt="Delete" title="Delete" onClick={() => {
                        doAction("deleteJob", [job.machine, job.id]);
                        setSelectedJob(0);
                    }}/>
                </div>
                <TextareaAutosize onFocus={e => e.target.select()} placeholder="Notes" defaultValue={job.notes} className={styles.input_notes} 
                                wrap="soft" onChange={(e) => setJobNotes(e.target.value)} onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        save({jobs, selectedJob, jobOp, jobNotes, doAction});
                                        setSelectedJob(0);
                                    }
                                }}></TextareaAutosize>
            </form>
        </li>
    }
}

function save({ jobs, selectedJob, jobOp, jobNotes, doAction }) {
    let job = jobs.find((job) => { return job.id == selectedJob });
    doAction("setJob", [job.machine, selectedJob, jobOp, jobNotes]);
}