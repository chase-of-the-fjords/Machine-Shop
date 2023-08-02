// The stylesheet.
import log_style from './Log.module.css'

// Basic React hooks.
import { useState, useEffect } from "react";

// A function that gets a log given two dates.
import { getLog } from "../Helpers/Interface";

// A class for managing time.
import moment from "moment";

/**
 * LOG DEFAULT EXPORT
 * 
 * Returns a JSX representation of a log between two dates.
 *  
 * @returns A JSX representation of a log between two dates.
 */
export default function Log( { start, end } ) {

        // HOOKS

    // The log object being displayed.
    const [ log, setLog ] = useState({});

    // Updates the log whenever the dates are updated.
    useEffect(() => {
        async function fetchData () {
            setLog(await getLog(start, end));
        }
        fetchData();
    }, [start, end])



        // JSX (RETURN VALUE)

    return <>
        {/* Object containing the full log. */}
        <div className={log_style.log}>
            {

                // Iterates through every day in the log.
                Object.entries(log).map(([key, value]) => {

                    // For each day...
                    return <div key={key}>

                        {/* DAY HEADER */}
                        <h1 className={log_style.date}>{new Date(key + " ").toLocaleDateString('en-US', {day: "2-digit", month: "long", year: "numeric"})}</h1>
                        
                        {/* LIST OF ENTRIES */}
                        {value.map((entry) => {

                            // Match each entry to its respective component.
                            if (entry.action == 'created job') return <CreatedJob key={JSON.stringify(entry)} entry={entry} />;
                            if (entry.action == 'updated job') return <UpdatedJob key={JSON.stringify(entry)} entry={entry} />;
                            if (entry.action == 'deleted job') return <DeletedJob key={JSON.stringify(entry)} entry={entry} />;
                            if (entry.action == 'updated machine') return <UpdatedMachine key={JSON.stringify(entry)} entry={entry} />;
                            if (entry.action == 'created machine') return <CreatedMachine key={JSON.stringify(entry)} entry={entry} />;
                            
                        })}

                    </div>

                })

            }

        </div>

    </>;

}

/**
 * Component representing a job that was created.
 * 
 * @returns JSX for the component.
 */
function CreatedJob( {entry} ) {

        // JSX (RETURN VALUE)

    return <div className={log_style.entry}>

        {/* METADATA */}
        <Metadata entry={entry} />
        
        {/* ENTRY DATA */}
        <div className={log_style.entry_info}>

            {/* MAIN LINE */}
            <div className={log_style.action}><b>CREATED JOB</b> on <b>{entry.machine}</b> ({entry.state})</div>
            
            {/* OP */}
            <div className={log_style.op}>{entry.op}</div>
            
            {/* NOTES */}
            {entry.notes != "" && <><div className={log_style.notes}>{entry.notes}</div></>}
       
        </div>

    </div>

}

/**
 * Component representing a job that was updated.
 * 
 * @returns JSX for the component.
 */
function UpdatedJob( {entry} ) {

        // JSX (RETURN VALUE)

    return <div className={log_style.entry}>

        {/* METADATA */}
        <Metadata entry={entry} />
        
        {/* ENTRY DATA */}
        <div className={log_style.entry_info}>

            {/* MAIN LINE */}
            <div className={log_style.action}><b>UPDATED JOB</b> on <b>{entry.machine}</b></div>
            
            {/* OP */}
            { entry.changes.op != undefined && <>
                <div className={log_style.new_value}><b>OP:</b> {entry.changes.op.new}</div>
                <div className={log_style.old_value}>From: {entry.changes.op.old}</div>
            </>}

            {/* NOTES */}
            { entry.changes.notes != undefined && <>
                <div className={log_style.new_value}><b>NOTES:</b> {entry.changes.notes.new}</div>
                <div className={log_style.old_value}>From: {entry.changes.notes.old}</div>
            </>}

            {/* STATE */}
            { entry.changes.state != undefined && <>
                <div className={log_style.new_value}><b>STATE:</b> {entry.changes.state.new}</div>
                <div className={log_style.old_value}>From: {entry.changes.state.old}</div>
            </>}

        </div>

    </div>

}

/**
 * Component representing a job that was deleted.
 * 
 * @returns JSX for the component.
 */
function DeletedJob( {entry} ) {

        // JSX (RETURN VALUE)

    return <div className={log_style.entry}>

        {/* METADATA */}
        <Metadata entry={entry} />
        
        {/* ENTRY DATA */}
        <div className={log_style.entry_info}>

            {/* MAIN LINE */}
            <div className={log_style.action}><b>DELETED JOB</b> on <b>{entry.machine}</b> ({entry.state})</div>
            
            {/* NAME */}
            <div className={log_style.op}>{entry.op}</div>
            
            {/* NOTES */}
            {entry.notes != "" && <div className={log_style.notes}>{entry.notes}</div>}

        </div>

    </div>

}

/**
 * Component representing a machine that was created.
 * 
 * @returns JSX for the component.
 */
function CreatedMachine( {entry} ) {

        // JSX (RETURN VALUE)

    return <div className={log_style.entry}>

        {/* METADATA */}
        <Metadata entry={entry} />
        
        {/* ENTRY DATA */}
        <div className={log_style.entry_info}>

            {/* MAIN LINE */}
            <div className={log_style.action}><b>CREATED MACHINE:</b> {entry.name} in {entry.building}</div>
            
            {/* DIMENSIONS & POSITION */}
            <div className={log_style.new_value}><b>DIMENSIONS & POSITION:</b> {entry.width}x{entry.height} at ({entry.xpos}, {entry.ypos})</div>
            
            {/* STATE */}
            <div className={log_style.new_value}><b>STATE:</b> {entry.state}</div>
        
        </div>

    </div>

}

/**
 * Component representing a machine that was updated.
 * 
 * @returns JSX for the component.
 */
function UpdatedMachine( {entry} ) {

        // JSX (RETURN VALUE)

    return <div className={log_style.entry}>

        {/* METADATA */}
        <Metadata entry={entry} />
        
        {/* ENTRY DATA */}
        <div className={log_style.entry_info}>

            {/* MAIN LINE */}
            <div className={log_style.action}><b>UPDATED MACHINE: {entry.name}</b></div>

            {/* STATE */}
            { entry.changes.state != undefined && <>
                <div className={log_style.old_value}><b>STATE:</b> {entry.changes.state.new}</div>
                <div className={log_style.new_value}>From: {entry.changes.state.old}</div>
            </>}

        </div>

    </div>

}

/**
 * Finds the metadata for an entry (timestamp & user).
 *  
 * @returns JSX for the metadata.
 */
function Metadata( { entry } ) {

    // Formats the time.
    let time = moment.utc(entry.timestamp).format('h:mm:ss A');

    // JSX (RETURN VALUE)
    return <div className={log_style.metadata}>
        <div className={log_style.timestamp}>{time}</div>
        <div className={log_style.user}>{entry.user}</div>
    </div>

}