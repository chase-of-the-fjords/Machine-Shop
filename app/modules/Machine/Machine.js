// IMPORTS

// Two common React hooks.
import { useEffect, useState, useMemo } from "react";

// A custom hook for finding window dimensions.
import useWindowDimensions from "../CustomHooks/useWindowDimensions";

// Custom functions for finding edits machine & jobs data.
import { getEditedJobs, getEditedMachine } from "./DataHelper";

import { motion } from "framer-motion";

import Dotdotdot from "react-dotdotdot";

/**
 * MACHINE: DEFAULT EXPORT
 *
 * @param {Object} data - The JSON data for this specific machine.
 * @param {Array} jobs - The JSON data for all the jobs for this machine.
 * @param {Object} changes - An object containing all edits currently being made.
 * @param {Array} updated - An array tracking if machines have been updated.
 * @param {string} selectedMachine - The code of the currently selected machine.
 * @param {Function} doAction - A function passed in to do some action.
 *
 * @returns {Object} JSX representation of the machine.
 */
export default function Machine({
	data,
	jobs,
	changes,
	updated,
	selectedMachine,
	doAction,
}) {
	// REACT HOOKS

	// A hook containing JSON data for the machine, edited with changes from the "changes" object.
	const [editedData, setEditedData] = useState({});

	// A hook containing JSON data for the machine's jobs, edited with changes from the "changes" object.
	const [editedJobs, setEditedJobs] = useState([]);

	// A hook containing the height and width of the window.
	const { height, width } = useWindowDimensions();

	// Whenever the data or changes object change, updates the editedData hook.
	useEffect(() => {
		setEditedData(getEditedMachine({ data, changes }));
	}, [data, changes]);

	// Whenever the data, jobs, or changes object change, updates the editedJobs hook.
	useEffect(() => {
		setEditedJobs(getEditedJobs({ data, jobs, changes }));
		console.log(data.name + ": " + lineHeight);
	}, [data, jobs, changes]);

	// SIZING AND STYLING

	// The size of the machine in pixels, and the buffer size around the edges of the machines.
	// Changes based on the width of the screen.
	let machine_size = useMemo(
		() => (width < 640 ? (width <= 500 ? 75 : 100) : 120),
		[width]
	);
	let machine_buffer = useMemo(
		() => (width < 640 ? (width <= 500 ? 3 : 4) : 5),
		[width]
	);

	// The height and width of the machine in pixels.
	const machine_width = useMemo(
		() => editedData.width * machine_size - machine_buffer,
		[editedData, machine_size, machine_buffer]
	);
	const machine_height = useMemo(
		() => editedData.height * machine_size - machine_buffer,
		[editedData, machine_size, machine_buffer]
	);

	// The position of the machine on the screen.
	const x = useMemo(
		() => machine_buffer + editedData.xpos * machine_size,
		[machine_buffer, editedData, machine_size]
	);
	const y = useMemo(
		() => machine_buffer + editedData.ypos * machine_size,
		[machine_buffer, editedData, machine_size]
	);

	const lineHeight = useMemo(() => {
		let jobcount = editedJobs.filter((job) => {
			return job.state == 0;
		}).length;
		let totalspace = machine_height - 15 - (jobcount - 1) * 8;
		let totallines = Math.floor(totalspace / 12);
		console.log(data.name + ": " + Math.floor(totallines / jobcount));
		return Math.floor(totallines / jobcount);
	}, [data, jobs, changes, machine_height]);

	const maxJobs = useMemo(() => {
		let totalspace = Math.floor((machine_height - 15) / 18);
		console.log(data.name + " max: " + totalspace);
		return totalspace;
	}, [data, jobs, changes, machine_height]);

	// Applies the above values to a style object.
	let style = {
		width: `${machine_width}px`,
		height: `${machine_height}px`,
		top: `${y}px`,
		left: `${x}px`,
		zIndex: `${editedData.ypos * 2}`,
	};

	// The set of styles applied based on the machine's state, etc.
	// - Sets the machine's main style by default.
	// - If the state is 1, that means the machine is out of order, so the out_of_order style is applied.
	// - If the machine has been updated, the updated style is applied.
	// - If the machine has been modified & its unsaved, the unsaved style is applied.
	// - If the machine is currently selected, the selected style is applied.
	let machineStyles = {
		basic: "absolute rounded-md transition-[box,background-color]",
		working: "shadow-md",
		oos: "opacity-40 cursor-not-allowed",
	};

	let colorStyles = {
		basic: "bg-gray-50 hover:bg-gray-100",
		oos: "bg-gray-50",
		priority: "bg-yellow-200 hover:bg-yellow-300",
		unsaved: "bg-green-200 hover:bg-green-300",
		selected: "bg-blue-400",
	};

	let smalltextStyles = {
		basic: "text-gray-600",
		oos: "text-gray-600",
		priority: "text-yellow-800",
		unsaved: "text-green-800",
		selected: "text-blue-800",
	};

	let machine_color = colorStyles.basic;
	let smalltext_color = smalltextStyles.basic;

	if (editedData.code == selectedMachine) {
		machine_color = colorStyles.selected;
		smalltext_color = smalltextStyles.selected;
	} else if (editedData.unsaved) {
		machine_color = colorStyles.unsaved;
		smalltext_color = smalltextStyles.unsaved;
	} else if (editedData.state == 1) {
		machine_color = colorStyles.oos;
		smalltext_color = smalltextStyles.oos;
	} else if (editedData.state == 2) {
		machine_color = colorStyles.priority;
		smalltext_color = smalltextStyles.priority;
	}

	const buttonVariants = {
		workingHover: { marginTop: "-4px" },
		oosHover: {},
	};

	// JSX (RETURN VALUE)

	return (
		<>
			{/*
			 * The main element for the machine. Uses a button to make it naturally clickable.
			 *
			 * key: The code for the machine (i.e. H3, OB, or ma)
			 * className: The set of classes for the stylesheet, calculated above.
			 * style: Sets the height, width, and position.
			 * onClick: Does a "clickMachine" action upon being clicked.
			 */}
			<motion.button
				whileHover={editedData.state == 1 ? "oosHover" : "workingHover"}
				whileTap={{ marginTop: "0px" }}
				transition={{ duration: 0.15 }}
				variants={buttonVariants}
				key={data.code}
				className={`${machineStyles.basic} 
                            ${machine_color}
                            ${
															editedData.state == 1
																? machineStyles.oos
																: machineStyles.working
														}`}
				style={style}
				onClick={() => doAction("clickMachine", [data.code])}
			>
				{/* If the machine is a priority, adds a star. */}
				{updated[data.code] && (
					<img
						className="absolute w-3 top-[1px] left-[1px] sm:w-4"
						src="/icons/google/alert.svg"
						alt="Updated"
					/>
				)}

				{/* The name of the machine in the top-right corner. */}
				<div
					className={`absolute text-xs top-[1px] right-[2px] ${smalltext_color}`}
				>
					{data.name}
				</div>

				{/* The star for prioritized machines */}
				{editedData.state == 2 && !updated[data.code] && (
					<img
						className={`absolute w-3 top-[1px] left-[1px] sm:w-4`}
						src="/icons/google/star_filled.svg"
					/>
				)}

				{/* The div that contains the text for the jobs. */}
				{/* <div className="mb-0 text-sm font-bold sm:text-lg">
                    { getCurrentJobsText(editedJobs) }
                </div>*/}

				<div className="flex-col w-full px-1 pt-3 space-y-[2px] text-xs text-[10px] font-medium leading-none text-center align-middle sm:leading-3 sm:space-y-2 sm:text-sm gap-y-2">
					{editedJobs.map((job, i) => {
						if (job.state == 0)
							if (i < maxJobs - 1)
								return (
									<Dotdotdot
										clamp={lineHeight == 0 ? 1 : lineHeight}
										key={job.id + "/" + lineHeight}
									>
										{job.op}
									</Dotdotdot>
								);
							else if (i == maxJobs - 1) return <div>+ more</div>;
					})}
					{}
				</div>

				{/* The div that contains the text for the queued jobs. */}
				{/* <div className={`text-xs italic text-gray-700 ${smalltext_color}`}>
					{getQueuedJobsText(editedJobs)}
				</div> */}
			</motion.button>
		</>
	);
}

