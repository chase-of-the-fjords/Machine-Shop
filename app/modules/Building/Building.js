// IMPORTS

import { useMemo } from "react";

// Imports the machine component.
import Machine from "../Machine/Machine";

// A custom hook for finding window dimensions.
import useWindowDimensions from "../CustomHooks/useWindowDimensions";

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
export default function Building({
	data,
	machines,
	jobs,
	changes,
	updated,
	selectedMachine,
	doAction,
	jobDisplay,
}) {
	const decorations = data.decorations;

	// REACT HOOKS

	// A hook containing the height and width of the window.
	const { height, width } = useWindowDimensions();

	// SIZING AND STYLING

	let machine_size = width < 640 ? (width <= 500 ? 75 : 100) : 120;
	let machine_buffer = width < 640 ? (width <= 500 ? 3 : 4) : 5;

	let container_style = {
		// Sets the width based off the JSON data for the building. 100px is added as padding.
		width: `${data.width * machine_size + (width < 700 ? 4 : 100)}px`,
	};

	let building_style = {
		/* Width and height are set based off of data from the SQL database. */
		width: `${data.width * machine_size}px`,
		height: `${data.height * machine_size}px`,
		padding: `${machine_buffer / 2}px`,
	};

	// JSX (RETURN VALUE)

	return (
		// The main div for the building. It's animated with the springs animation defined above.
		<div
			className="inline-block mb-10 transition-[width]"
			style={container_style}
		>
			{/* The header that contains the name of the building. */}
			<h2 className="mb-3 text-xl font-semibold text-center sm:text-2xl">
				{data.name}
			</h2>

			{/* The div that contains the actual building. */}
			<div
				className="box-content relative mx-auto transition-all rounded-md shadow-lg bg-cool-grey-200"
				style={building_style}
			>
				{
					/*
					 * Creates a machine component from each machine in the data.
					 */
					machines.map((machine) => {
						return (
							<Machine
								key={machine.code}
								data={machine}
								jobs={
									/* Filters for only jobs for the given machine. */
									jobs.filter((job) => {
										return job.machine == machine.code;
									})
								}
								changes={changes}
								updated={updated}
								doAction={doAction}
								selectedMachine={selectedMachine}
								jobDisplay={jobDisplay}
							/>
						);
					})
				}
				{decorations.map((decoration, i) => {
					return (
						<Decoration
							xpos={decoration.x}
							ypos={decoration.y}
							rotation={decoration.rotation}
							key={i}
						/>
					);
				})}
			</div>
		</div>
	);
}

function Decoration({ xpos, ypos, rotation }) {
	// A hook containing the height and width of the window.
	const { height, width } = useWindowDimensions();

	// SIZING AND STYLING

	// The size of the machine in pixels, and the buffer size around the edges of the machines.
	// Changes based on the width of the screen.
	let dec_size = useMemo(
		() => (width < 640 ? (width <= 500 ? 75 : 100) : 120),
		[width]
	);
	let dec_buffer = useMemo(
		() => (width < 640 ? (width <= 500 ? 3 : 4) : 5),
		[width]
	);

	// The height and width of the decoration in pixels.
	const dec_width = useMemo(
		() => dec_size - dec_buffer,
		[dec_size, dec_buffer]
	);
	const dec_height = useMemo(
		() => dec_size - dec_buffer,
		[dec_size, dec_buffer]
	);

	// The xpos and ypos of the decoration in pixels.
	const dec_x = useMemo(
		() => dec_buffer + xpos * dec_size,
		[dec_size, dec_buffer]
	);
	const dec_y = useMemo(
		() => dec_buffer + ypos * dec_size,
		[dec_size, dec_buffer]
	);

	// Applies the above values to a style object.
	let style = {
		width: `${dec_width}px`,
		height: `${dec_height}px`,
		top: `${dec_y}px`,
		left: `${dec_x}px`,
		rotate: `${rotation}deg`,
	};

	return (
		<>
			<svg
				viewBox="0 0 122.353 122.354"
				style={style}
				className="absolute p-3 min-[640px]:p-4 fill-cool-grey-100"
			>
				<g>
					<path
						d="M36.913,86.333c6.3-0.399,11.4-6.8,14.2-16.1c0.6-2-1-3.9-3.1-3.8l-24.7,1.6c-2.1,0.1-3.4,2.3-2.6,4.2
			C24.613,81.133,30.613,86.733,36.913,86.333z"
					/>
					<path
						d="M49.513,55.333c3.1-0.2,5.6-2.8,5.6-6c0-4.9,0.5-10.4,1.3-16.4c1.9-13.7-1.5-32-18.6-32.9c-20.9-1.1-24.5,25.3-23.5,40.7
			c0.3,4.2,0.9,8.2,1.8,11.9c0.7,2.8,3.3,4.7,6.2,4.5L49.513,55.333z"
					/>
					<path
						d="M99.114,104.033l-24.7-1.6c-2.101-0.101-3.7,1.8-3.101,3.8c2.7,9.3,7.9,15.7,14.2,16.1c6.3,0.4,12.2-5.2,16.2-14.1
			C102.513,106.333,101.213,104.233,99.114,104.033z"
					/>
					<path
						d="M84.614,36.033c-17.101,0.9-20.5,19.2-18.601,32.9c0.8,6.1,1.2,11.5,1.3,16.399c0,3.2,2.5,5.8,5.601,6l27.1,1.8
			c2.9,0.2,5.5-1.699,6.2-4.5c0.9-3.699,1.6-7.699,1.8-11.899C109.114,61.333,105.513,34.933,84.614,36.033z"
					/>
				</g>
			</svg>
		</>
	);
}
