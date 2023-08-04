// This is an interactive component, so it's a client component.
'use client'

import { useState, useEffect } from "react";

import styles from './Timeclock.module.css'
import moment from "moment";

import TextareaAutosize from 'react-textarea-autosize'

/**
 * The default export for the view page.
 * 
 * @returns JSX representation of the edit page.
 */
export default function App() {

    let [employeeData, setEmployeeData] = useState("");
    let [timeclockData, setTimeclockData] = useState("");

    let [employees, setEmployees] = useState([]);

    let [start, setStart] = useState((moment().startOf('week').add(-2, 'week')).format('YYYY-MM-DD'));
    let [end, setEnd] = useState((moment().startOf('week').add(-1, 'day')).format('YYYY-MM-DD'));

    let [selected, setSelected] = useState(0);

    let [clock, setClock] = useState([]);

    useEffect(() => {
        
        let newClock = getClock(timeclockData, start, end);

        setClock(newClock);

    }, [start, end, timeclockData])

    useEffect(() => {
        


    }, [clock])

    useEffect(() => {
        
        let lines = employeeData.split('\n');

        let newEmployees = [];

        for (var i = 0; i < lines.length; i++){
            
            if (lines[i][0] != '#' && lines[i].length > 1) {
                
                try {

                    let values = lines[i].split(', ');

                    let ID = values[0].trim();
                    let shift = values[1].trim();
                    let name = values[2].trim();

                    let employee = {id: ID, shift: shift, name: name};

                    newEmployees[employee.id] = employee;

                } catch (e) {}

            }

        }
        
        setEmployees(newEmployees);

    }, [employeeData]);

    async function getEmployeeData(e) {

        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => { 
            const text = (e.target.result)
            setEmployeeData(text);
        };
        reader.readAsText(e.target.files[0])

    }

    async function getTimeclockData(e) {

        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => { 
            const text = (e.target.result)
            setTimeclockData(text);
        };
        reader.readAsText(e.target.files[0])

    }

        // JSX (RETURN VALUE)

    return (<div className={styles.container}>
            {/* DATA INPUT */}
            <div className={styles.input_data}>
                <h2>Input Data</h2>
                <h3>Employee Data: </h3><input type="file" accept=".dat, .txt" onChange={e => { getEmployeeData(e) }} />
                <h3>Timeclock Data: </h3><input type="file" accept=".dat, .txt" onChange={e => { getTimeclockData(e) }} />
                <h3>Starting Date: </h3><input type="date" defaultValue={(moment().startOf('week').add(-2, 'week')).format('YYYY-MM-DD')} onChange={e => { setStart(e.target.value) }} />
                <h3>Ending Date: </h3><input type="date" defaultValue={(moment().startOf('week').add(-1, 'day')).format('YYYY-MM-DD')} onChange={e => { setEnd(e.target.value) }} />
                <h3>Employees: </h3>
                <select name="employee" id="employee" onChange={e => { setSelected(e.target.value) }}>
                    <option value={0} key={0}>N/A</option>
                    {employees.map((employee) => {
                        return <option value={employee.id} key={employee.id}>{employee.name}</option>
                    })}
                </select>
            </div>

            {/* EMPLOYEE DATA */}
            <div className={styles.employee_data}>
                {employees[selected] != undefined && 
                <h2>{employees[selected].name} (ID {employees[selected].id}, Shift {employees[selected].shift})</h2>}

                <EmployeeData employee={employees[selected]} data={clock.filter((clockin) => selected == clockin.ID )} />

            </div>
        </div>
    );
}

function getClock (data, start, end) {

    let newClock = [];

    let lines = data.split('\n');

    for (var i = 0; i < lines.length; i++){
            
        if (lines[i][0] != '#' && lines[i].length > 1) {
            
            try {

                let values = lines[i].split(/(\s)/).filter((x) => x.trim().length>0);

                let ID = values[0];
                let date = values[1];
                let time = values[2];

                let clockin = {id: ID, date: date, time: time};

                if (start <= date && date <= end) {
                    newClock.push(clockin);
                }

            } catch (e) { }

        }

    }

    return newClock;

}

function EmployeeData ( {employee, data} ) {

    return <TextareaAutosize className={styles.textarea}>getClockText({data})</TextareaAutosize>

}

function getClockText ( {data} ) {

    let clockText = "ABCDEFG";

    for (let i = 0; i < data.length; i++) {
        
        if (i != 0) clockText += '\n';
        clockText += data[i].date + ' ' + data[i].time;

    }

    return clockText;

}