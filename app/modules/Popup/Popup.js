// The stylesheet for the popup.
import styles from './Popup.module.css';

// Boxes available to use.
import SaveBox from './SaveBox';
import MachineBox from './MachineBox';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * POPUP DEFAULT EXPORT
 * 
 * @param {number} popupState - The state of the popup box (saving, view, edit).
 * @param {string} machine - The machine being displayed (for view & edit).
 * @param {Array} jobs - The jobs for the machine.
 * @param {Object} changes - The unsaved changes to the shop.
 * @param {Function} doAction - Does some action.
 *  
 * @returns A JSX representation of the popup.
 */
export default function Popup( { popupState, machine, jobs, changes, user, doAction } ) {

    const [lastState, setLastState] = useState(0);

    useEffect(() => {
        if (popupState != 0) setLastState(popupState);
    }, [popupState])

        // JSX (RETURN VALUE)

    return (

        <AnimatePresence>

            {/* The div for the box, which covers the whole screen. */}
            { popupState != 0 && 
            <motion.div 
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.1}}
                className={`${styles.popup} z-10`}>

                { /* If the popup state is -1, create a SaveBox (Darken screen) */ }

                { lastState == -1 && <SaveBox /> }

                { /* If the popup state is 1 or 2, create a MachineBox (Edit or View Machine) */ }

                { (lastState == 1 || lastState == 2) && <MachineBox popupState={popupState} machine={machine} jobs={jobs} changes={changes} user={user} doAction={doAction} /> }

            </motion.div> }

        </AnimatePresence>
    )
}
