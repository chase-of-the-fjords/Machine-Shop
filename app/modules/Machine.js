import styles from './Machine.module.css';

/* 
 * Default export for the machine.
 * 
 * data: The JSON data for this specific machine.
 * jobs: The JSON data for all the jobs for this machine.
 * update: An update function for all the SQL data.
 */
export default function Machine({data, jobs, update}) {

    /* 
     * Updates the state in the SQL database for a given machine.
     * 
     * code: The code for the machine (i.e. H8, OB, ma).
     * state: The state of the machine.
     */
    async function updateMachine(code, state) {

        // Sets the post-data for the machine, including its body.
        const postData = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id, state
            })
        }

        // Sends the actual request.
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/machineUpdate`, postData);
        
        // Refreshes the JSON data for the page from the database.
        update();
    }

    // Generates the machine's width, height, top (y-position), and left (x-position) values based on JSON data.
    let width = (data.width * 120) - 5;
    let height = (data.height * 120) - 5;
    let top = 5 + (data.ypos * 120);
    let left = 5 + (data.xpos * 120);

    // 
    return (
        <>
            <button 
                key={data.id}
                className={`${styles.machine} ${data.state == 1 && styles.bad_machine} ${data.state == 2 && styles.priority_machine}`}
                style={ { width: `${width}px`,
                          height: `${height}px`,
                          top: `${top}px` ,
                          left: `${left}px` } }
                onClick={
                    () => {
                        updateMachine(data.id, (data.state + 1) % 3);
                    }
                }
                >
                    <div className={`${styles.machine_name}`}>{data.name}</div>
                    <div 
                    className={`${styles.job_viewport}`}
                    style= { {
                        height: `${height - 16}px`
                    } }>
                        <div className={`${styles.job_container}`}>
                            {getJobsText(jobs)}
                        </div>
                    </div>
            </button>
        </>
    )
}

function getJobsText (jobs) {
    if (jobs.length == 0) return "";
    if (jobs.length == 1) return "1 job";
    return jobs.length + " jobs";
}