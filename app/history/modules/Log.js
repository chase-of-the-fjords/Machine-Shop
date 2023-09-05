// Basic React hooks.
import { useState, useEffect } from "react";

// A function that gets a log given two dates.
import { getLog, sortLogByDate, runFilter } from "../Helpers/Interface";

// A class for managing time.
import moment from "moment";

/**
 * LOG DEFAULT EXPORT
 * 
 * Returns a JSX representation of a log between two dates.
 *  
 * @returns A JSX representation of a log between two dates.
 */
export default function Log( { start, end, filter } ) {

        // HOOKS

    // The log object being displayed.
    const [ log, setLog ] = useState([]);

    const [ filteredLog, setFilteredLog ] = useState({});

    // Updates the log whenever the dates are updated.
    useEffect(() => {
        async function fetchData () {
            setLog(await getLog(start, end));
        }
        fetchData();
    }, [start, end])

    useEffect(() => {
        
        setFilteredLog(sortLogByDate(runFilter(log, filter)));

    }, [log, filter]);



        // JSX (RETURN VALUE)

    return <>
        {/* Object containing the full log. */}
        <div className="w-11/12 max-w-2xl p-3 mx-auto mb-16 bg-gray-300 rounded-md shadow-lg h-fit">
            {

                // Iterates through every day in the log.
                Object.entries(filteredLog).map(([key, value]) => {

                    // For each day...
                    return <div key={key}>

                        {/* DAY HEADER */}
                        <h1 className="mt-3 mb-5 text-3xl font-bold text-center">{new Date(key + " ").toLocaleDateString('en-US', {day: "2-digit", month: "long", year: "numeric"})}</h1>
                        
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

    return <div className="flex mb-8">

        {/* METADATA */}
        <Metadata entry={entry} />
        
        {/* ENTRY DATA */}
        <div className="float-right grow">

            {/* MAIN LINE */}
            <div><b>CREATED JOB</b> on <b>{entry.machine}</b> ({entry.state})</div>
            
            {/* OP */}
            <div className="ml-4">{entry.op}</div>
            
            {/* NOTES */}
            {entry.notes != "" && <><div className="ml-5 text-xs">{entry.notes}</div></>}
       
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

    return <div className="flex mb-8">

        {/* METADATA */}
        <Metadata entry={entry} />
        
        {/* ENTRY DATA */}
        <div className="float-right grow">

            {/* MAIN LINE */}
            <div className=""><b>UPDATED JOB</b> on <b>{entry.machine}</b></div>
            
            {/* OP */}
            { entry.changes.op != undefined && <>
                <div className="ml-4"><b>OP:</b> {entry.changes.op.new}</div>
                <div className="ml-6 italic">From: {entry.changes.op.old}</div>
            </>}

            {/* NOTES */}
            { entry.changes.notes != undefined && <>
                <div className="ml-4"><b>NOTES:</b> {entry.changes.notes.new}</div>
                <div className="ml-6 italic">From: {entry.changes.notes.old}</div>
            </>}

            {/* STATE */}
            { entry.changes.state != undefined && <>
                <div className="ml-4"><b>STATE:</b> {entry.changes.state.new}</div>
                <div className="ml-6 italic">From: {entry.changes.state.old}</div>
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

    return <div className="flex mb-8">

        {/* METADATA */}
        <Metadata entry={entry} />
        
        {/* ENTRY DATA */}
        <div className="float-right grow">

            {/* MAIN LINE */}
            <div className=""><b>DELETED JOB</b> on <b>{entry.machine}</b> ({entry.state})</div>
            
            {/* NAME */}
            <div className="ml-4">{entry.op}</div>
            
            {/* NOTES */}
            {entry.notes != "" && <div className="ml-5 text-xs">{entry.notes}</div>}

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

    return <div className="flex mb-8">

        {/* METADATA */}
        <Metadata entry={entry} />
        
        {/* ENTRY DATA */}
        <div className="float-right grow">

            {/* MAIN LINE */}
            <div className=""><b>CREATED MACHINE:</b> {entry.name} in {entry.building}</div>
            
            {/* DIMENSIONS & POSITION */}
            <div className="ml-4"><b>DIMENSIONS & POSITION:</b> {entry.width}x{entry.height} at ({entry.xpos}, {entry.ypos})</div>
            
            {/* STATE */}
            <div className="ml-4"><b>STATE:</b> {entry.state}</div>
        
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

    return <div className="flex mb-8">

        {/* METADATA */}
        <Metadata entry={entry} />
        
        {/* ENTRY DATA */}
        <div className="float-right grow">

            {/* MAIN LINE */}
            <div className=""><b>UPDATED MACHINE: {entry.name}</b></div>

            {/* STATE */}
            { entry.changes.state != undefined && <>
                <div className="ml-4"><b>STATE:</b> {entry.changes.state.new}</div>
                <div className="ml-6 italic">From: {entry.changes.state.old}</div>
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
    return <div className="basis-20 sm:basis-24 grow-0 shrink-0">
        <div className="text-xs sm:text-sm">{time}</div>
        <div className="text-xs sm:text-sm">{entry.user}</div>
    </div>

}