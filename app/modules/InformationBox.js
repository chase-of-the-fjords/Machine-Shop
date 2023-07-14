import styles from './InformationBox.module.css';

import { animated, useSpring } from 'react-spring';

export default function InformationBox( { doAction, popupState, machine, jobs } ) {
    /*const springs = useSpring({
        from: {
            top: '-120%',
            opacity: 0
        },
        to: {
            top: '10%',
            opacity: 1
        },
    })*/

    let currentJobs = jobs.filter((job) => { return job.state == 0 });
    let onHoldJobs = jobs.filter((job) => { return job.state == 1 });
    let queuedJobs = jobs.filter((job) => { return job.state == 2 });

    return (
        <div className={styles.popup_div}>
            <div className={styles.background} onClick={() => { doAction("closePopup", []) }} />
            <div className={styles.info_box}>
                <div className={styles.content}>
                    <h1 className={styles.machine_name}>{machine.name}</h1>
                    { machine.state == 1 && <h2 className={styles.state}>OUT OF SERVICE</h2> }
                    { machine.state == 2 && <h2 className={styles.state}>PRIORITY</h2> }

                    { /* The list of current jobs. */ }
                    { currentJobs.length > 0 &&
                    <>
                        <h3 className={styles.subsection}>Currently Running:</h3>
                        <ul className={styles.list}>
                        {currentJobs.map((job) => {
                            return <><li>{job.op}</li>
                            {job.notes == null || <p className={styles.note}>{job.notes}</p>}</>
                        })}
                        </ul>
                    </>}
                    
                    { /* The list of jobs on hold. */ }
                    { onHoldJobs.length > 0 &&
                    <>
                        <h3 className={styles.subsection}>On Hold:</h3>
                        <ul className={styles.list}>
                        {onHoldJobs.map((job) => {
                            return <><li>{job.op}</li>
                            {job.notes == null || <p className={styles.note}>{job.notes}</p>}</>
                        })}
                        </ul>
                    </>}

                    { /* The list of jobs queued. */ }
                    { queuedJobs.length > 0 &&
                    <>
                        <h3 className={styles.subsection}>Queued:</h3>
                        <ul className={styles.list}>
                        {queuedJobs.map((job) => {
                            return <><li>{job.op}</li>
                            {job.notes == null || <p className={styles.note}>{job.notes}</p>}</>
                        })}
                        </ul>
                    </>}
                </div>
            </div>
        </div>
    )
}