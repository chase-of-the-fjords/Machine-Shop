// The stylesheet for the jobs.
import job_style from './Job.module.css'

// Import used for the note input.
import TextareaAutosize from 'react-textarea-autosize'

import moment from 'moment'

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

    let date = '';
    let verb = 'Updated';

    if (job.log == 0 || job.log == 2) {
        verb = 'Created';
    } else {
        verb = 'Updated';
    }

    if (moment.utc(job.start).format('MM/DD/YYYY') == moment.utc().format('MM/DD/YYYY')) {
        date = `${verb} today at ${moment.utc(job.start).format('h:mm a')}`;
    } else if (moment.utc(job.start).add(1, 'day').format('MM/DD/YYYY') == moment.utc().format('MM/DD/YYYY')) {
        date = `${verb} yesterday at ${moment.utc(job.start).format('h:mm a')}`;
    } else {
        date = `${verb} ${moment.utc(job.start).format('MMMM Do [at] h:mm a')}`;
    }

    // Returns a list entry with two paragraph elements for a job.
    return <li key={job.id} className={job_style.job}>
        <div className={job_style.op_box}>
            <div className={job_style.op}>{job.op}</div>
            <div className={job_style.timestamp}>{date}</div>
        </div>
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

    let date = '';
    let verb = 'Updated';

    if (job.log == 0 || job.log == 2) {
        verb = 'Created';
    } else {
        verb = 'Updated';
    }

    if (moment.utc(job.start).format('MM/DD/YYYY') == moment.utc().format('MM/DD/YYYY')) {
        date = `${verb} today at ${moment.utc(job.start).format('h:mm a')}`;
    } else if (moment.utc(job.start).add(1, 'day').format('MM/DD/YYYY') == moment.utc().format('MM/DD/YYYY')) {
        date = `${verb} yesterday at ${moment.utc(job.start).format('h:mm a')}`;
    } else {
        date = `${verb} ${moment.utc(job.start).format('MMMM Do [at] h:mm a')}`;
    }

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
            <div className={job_style.op_box}>
                <div className={job_style.op}>{job.op}</div>
                <div className={job_style.timestamp}>{date}</div>
            </div>
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
                         src="/icons/google/check.svg"
                         title="Save"
                         alt="Save Button"
                         onClick={() => {
                            deselect();
                         }
                    }/>

                    {/* COMPLETE BUTTON */}
                    { job.state == 0 && <img className={job_style.edit_button}
                         src={"/icons/google/golf_flag.svg"}
                         title={"Mark as DONE"}
                         alt={"Mark as DONE"}
                         onClick={() => {
                            doAction("setJobState", [job.machine, job.id, 3]);
                            deselect();
                         }
                    }/>}

                    {/* SET TO CURRENT BUTTON */}
                    { job.state == 2 && <img className={job_style.edit_button}
                         src={"/icons/google/up_arrow.svg"}
                         title={"Move to NOW"}
                         alt={"Move to NOW"}
                         onClick={() => {
                            doAction("setJobState", [job.machine, job.id, 0]);
                         }
                    }/>}

                    {/* QUEUE BUTTON */}
                    { job.state == 3 && <img className={job_style.edit_button}
                         src={"/icons/google/up_arrow.svg"}
                         title={"Move to NEXT"}
                         alt={"Move to NEXT"}
                         onClick={() => {
                            doAction("setJobState", [job.machine, job.id, 2]);
                         }
                    }/>}

                    {/* DELETE BUTTON */}
                    <img className={job_style.edit_button}
                         src={"/icons/google/delete.svg"}
                         title="Delete" 
                         alt="Delete" 
                         onClick={() => {
                            doAction("deleteJob", [job.machine, job.id]);
                            setSelectedJob(0);
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
