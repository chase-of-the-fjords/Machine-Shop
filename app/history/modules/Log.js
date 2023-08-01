import { useState, useEffect } from "react";
import { getLog } from "../Helpers/Interface";

import log_style from './Log.module.css'

import moment from "moment";

export default function Log( { start, end } ) {

    const [ log, setLog ] = useState([]);
    let log_by_day = {};

    useEffect(() => {
        async function fetchData () {
            setLog(await getLog(start, end));
        }
        fetchData();
    }, [start, end])

    return <>
        <div className={log_style.log}>
            {
                Object.entries(log).map(([key, value]) => {
                    return <div key={key}>
                        <h1 className={log_style.date}>{new Date(key + " ").toLocaleDateString('en-US', {day: "2-digit", month: "long", year: "numeric"})}</h1>
                        {value.map((entry) => {
                            if (entry.action == 'created job') return <CreatedJob key={JSON.stringify(entry)} entry={entry} />;
                            if (entry.action == 'updated job') return <UpdatedJob key={JSON.stringify(entry)} entry={entry} />;
                            if (entry.action == 'deleted job') return <DeletedJob key={JSON.stringify(entry)} entry={entry} />;
                            if (entry.action == 'updated machine') return <UpdatedMachine key={JSON.stringify(entry)} entry={entry} />;
                        })}
                    </div>
                })
            }
        </div>
    </>;

}

function CreatedJob( {entry} ) {

    let time = moment(entry.timestamp).format('h:mm:ss A');

    return <>
        <div className={log_style.entry}>
            <div className={log_style.metadata}>
                <span className={log_style.timestamp}>{time}</span><br/>
                <span className={log_style.user}>{entry.user}</span>
            </div>
            <div className={log_style.entry_info}>
                <span className={log_style.action}><b>CREATED JOB</b> on <b>{entry.machine}</b> ({entry.state})</span><br/>
                <span className={log_style.op}>{entry.op}</span><br/>
                {entry.notes != "" && <><span className={log_style.notes}>{entry.notes}</span><br/></>}
            </div>
        </div>
        <br />
    </>

}

function UpdatedJob( {entry} ) {

    let time = moment(entry.timestamp).format('h:mm:ss A');

    return <>
        <div className={log_style.entry}>
            <div className={log_style.metadata}>
                <span className={log_style.timestamp}>{time}</span><br/>
                <span className={log_style.user}>{entry.user}</span>
            </div>
            <div className={log_style.entry_info}>
                <span className={log_style.action}><b>UPDATED JOB</b> on <b>{entry.machine}</b></span><br/>
                { entry.changes.op != undefined && <>
                    <span className={log_style.old_value}><b>OP:</b> {entry.changes.op.new}</span><br />
                    <span className={log_style.new_value}>From: {entry.changes.op.old}</span><br />
                </>}
                { entry.changes.notes != undefined && <>
                    <span className={log_style.old_value}><b>NOTES:</b> {entry.changes.notes.new}</span><br />
                    <span className={log_style.new_value}>From: {entry.changes.notes.old}</span><br />
                </>}
                { entry.changes.state != undefined && <>
                    <span className={log_style.old_value}><b>STATE:</b> {entry.changes.state.new}</span><br />
                    <span className={log_style.new_value}>From: {entry.changes.state.old}</span><br />
                </>}
            </div>
        </div>
        <br />
    </>

}

function DeletedJob( {entry} ) {

    let time = moment(entry.timestamp).format('h:mm:ss A');

    return <>
        <div className={log_style.entry}>
            <div className={log_style.metadata}>
                <span className={log_style.timestamp}>{time}</span><br/>
                <span className={log_style.user}>{entry.user}</span>
            </div>
            <div className={log_style.entry_info}>
                <span className={log_style.action}><b>DELETED JOB</b> on <b>{entry.machine}</b> ({entry.state})</span><br/>
                <span className={log_style.op}>{entry.op}</span><br/>
                {entry.notes != "" && <><span className={log_style.notes}>{entry.notes}</span><br/></>}
            </div>
        </div>
        <br />
    </>

}

function UpdatedMachine( {entry} ) {

    let time = moment(entry.timestamp).format('h:mm:ss A');

    return <>
        <div className={log_style.entry}>
            <div className={log_style.metadata}>
                <span className={log_style.timestamp}>{time}</span><br/>
                <span className={log_style.user}>{entry.user}</span>
            </div>
            <div className={log_style.entry_info}>
                <span className={log_style.action}><b>UPDATED MACHINE: {entry.name}</b></span><br/>
                { entry.changes.state != undefined && <>
                    <span className={log_style.old_value}><b>STATE:</b> {entry.changes.state.new}</span><br />
                    <span className={log_style.new_value}>From: {entry.changes.state.old}</span><br />
                </>}
            </div>
        </div>
        <br />
    </>

}