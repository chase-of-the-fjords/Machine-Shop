// Stylesheet for the machine component.
import styles from './Machine.module.css';

/* 
 * Default export for the machine.
 * 
 * data: The JSON data for this specific machine.
 * jobs: The JSON data for all the jobs for this machine.
 * reload: An reload function for all the SQL data.
 */
export default function Machine({data, jobs, doAction, selectedMachine}) {

    // Generates the machine's width, height, top (y-position), and left (x-position) values based on JSON data.
    let width = (data.width * 120) - 5;
    let height = (data.height * 120) - 5;
    let top = 5 + (data.ypos * 120);
    let left = 5 + (data.xpos * 120);

    // Returns the JSX for the machine.
    return (
        <>
            { /* 
               * The main element for the machine. Uses a button to make it naturally clickable.
               * 
               * key: The code for the machine (i.e. H3, OB, or ma)
               */ }
            <button 
                key={data.code}
                className={
                    // Sets the machine's main style by default.
                    // If the state is 1, that means the machine is out of service, so the out_of_service style is applied.
                    // If the state is 2, that means the machine is a priority, so the priority style is applied.
                    `${styles.machine}
                     ${data.state == 1 && styles.out_of_service}
                     ${data.state == 2 && styles.priority}
                     ${data.code == selectedMachine && styles.selected}`
                }
                style={
                    // Sets the width, height, top, and left values set earlier. 
                { width: `${width}px`,
                  height: `${height}px`,
                  top: `${top}px` ,
                  left: `${left}px` } 
                }
                onClick={
                    // TODO When the button is clicked, uses the updateMachine function to cycle to the next state. 
                    () => {
                        doAction("clickMachine", [data.code, (data.state + 1) % 3]);
                        //updateMachine(data.id, (data.state + 1) % 3);
                    }
                }
                >

                { /* The name of the machine in the top-right corner. */ }
                <div className={`${styles.name}`}>{data.name}</div>

                { /* The div that contains the text for the jobs. */ }
                <div className={`${styles.jobs}`}>
                    { getJobsText(jobs) }
                </div>

            </button>
        </>
    )
}

/* 
 * Gets the jobs text to display in the machine.
 * 
 * jobs: The JSON data for the jobs for the machine.
 */
function getJobsText (jobs) {
    // Currently returns "X job(s)", or nothing, depending on the quantity.
    if (jobs.length == 0) return "";
    if (jobs.length == 1) return "1 job";
    return jobs.length + " jobs";
}