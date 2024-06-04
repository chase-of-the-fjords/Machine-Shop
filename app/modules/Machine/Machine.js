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
	jobDisplay,
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
		return Math.floor(totallines / jobcount);
	}, [data, jobs, changes, machine_height]);

	const maxJobs = useMemo(() => {
		let totalspace = Math.floor((machine_height - 15) / 18);
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
		basic: "bg-cool-grey-50 hover:bg-cool-grey-100",
		oos: "bg-cool-grey-300",
		priority: "bg-yellow-300 hover:bg-yellow-400",
		unsaved: "bg-green-200 hover:bg-green-300",
		selected: "bg-blue-400",
	};

	let smalltextStyles = {
		basic: "text-cool-grey-900",
		oos: "text-gray-600",
		priority: "text-yellow-800",
		unsaved: "text-green-800",
		selected: "text-blue-800",
	};

	let accentStyles = {
		basic: "fill-cool-grey-100 group-hover/machine:fill-cool-grey-200",
		oos: "fill-cool-grey-400 animate-none",
		priority: "fill-yellow-400 group-hover/machine:fill-yellow-500",
		unsaved: "fill-green-300 group-hover/machine:fill-green-400",
		selected: "fill-blue-500",
	};

	let machine_color = colorStyles.basic;
	let smalltext_color = smalltextStyles.basic;
	let accent_color = accentStyles.basic;

	if (editedData.code == selectedMachine) {
		machine_color = colorStyles.selected;
		smalltext_color = smalltextStyles.selected;
		accent_color = accentStyles.selected;
	} else if (editedData.unsaved) {
		machine_color = colorStyles.unsaved;
		smalltext_color = smalltextStyles.unsaved;
		accent_color = accentStyles.unsaved;
	} else if (editedData.state == 1) {
		machine_color = colorStyles.oos;
		smalltext_color = smalltextStyles.oos;
		accent_color = accentStyles.oos;
	} else if (editedData.state == 2) {
		machine_color = colorStyles.priority;
		smalltext_color = smalltextStyles.priority;
		accent_color = accentStyles.priority;
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
														} overflow-hidden group/machine`}
				style={style}
				onClick={() => doAction("clickMachine", [data.code])}
			>
				{/* If the machine is a priority, adds a star. */}
				{updated[data.code] && (
					<img
						className="absolute w-3 top-[2px] left-[2px] sm:w-4"
						src="/icons/google/alert.svg"
						alt="Updated"
					/>
				)}

				{/* The name of the machine in the top-right corner. */}
				<div
					className={`absolute text-xs top-[1px] right-[3px] ${smalltext_color}`}
				>
					{data.name}
				</div>

				{/* The star for prioritized machines */}
				{editedData.state == 2 && !updated[data.code] && (
					<img
						className={`absolute w-3 top-[2px] left-[2px] sm:w-4`}
						src="/icons/google/star_filled.svg"
					/>
				)}

				{data.code != "SAW" ? (
					<svg
						viewBox="0 0 45.973 45.973"
						className={`absolute w-36 h-36 -bottom-14 -right-14 -z-10 animate-[spin_12s_linear_infinite] transition-colors ${accent_color}`}
						style={{
							right: machine_size * -0.5,
							bottom: machine_size * -0.5,
							width: machine_size * 1.2,
							height: machine_size * 1.2,
						}}
					>
						<g>
							<g>
								<path
									d="M43.454,18.443h-2.437c-0.453-1.766-1.16-3.42-2.082-4.933l1.752-1.756c0.473-0.473,0.733-1.104,0.733-1.774
			c0-0.669-0.262-1.301-0.733-1.773l-2.92-2.917c-0.947-0.948-2.602-0.947-3.545-0.001l-1.826,1.815
			C30.9,6.232,29.296,5.56,27.529,5.128V2.52c0-1.383-1.105-2.52-2.488-2.52h-4.128c-1.383,0-2.471,1.137-2.471,2.52v2.607
			c-1.766,0.431-3.38,1.104-4.878,1.977l-1.825-1.815c-0.946-0.948-2.602-0.947-3.551-0.001L5.27,8.205
			C4.802,8.672,4.535,9.318,4.535,9.978c0,0.669,0.259,1.299,0.733,1.772l1.752,1.76c-0.921,1.513-1.629,3.167-2.081,4.933H2.501
			C1.117,18.443,0,19.555,0,20.935v4.125c0,1.384,1.117,2.471,2.501,2.471h2.438c0.452,1.766,1.159,3.43,2.079,4.943l-1.752,1.763
			c-0.474,0.473-0.734,1.106-0.734,1.776s0.261,1.303,0.734,1.776l2.92,2.919c0.474,0.473,1.103,0.733,1.772,0.733
			s1.299-0.261,1.773-0.733l1.833-1.816c1.498,0.873,3.112,1.545,4.878,1.978v2.604c0,1.383,1.088,2.498,2.471,2.498h4.128
			c1.383,0,2.488-1.115,2.488-2.498v-2.605c1.767-0.432,3.371-1.104,4.869-1.977l1.817,1.812c0.474,0.475,1.104,0.735,1.775,0.735
			c0.67,0,1.301-0.261,1.774-0.733l2.92-2.917c0.473-0.472,0.732-1.103,0.734-1.772c0-0.67-0.262-1.299-0.734-1.773l-1.75-1.77
			c0.92-1.514,1.627-3.179,2.08-4.943h2.438c1.383,0,2.52-1.087,2.52-2.471v-4.125C45.973,19.555,44.837,18.443,43.454,18.443z
			 M22.976,30.85c-4.378,0-7.928-3.517-7.928-7.852c0-4.338,3.55-7.85,7.928-7.85c4.379,0,7.931,3.512,7.931,7.85
			C30.906,27.334,27.355,30.85,22.976,30.85z"
								/>
							</g>
						</g>
					</svg>
				) : (
					<svg
						viewBox="0 0 32 32"
						className={`absolute -z-10 animate-[spin_12s_linear_infinite] group-hover/machine:animate-[spin_0.2s_linear_infinite] transition-colors ${accent_color}`}
						style={{
							right: machine_size * -0.4,
							bottom: machine_size * -0.4,
							width: machine_size * 1.2,
							height: machine_size * 1.2,
						}}
					>
						<path d="M16 1v4.5h-10.5l3 3-7.5 7.5h4.5v10.5l3-3 7.5 7.5v-4.5h10.5l-3-3 7.5-7.5h-4.5v-10.5l-3 3-7.5-7.5zM16 8.5c4.142 0 7.5 3.358 7.5 7.5s-3.358 7.5-7.5 7.5-7.5-3.358-7.5-7.5c0-4.142 3.358-7.5 7.5-7.5zM19 16c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"></path>
					</svg>
				)}

				{jobDisplay == 1 && (
					<div className="flex-col w-full font-inter text-black font-medium px-1 pt-3 space-y-[2px] text-xs text-[10px] leading-none text-center align-middle sm:leading-3 sm:space-y-2 sm:text-sm gap-y-2">
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
								else if (i == maxJobs - 1) return <div key="more">+ more</div>;
						})}
					</div>
				)}

				{jobDisplay == 0 && (
					<>
						{/* The div that contains the text for the jobs. */}
						<div className="mb-0 text-sm font-bold sm:text-lg font-roboto-mono">
							{getCurrentJobsText(editedJobs)}
						</div>

						{/* The div that contains the text for the queued jobs. */}
						<div className={`text-xs italic text-gray-700 ${smalltext_color}`}>
							{getQueuedJobsText(editedJobs)}
						</div>
					</>
				)}
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
