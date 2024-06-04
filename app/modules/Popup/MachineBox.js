// React hooks.
import { useState, useEffect } from "react";

// Custom helper functions for dealing with changes.
import { getEditedJobs, getEditedMachine } from "../Machine/DataHelper";

import { motion } from "framer-motion";

// Job components to be displayed.
import Job from "./Job";

// A negative counter to give to new jobs as IDs.
let newJobCounter = -1;

/**
 * MACHINE BOX DEFAULT EXPORT
 *
 * Contents for view/edit machine popup boxes.
 *
 * @returns A JSX representation of the Machine Box.
 */
export default function MachineBox({
	popupState,
	machine,
	jobs,
	changes,
	user,
	doAction,
}) {
	// REACT HOOKS

	// React hook tracking the two input values.
	const [jobOp, setJobOp] = useState("");
	const [jobNotes, setJobNotes] = useState("");

	// React hook tracking the current job being edited.
	const [selectedJob, setSelectedJob] = useState(0);

	// React hook tracking a jobs list including changes.
	const [editedJobs, setEditedJobs] = useState([]);
	const [editedMachine, setEditedMachine] = useState({});

	// Updates editedJobs every time the jobs or changes update.
	useEffect(() => {
		setEditedJobs(getEditedJobs({ data: machine, jobs, changes }));
	}, [jobs, changes]);

	// Updates editedMachine every time the machine or changes update.
	useEffect(() => {
		setEditedMachine(getEditedMachine({ data: machine, changes }));
	}, [machine, changes]);

	// DESELECTS A JOB

	function deselect() {
		if (selectedJob != 0)
			doAction("setJob", [machine.code, selectedJob, jobOp, jobNotes]);
		setSelectedJob(0);
	}

	// JSX (RETURN VALUE)

	return (
		<>
			{/* BACKGROUND */}

			<div
				className="fixed w-full h-[120%] bg-black opacity-50"
				onClick={() => {
					// If a job was being edited, save it and deselect it.
					if (popupState == 2 && selectedJob != 0) {
						deselect();
					}

					// Do an action to close the box.
					doAction("closePopup", []);
				}}
			/>

			{/* BOX */}

			<motion.div
				initial={{ scale: 0.9 }}
				animate={{ scale: 1 }}
				exit={{ scale: 0.9 }}
				className="relative w-11/12 max-w-xl mx-auto bg-white top-[10%] h-[140vw] max-h-[80%] rounded-xl shadow-xl overflow-hidden"
			>
				{/* CONTENT (largely to avoid problems with scroll bar.) */}

				<div
					className="w-full h-full overflow-auto"
					onClick={(e) => {
						if (e.target == e.currentTarget) deselect();
					}}
				>
					{/* THE HEADER (title, state, menu) */}

					<MachineHeader
						popupState={popupState}
						machine={editedMachine}
						setSelectedJob={setSelectedJob}
						deselect={deselect}
						doAction={doAction}
					/>

					{/* THE JOBS */}

					<JobBox
						popupState={popupState}
						machine={editedMachine}
						jobs={editedJobs}
						user={user}
						setJobOp={setJobOp}
						setJobNotes={setJobNotes}
						selectedJob={selectedJob}
						setSelectedJob={setSelectedJob}
						deselect={deselect}
						doAction={doAction}
					/>
				</div>
			</motion.div>
		</>
	);
}

/**
 * MACHINE HEADER
 *
 * Contents for the header of a Machine Box.
 *
 * @param {number} popupState - The state of the popup (edit or view).
 * @param {Object} machine - The Machine being displayed.
 * @param {Function} setSelectedJob - Sets the selectedJob hook.
 * @param {Function} deselect - Deselects & saves the current job.
 * @param {Function} doAction - Does an action.
 *
 * @returns A JSX representation of the Machine Header.
 */
function MachineHeader({
	popupState,
	machine,
	setSelectedJob,
	deselect,
	doAction,
}) {
	// CALCULATIONS

	// Calculates the machine state text using its state value.
	let state;
	if (machine.state == 0) state = popupState == 2 ? "OPERATIONAL" : "";
	if (machine.state == 1) state = "OUT OF ORDER";
	if (machine.state == 2) state = "PRIORITY";

	// JSX (RETURN VALUE)

	return (
		<div className="relative">
			{/* This includes the menu buttons if the popup is in edit mode. */}

			{/* Left menu buttons */}
			<div className="absolute top-0 flex left-2">
				{/* Priority Button */}
				{popupState == 2 && (
					<img
						className="w-8 cursor-pointer sm:w-12"
						src={
							machine.state == 2
								? "/icons/google/star_filled.svg"
								: "/icons/google/star_empty.svg"
						}
						title={machine.state == 2 ? "Unset as Priority" : "Set as Priority"}
						alt="Priority Button"
						onClick={() => {
							doAction("setMachine", ["state", 2]);
							deselect();
						}}
					/>
				)}

				{/* Out of Order Button */}
				{popupState == 2 && (
					<img
						className="w-8 cursor-pointer sm:w-12"
						src={
							machine.state == 1
								? "/icons/google/broken_filled.svg"
								: "/icons/google/broken_empty.svg"
						}
						title={
							machine.state == 1 ? "Set as Operational" : "Set as Out of Order"
						}
						alt="Out of Order Button"
						onClick={() => {
							doAction("setMachine", ["state", 1]);
							deselect();
						}}
					/>
				)}
			</div>

			{/* Right menu buttons */}
			<div className="absolute top-0 flex right-2">
				{/* Undo Button */}
				{popupState == 2 && (
					<img
						className="w-8 cursor-pointer sm:w-12"
						src="/icons/google/undo.svg"
						title="Undo Changes"
						alt="Revert Button"
						onClick={() => {
							setSelectedJob(0);
							doAction("undo", [machine.code]);
						}}
					/>
				)}

				{/* Close Button */}
				<img
					className="w-8 cursor-pointer sm:w-12"
					src="/icons/google/close.svg"
					title="Close"
					alt="Close Button"
					onClick={() => {
						deselect();
						doAction("closePopup", []);
					}}
				/>
			</div>

			{/* Machine Name */}
			<h1
				className="m-3 mb-0 text-2xl font-bold text-center sm:mb-1 sm:text-3xl"
				onClick={deselect}
			>
				{machine.name}
			</h1>

			{/* Machine State */}
			<h2
				className={`px-3 w-fit rounded-md font-light text-center mx-auto text-lg sm:text-xl ${
					machine.newState && "bg-green-300"
				}`}
				onClick={deselect}
			>
				{state}
			</h2>
		</div>
	);
}

