// This is an interactive component, so it's a client component.
'use client'

import styles from '../modules/App.module.css'
import history_style from './History.module.css'

import Log from './modules/Log';

import { useState } from 'react';

let buttonStart = new Date(Date.now()).toLocaleDateString('sv'), buttonEnd = new Date(Date.now()).toLocaleDateString('sv');

/**
 * The default export for the edit page.
 * 
 * @returns JSX representation of the edit page.
 */
export default function App() {

        // HOOKS

    const [ start, setStart ] = useState(new Date(Date.now()).toLocaleDateString('sv'));
    const [ end, setEnd ] = useState(new Date(Date.now()).toLocaleDateString('sv'));

    const [ submitStart, setSubmitStart ] = useState(new Date(Date.now()).toLocaleDateString('sv'));
    const [ submitEnd, setSubmitEnd ] = useState(new Date(Date.now()).toLocaleDateString('sv'));



        // JSX (RETURN VALUE)

    return (<>

            {/* MENU */}
            <Menu />

            {/* DATE SELECTOR */}
            <div className={history_style.date_selector}>

                <input type="date" className={history_style.date_input} 
                    defaultValue={new Date(Date.now()).toLocaleDateString('sv')} 
                    onChange={(e) => { setStart(e.target.value) }} 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && start <= end) {
                            setSubmitStart(start);
                            setSubmitEnd(end);
                        }
                    }} />

                <span className={history_style.to}> to </span>

                <input type="date" className={history_style.date_input} 
                    defaultValue={new Date(Date.now()).toLocaleDateString('sv')} 
                    onChange={(e) => { setEnd(e.target.value) }} 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && start <= end) {
                            setSubmitStart(start);
                            setSubmitEnd(end);
                        }
                    }} />

            </div>

            <div className={`${history_style.button} ${start <= end || history_style.invalid_button}`} onClick={() => { setSubmitStart(start); setSubmitEnd(end); }}>View History</div>

            <Log start={submitStart} end={submitEnd} />

            {/* RIGHT MENU */}
            <div className={styles.right_bar}>

                {/* EDIT BUTTON */}
                <div className={styles.right_button} title="Edit">
                    <a href="./edit">
                        <img className={styles.button_image} src="/icons/google/edit.svg" />
                    </a>
                </div>

                {/* HOME BUTTON */}
                <div className={styles.right_button} title="Return to Home">
                    <a href="./">
                        <img className={styles.button_image} src="/icons/google/home.svg" />
                    </a>
                </div>

            </div>

        </>
    );
}


// The menu bar component.
function Menu() {

    return <h1 className={styles.menu}>Origin Golf Machine Shop</h1>

}
