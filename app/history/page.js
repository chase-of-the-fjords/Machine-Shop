// This is an interactive component, so it's a client component.
'use client'

// The stylesheets.
import styles from '../modules/App.module.css'
import history_style from './History.module.css'

// The log components (finds & shows the actual history.)
import Log from './modules/Log';

// Basic React hook.
import { useState } from 'react';

/**
 * The default export for the edit page.
 * 
 * @returns JSX representation of the edit page.
 */
export default function App() {

        // HOOKS

    // The value of the calendar buttons.
    const [ start, setStart ] = useState(new Date(Date.now()).toLocaleDateString('sv'));
    const [ end, setEnd ] = useState(new Date(Date.now()).toLocaleDateString('sv'));

    // The submitted values (values being used).
    const [ submitStart, setSubmitStart ] = useState(new Date(Date.now()).toLocaleDateString('sv'));
    const [ submitEnd, setSubmitEnd ] = useState(new Date(Date.now()).toLocaleDateString('sv'));



        // JSX (RETURN VALUE)

    return (<>

            {/* MENU */}
            <Menu />

            {/* DATE SELECTOR */}
            <div className={history_style.date_selector}>

                {/* STARTING DATE INPUT */}
                <input type="date" className={history_style.date_input} 
                    defaultValue={new Date(Date.now()).toLocaleDateString('sv')} 
                    onChange={(e) => { setStart(e.target.value) }} 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && start <= end) {
                            setSubmitStart(start);
                            setSubmitEnd(end);
                        }
                    }} />

                {/* "TO" */}
                <div className={history_style.to}> to </div>

                {/* ENDING DATE INPUT */}
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

            {/* "VIEW HISTORY" BUTTON (SUBMIT) */}
            <div className={`${history_style.button} ${start <= end || history_style.invalid_button}`} onClick={() => { setSubmitStart(start); setSubmitEnd(end); }}>View History</div>

            {/* THE LOG ITSELF */}
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
