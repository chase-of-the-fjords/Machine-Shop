/* Imports the machine component. */
import Machine from './Machine';

/* The stylesheet for the building. */
import styles from './Building.module.css';

/* The imports for the react-spring library (animations). */
import { useSpring, animated } from '@react-spring/web'

/* 
 * Default export for the building.
 * 
 * data: The JSON data for this specific building.
 * machines: The JSON data for all the machines in the building.
 * jobs: The JSON data for all the jobs in all the shops.
 * reload: An reload function for all the SQL data.
 */
export default function Building({data, machines, jobs, doAction, selectedMachine}) {

    // Defines the animation that plays when the buildings load for the first time.
    const springs = useSpring({
        from: {
            opacity: 0
        },
        to: {
            opacity: 1
        },
    })

    // Returns the JSX for the building.
    return (

        /* 
         * The main div for the building. It's animated with the springs animation defined above.
         * 
         * className and style set the style and animation properties.
         */
        <animated.div 
        className={styles.container}
        style={{
            // Sets the width based off the JSON data for the building. 100px is added as padding.
            width: `${ (data.width * 120) + 100 }px`,
            // Adds the animation to the div.
            ...springs,
        }}>

            { /* The header that contains the name of the building. */ }
            <h2 className={styles.header}>{data.name}</h2>

            { /* The div that contains the actual building. */ }
            <div
            className={styles.building}
            style={{
                /* Width and height are set based off of data from the SQL database. */
                width: `${ data.width * 120 }px`,
                height: `${ data.height * 120 }px`
            }}>
                {
                    /* 
                     * Creates a machine component from each machine in the data. 
                     * 
                     * key: The code for the machine (i.e. H3, OB, or ma)
                     * data: Gives the JSON data from the SQL database for the machine.
                     * jobs: Gives the JSON data from the SQL database for the jobs tied to the machine.
                     *      note - Filters through the data to find only the relevant jobs.
                     * reload: The reload method for the SQL databases. Can be used to reload from inside each component.
                     *      note - This is likely to be changed later.
                     */
                    machines.map((machine) => {
                        return <Machine 
                        key={machine.code} 
                        data={machine} 
                        jobs={
                            /* Filters for only jobs for the given machine. */
                            jobs.filter((job) => {
                                return (job.machine == machine.code);
                            })
                        }
                        doAction={(action, params) => { doAction(action, params)}}
                        selectedMachine={selectedMachine} />
                    })
                }
            </div>
        </animated.div>
    );
}