/**
 * JOB BOX
 *
 * Components for the job list in a Machine Box.
 *
 * @param {number} popupState - The state of the popup (edit or view).
 * @param {Object} machine - The Machine being displayed.
 * @param {Object} jobs - The list of Jobs on a given machine.
 * @param {Function} setJobOp - Set the value of the jobOp hook.
 * @param {Function} setJobNotes - Set the value of the jobNotes hook.
 * @param {number} selectedJob - The job currently selected.
 * @param {Function} setSelectedJob - Sets the value of the selectedJob hook.
 * @param {Function} deselect - Saves & deselects the currently selected job.
 * @param {Function} doAction - Does an action.
 *
 * @returns A JSX representation of the job list.
 */
function JobBox({
	popupState,
	machine,
	jobs,
	user,
	setJobOp,
	setJobNotes,
	selectedJob,
	setSelectedJob,
	deselect,
	doAction,
}) {
	// Separates jobs into categories.
	let currentJobs = jobs
		.filter((job) => {
			return job.state == 0;
		})
		.sort((a, b) => {
			return new Date(b.start) - new Date(a.start);
		});

	currentJobs = [
		...currentJobs.filter((job) => job.priority == 1),
		...currentJobs.filter((job) => job.priority == 0),
	];

	let queuedJobs = jobs
		.filter((job) => {
			return job.state == 2;
		})
		.sort((a, b) => {
			return new Date(b.start) - new Date(a.start);
		});

	queuedJobs = [
		...queuedJobs.filter((job) => job.priority == 1),
		...queuedJobs.filter((job) => job.priority == 0),
	];

	let completedJobs = jobs
		.filter((job) => {
			return job.state == 3;
		})
		.sort((a, b) => {
			return new Date(b.start) - new Date(a.start);
		});

	completedJobs = [
		...completedJobs.filter((job) => job.priority == 1),
		...completedJobs.filter((job) => job.priority == 0),
	];

	/**
	 * Returns the JSX for one category of jobs.
	 *
	 * @param {string} title - The name of the category (include a colon if needed).
	 * @param {Array} list - The list of jobs for the category.
	 * @param {number} state - The state (0 or 2) for the category.
	 *
	 * @returns The JSX representation for a category of jobs.
	 */
	function GetCategory(title, list, state) {
		return (
			<>
				{/* HEADER */}
				<h3
					className="mt-3 ml-3 text-xl font-bold sm:ml-5 sm:text-2xl"
					onClick={deselect}
				>
					{title}
				</h3>

				{/* JOB LIST */}
				<ul className="mt-2 mb-5 ml-3 mr-3 space-y-1">
					{/* Maps each current job to a list entry. */}
					{list.map((job) => (
						<Job
							key={job.id}
							popupState={popupState}
							job={job}
							setJobOp={setJobOp}
							setJobNotes={setJobNotes}
							selectedJob={selectedJob}
							setSelectedJob={setSelectedJob}
							deselect={deselect}
							doAction={doAction}
						/>
					))}
				</ul>

				{/* ADD BUTTON (if in edit mode) */}
				{popupState == 2 && state != 3 && (
					<div
						className="relative w-16 my-6 text-xl text-center transition-colors border border-black rounded-md shadow-md cursor-pointer left-5 sm:left-7 hover:bg-green-300"
						title="Create New Job"
						onClick={() => {
							deselect();
							doAction("createJob", [
								machine.code,
								newJobCounter,
								"New Job",
								"",
								state,
								0,
							]);
							setSelectedJob(newJobCounter);
							setJobOp("New Job");
							setJobNotes("");
							newJobCounter--;
						}}
					>
						+
					</div>
				)}
			</>
		);
	}

	// JSX (RETURN VALUE)

	return (
		<>
			{/* CURRENT JOB LIST */}
			{(currentJobs.length > 0 || popupState == 2) &&
				GetCategory("NOW", currentJobs, 0)}

			{/* QUEUED JOB LIST */}
			{(queuedJobs.length > 0 || popupState == 2) &&
				GetCategory("NEXT", queuedJobs, 2)}

			{/* COMPLETED JOB LIST */}
			{(completedJobs.length > 0 || popupState == 2) &&
				GetCategory("DONE", completedJobs, 3)}
		</>
	);
}
