    // IMPORTS

// Imports the machine component.
import Machine from '../Machine/Machine';

// The imports for the react-spring library (animations).
import { useSpring, animated } from '@react-spring/web'

// A custom hook for finding window dimensions.
import useWindowDimensions from '../CustomHooks/useWindowDimensions';

/**
 * BUILDING: DEFAULT EXPORT
 * 
 * @param {Object} data - The JSON data for this specific building.
 * @param {Array} machines - The JSON data for all the machines in the building.
 * @param {Array} jobs - The JSON data for all the jobs in all the shops.
 * @param {Object} changes - An object storing unsaved changes to the shop.
 * @param {Object} updated - An object storing which machines have been updated.
 * @param {string} selectedMachine - The ID of the currently selected machine.
 * @param {Function} doAction - A function with a number of possible actions.
 * 
 * @returns {Object} A JSX representation of the Building.
 */
export default function Building({data, machines, jobs, changes, updated, selectedMachine, doAction}) {

        // REACT HOOKS

    // Defines the animation that plays when the buildings load for the first time.
    const springs = useSpring({
        from: {
            opacity: 0
        },
        to: {
            opacity: 1
        },
    })

    // A hook containing the height and width of the window.
    const { height, width } = useWindowDimensions();




        // SIZING AND STYLING

    let machine_size = (width <= 640 ? (width <= 500 ? 75 : 100) : 120);
    let machine_buffer = (width <= 640 ? (width <= 500 ? 3 : 4) : 5);

    let container_style = {
        // Sets the width based off the JSON data for the building. 100px is added as padding.
        width: `${ (data.width * machine_size) + (width <= 700 ? 4 : 100) }px`,
        // Adds the animation to the div.
        ...springs,
    };

    let building_style = {
        /* Width and height are set based off of data from the SQL database. */
        width: `${ data.width * machine_size }px`,
        height: `${ data.height * machine_size }px`
    };



        // JSX (RETURN VALUE)
    
    return (

        // The main div for the building. It's animated with the springs animation defined above.
        <animated.div className="inline-block mb-10 transition-[width]" style={container_style}>

            { /* The header that contains the name of the building. */ }
            <h2 className="mb-3 text-2xl font-semibold text-center">{data.name}</h2>

            { /* The div that contains the actual building. */ }
            <div className="box-content relative p-[2.5px] rounded-md mx-auto bg-gray-300 shadow-lg transition-all" style={building_style}>
                {
                    /* 
                     * Creates a machine component from each machine in the data.
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
                            changes={changes}
                            updated={updated}
                            doAction={doAction}
                            selectedMachine={selectedMachine} />
                    })
                }
            </div>

        </animated.div>

    );

}
