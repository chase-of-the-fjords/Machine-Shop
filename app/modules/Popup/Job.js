// The stylesheet for the jobs.
import job_style from './Job.module.css'

// Import used for the note input.
import TextareaAutosize from 'react-textarea-autosize'

/**
 * JOB DEFAULT EXPORT
 * 
 * @param {number} popupState - The state of the popup (edit or view).
 * @param {Object} job - The Job being displayed.
 * @param {Function} setJobOp - Set the value of the jobOp hook.
 * @param {Function} setJobNotes - Set the value of the jobNotes hook.
 * @param {number} selectedJob - The job currently selected.
 * @param {Function} setSelectedJob - Sets the value of the selectedJob hook.
 * @param {Function} deselect - Saves & deselects the currently selected job.
 * @param {Function} doAction - Does an action.
 * 
 * @returns A JSX representation of the job.
 */
export default function Job ( { popupState, job, setJobOp, setJobNotes, selectedJob, setSelectedJob, deselect, doAction } ) {

    // Exports a different version of the job depending on the popup state:

    // State of 1 requires a ViewJob.
    if (popupState == 1) 
        return <ViewJob job={job} />
    
    // State of 2 requires an EditJob.
    if (popupState == 2) 
        return <EditJob job={job} 
            setJobOp={setJobOp}
            setJobNotes={setJobNotes}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            deselect={deselect}
            doAction={doAction} />

}

/**
 * VIEW JOB
 * 
 * A version of the Job component only meant for viewing.
 * 
 * @param {Object} job - The Job being displayed.
 * 
 * @returns A JSX representation of the job.
 */
function ViewJob ( { job } ) {

    // Returns a list entry with two paragraph elements for a job.
    return <li key={job.id} className={job_style.job}>
        <p className={job_style.op}>{job.op}</p>
        {(job.notes == null || job.notes == "") || <p className={job_style.note}>{job.notes}</p>}
    </li>

}

/**
 * EDIT JOB
 * 
 * A version of the Job component meant for editing.
 * 
 * @param {Object} job - The Job being displayed.
 * @param {Function} setJobOp - Set the value of the jobOp hook.
 * @param {Function} setJobNotes - Set the value of the jobNotes hook.
 * @param {number} selectedJob - The job currently selected.
 * @param {Function} setSelectedJob - Sets the value of the selectedJob hook.
 * @param {Function} deselect - Saves & deselects the currently selected job.
 * @param {Function} doAction - Does an action.
 * 
 * @returns A JSX representation of the job.
 */
function EditJob ( { job, setJobOp, setJobNotes, selectedJob, setSelectedJob, deselect, doAction } ) {

        // UNSELECTED JOB

    if (selectedJob != job.id) {

        // Similar to the ViewJob, but can be deleted & unsaved, and selects the job on click.
        return <li key={job.id} className={`${job_style.job} ${job_style.editable} ${job.unsaved && job_style.unsaved} ${job.deleted && job_style.deleted}`}
            onClick={() => {
                deselect();
                setSelectedJob(job.id);
                setJobOp(job.op);
                setJobNotes(job.notes);
            }}>
            <p className={job_style.op}>{job.op}</p>
            {(job.notes == null || job.notes == "") || <p className={job_style.note}>{job.notes}</p>}
        </li>

    }
    
    

        // CURRENTLY SELECTED JOB
    
    else {

        // The basic list entry.
        return <li key={job.id} className={job_style.job}>

            {/* FORM FOR JOB ENTRY, DOES NOT SUBMIT. */}
            <form onSubmit={e => { e.preventDefault(); }} >
                
                {/* FIRST LINE of the edit form (OP, save, queue/unqueue, delete) */}
                <div className={job_style.edit_line}>
                    
                    {/* JOB OP ENTRY */}
                    <input className={job_style.edit_op}
                           autoFocus
                           onFocus={e => e.target.select()}
                           type="text" 
                           placeholder="OP" 
                           defaultValue={job.op}
                           onChange={(e) => setJobOp(e.target.value)}
                           onKeyDown={(e) => {
                                if (e.key === 'Enter') deselect();
                                if (e.key === 'Escape') setSelectedJob(0);
                           }} />                  

                    {/* SAVE BUTTON */}
                    <img className={job_style.edit_button}
                         src="/icons/google/save.svg"
                         title="Save"
                         alt="Save Button"
                         onClick={() => {
                            deselect();
                         }
                    }/>

                    {/* QUEUE/DEQUEUE BUTTON */}
                    <img className={job_style.edit_button}
                         src={job.state == 0 ? "/icons/google/down_arrow.svg" : "/icons/google/up_arrow.svg"}
                         title={job.state == 0 ? "Queue" : "Set Current"}
                         alt={job.state == 0 ? "Move to Queue" : "Set to Currently Running"}
                         onClick={() => {
                            doAction("setJobState", [job.machine, job.id, (job.state + 2) % 4]);
                            deselect();
                         }
                    }/>

                    {/* DELETE BUTTON */}
                    <img className={job_style.edit_button}
                         src={"/icons/google/delete.svg"}
                         title="Delete" 
                         alt="Delete" 
                         onClick={() => {
                            deselect();
                            doAction("deleteJob", [job.machine, job.id]);
                         }
                    }/>

                </div>

                {/* SECOND LINE of the edit form (Notes) */}
                <div className={job_style.edit_line}>
                    
                    {/* JOB NOTES INPUT */}
                    <TextareaAutosize
                        className={job_style.edit_notes}
                        onFocus={e => e.target.select()}
                        placeholder="Notes"
                        defaultValue={job.notes} 
                        onChange={(e) => setJobNotes(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') deselect();
                            if (e.key === 'Escape') setSelectedJob(0);
                        }} />

                </div>

            </form>

        </li>

    }

}
