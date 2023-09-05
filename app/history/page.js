// This is an interactive component, so it's a client component.
'use client'

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
            <div className="mx-auto w-fit">

                {/* STARTING DATE INPUT */}
                <input type="date" className="block p-2 mx-8 text-xl border border-black rounded-md sm:inline-block" 
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
                <div className="block text-2xl text-center sm:inline-block"> to </div>

                {/* ENDING DATE INPUT */}
                <input type="date" className="block p-2 mx-8 text-xl border border-black rounded-md sm:inline-block" 
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

                <input className="block p-2 m-5 mx-auto text-center border border-black rounded-md" type="text" onChange={(e) => { setFilter(e.target.value) }} placeholder='Search' />

            </div>

            {/* "VIEW HISTORY" BUTTON (SUBMIT) */}
            <div className="block p-2 m-5 mx-auto text-center transition-colors border border-black rounded-md cursor-pointer hover:bg-gray-100 w-36" 
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
            <div className="absolute flex space-x-1 top-2 right-2 sm:top-4 sm:right-4">

                {/* EDIT BUTTON */}
                <div className="w-8 cursor-pointer sm:w-12" title="Edit">
                    <a href="./edit">
                        <img className="" src="/icons/google/edit.svg" />
                    </a>
                </div>

                {/* HOME BUTTON */}
                <div className="w-8 cursor-pointer sm:w-12" title="Return to Home">
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

    return <h1 className="mx-auto mt-2 mb-6 text-2xl font-bold text-center sm:mt-5 sm:w-96 sm:text-3xl sm:pb-2 w-36 font-CastleTLig">Origin Golf Machine Shop</h1>

}