// HELPER FUNCTIONS

/**
 * GET CURRENT JOBS TEXT
 *
 * Given a list of jobs, get text to display on the machine representing the current jobs.
 *
 * @param {Array} jobs - The JSON data for the jobs for the machine.
 *
 * @returns {string} "X job(s)" depending on count of current jobs.
 */
function getCurrentJobsText(jobs) {
	// Make sure there are jobs to display.
	if (jobs.length > 0) {
		// Filters through the jobs to find "currently running" jobs.
		let currentJobs = jobs.filter((job) => {
			return job.state == 0 && !job.deleted;
		});

		// Returns "X job(s)", or nothing, depending on the quantity.
		if (currentJobs.length == 0) return "";
		if (currentJobs.length == 1) return "1 job";
		return currentJobs.length + " jobs";
	}

	// If there are no jobs, return an empty string.
	return "";
}

/**
 * GET QUEUED JOBS TEXT
 *
 * Given a list of jobs, get text to display on the machine representing the queued jobs.
 *
 * @param {Array} jobs - The JSON data for the jobs for the machine.
 *
 * @returns {string} "X job(s)" depending on count of queued jobs.
 */
function getQueuedJobsText(jobs) {
	// Make sure there are jobs to display.
	if (jobs.length > 0) {
		// Filters through the jobs to find "queued" jobs.
		let queuedJobs = jobs.filter((job) => {
			return job.state == 2 && !job.deleted;
		});

		// Returns "X job(s) queued", or nothing, depending on the quantity.
		if (queuedJobs.length == 0) return "";
		if (queuedJobs.length == 1) return "1 job next";
		return queuedJobs.length + " jobs next";
	}

	// If there are no jobs, return an empty string.
	return "";
}
