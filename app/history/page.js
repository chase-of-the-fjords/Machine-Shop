// This is an interactive component, so it's a client component.
'use client'

// The stylesheets.
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

    // The filter for search results.
    const [ filter, setFilter ] = useState("");



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
                        if (e.key === 'Enter') {
                            if (start <= end) {
                                setSubmitStart(start);
                                setSubmitEnd(end);
                            } else {
                                setSubmitStart(end);
                                setSubmitEnd(start);
                            }
                        }
                    }} />

                {/* "TO" */}
                <div className={history_style.to}> to </div>

                {/* ENDING DATE INPUT */}
                <input type="date" className={history_style.date_input} 
                    defaultValue={new Date(Date.now()).toLocaleDateString('sv')} 
                    onChange={(e) => { setEnd(e.target.value) }} 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (start <= end) {
                                setSubmitStart(start);
                                setSubmitEnd(end);
                            } else {
                                setSubmitStart(end);
                                setSubmitEnd(start);
                            }
                        }
                    }} />

                <input className={history_style.filter} type="text" onChange={(e) => { setFilter(e.target.value) }} placeholder='Search' />

            </div>

            {/* "VIEW HISTORY" BUTTON (SUBMIT) */}
            <div className={`${history_style.button}`} 
                onClick={ () => 
                { if (start <= end) {
                    setSubmitStart(start);
                    setSubmitEnd(end);
                } else {
                    setSubmitStart(end);
                    setSubmitEnd(start);
                } } }
            >View History</div>

            {/* THE LOG ITSELF */}
            <Log start={submitStart} end={submitEnd} filter={filter} />

            {/* RIGHT MENU */}
            <div className="absolute flex space-x-1 top-4 right-4">

                {/* EDIT BUTTON */}
                <div className="" title="Edit">
                    <a href="./edit">
                        <img className="" src="/icons/google/edit.svg" />
                    </a>
                </div>

                {/* HOME BUTTON */}
                <div className="" title="Return to Home">
                    <a href="./">
                        <img className="" src="/icons/google/home.svg" />
                    </a>
                </div>

            </div>

        </>

    );

}


// The menu bar component.
function Menu() {

    return <h1 className="pb-2 mx-auto mt-5 mb-6 text-3xl font-bold text-center border-b-2 border-black w-96 font-CastleTLig">Origin Golf Machine Shop</h1>

}
