// Helper library for processing time.
import moment from "moment/moment";

/**
 * Gets jobs from the SQL database for a given interval.
 *
 * @param {string} start - The starting date ('YYYY-MM-DD').
 * @param {string} end - The ending date ('YYYY-MM-DD').
 *
 * @return All jobs for a given interval.
 */
export async function getJobsInterval(start, end) {
	// The data being passed into the API.
	const postData = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
	};

	// Gets the data.
	try {
		// Accesses the jobs API.
		const res = await fetch(
			`${window.location.origin}/api/jobs/${start}:${end}`,
			postData
		);
		const response = await res.json();

		// Stores the value.
		return response;
	} catch (e) {}

	return { started: [], ended: [] };
}

/**
 * Gets machines from the SQL database for a given interval.
 *
 * @param {string} start - The starting date ('YYYY-MM-DD').
 * @param {string} end - The ending date ('YYYY-MM-DD').
 *
 * @return All machines for a given interval.
 */
export async function getMachinesInterval(start, end) {
	// The data being passed into the API.
	const postData = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
	};

	// Gets the data.
	try {
		// Accesses the jobs API.
		const res = await fetch(
			`${window.location.origin}/api/machines/${start}:${end}`,
			postData
		);
		const response = await res.json();

		// Stores the value.
		return response;
	} catch (e) {}

	return { started: [], ended: [] };
}

/**
 * Gets machines from the SQL database.
 *
 * @returns Object containing machine data.
 */
export async function getMachines() {
	// The data being passed into the API.
	const postData = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
	};

	// Gets the data.
	try {
		// Accesses the jobs API.
		const res = await fetch(`${window.location.origin}/api/machines`, postData);
		const response = await res.json();

		// Stores the value.
		return response;
	} catch (e) {}

	return [];
}

/**
 * Gets buildings from the SQL database.
 *
 * @returns Object containing building data.
 */
export async function getBuildings() {
	// The data being passed into the API.
	const postData = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
	};

	// Gets the data.
	try {
		// Accesses the jobs API.
		const res = await fetch(
			`${window.location.origin}/api/buildings`,
			postData
		);
		const response = await res.json();

		// Stores the value.
		return response;
	} catch (e) {}

	return [];
}

/**
 * Finds a history of everything that happened in the shop between two dates.
 *
 * @param {string} start - A string representation of the starting date ('YYYY-MM-DD').
 * @param {string} end  - A string representation of the ending date ('YYYY-MM-DD').
 *
 * @returns An object containing a log of everything that happened.
 */
export async function getLog(start, end) {
	// Gets all jobs that started or ended in that interval.
	let jobs = await getJobsInterval(start, end);

	// Gets all machines that started or ended in that interval.
	let machines = await getMachinesInterval(start, end);

	// Gets all machines currently running.
	let current_machines = await getMachines();

	// Gets all buildings.
	let current_buildings = await getBuildings();

	// FIND LOG OF "CREATED" JOBS:

	// Array to hold the log.
	let created_jobs = [];

	// Finds all job entries from the database that were "created".
	let created_job_entries = jobs.started.filter((entry) => {
		return entry.log == 0 || entry.log == 2;
	});

	// Iterates through all the entries.
	for (let i = 0; i < created_job_entries.length; i++) {
		// Stores the entry in an object.
		let job = created_job_entries[i];

		// Creates a log for the entry.
		let log = {
			timestamp: job.start,
			action: "created job",
			user: getUser(job.starter),
			machine: getMachine(job.machine, { machines: current_machines }),
			op: job.op,
			notes: job.notes,
			state: getJobState(job.state),
			priority: getJobPriority(job.priority),
		};

		// Adds it to the log.
		created_jobs.push(log);
	}

	// FIND LOG OF ALL "UPDATED" JOBS:

	// Array to hold the log.
	let updated_jobs = [];

	// Finds all job entries from the database that were "updated".
	let updated_job_entries = jobs.started.filter((entry) => {
		return entry.log == 1 || entry.log == 3;
	});

	// Iterates through all the entries.
	for (let i = 0; i < updated_job_entries.length; i++) {
		// Stores the entry in an object.
		let job = updated_job_entries[i];

		// Find the last version of the job before it was updated.
		let old_versions = jobs.ended.filter((entry) => {
			return entry.id == job.id && entry.start < job.start;
		});
		let previous_version = old_versions[old_versions.length - 1];

		// Create a log for the update.
		let log = {
			timestamp: job.start,
			action: "updated job",
			user: getUser(job.starter),
			machine: getMachine(job.machine, { machines: current_machines }),
			changes: {},
		};

		// Store all changes from the previous version.
		if (previous_version != undefined) {
			if (job.op != previous_version.op)
				log.changes.op = { new: job.op, old: previous_version.op };
			if (job.notes != previous_version.notes)
				log.changes.notes = { new: job.notes, old: previous_version.notes };
			if (job.state != previous_version.state)
				log.changes.state = {
					new: getJobState(job.state),
					old: getJobState(previous_version.state),
				};
			if (job.priority != previous_version.priority)
				log.changes.priority = {
					new: getJobPriority(job.priority),
					old: getJobPriority(previous_version.priority),
				};
		} else {
			log.changes.op = { new: job.op, old: "UNKNOWN" };
			log.changes.notes = { new: job.notes, old: "UNKNOWN" };
			log.changes.state = { new: getJobState(job.state), old: "UNKNOWN" };
			log.changes.priority = {
				new: getJobPriority(job.priority),
				old: "UNKNOWN",
			};
		}

		// Add the object to the log.
		updated_jobs.push(log);
	}

	// FIND LOG OF ALL "DELETED" JOBS:

	// Array to hold the log.
	let deleted_jobs = [];

	// Finds all job entries from the database that were "deleted".
	let deleted_job_entries = jobs.ended.filter((entry) => {
		return entry.log == 2 || entry.log == 3;
	});

	// Iterates through all the entries.
	for (let i = 0; i < deleted_job_entries.length; i++) {
		// Stores the entry in an object.
		let job = deleted_job_entries[i];

		// Creates a log entry for the entry.
		let log = {
			timestamp: job.end,
			action: "deleted job",
			user: getUser(job.ender),
			machine: getMachine(job.machine, { machines: current_machines }),
			op: job.op,
			notes: job.notes,
			state: getJobState(job.state),
			priority: getJobPriority(job.priority),
		};

		// Adds the entry to the log.
		deleted_jobs.push(log);
	}

	// FIND LOG OF ALL "CREATED" MACHINES:

	// The array to hold the log.
	let created_machines = [];

	// Finds all machine entries from the database that were "updated".
	let created_machine_entries = machines.started.filter((entry) => {
		return entry.log == 0 || entry.log == 2;
	});

	// Iterates through all the entries.
	for (let i = 0; i < created_machine_entries.length; i++) {
		// Stores the entry in an object.
		let machine = created_machine_entries[i];

		// Creates a log object for the entry.
		let log = {
			timestamp: machine.start,
			action: "created machine",
			name: machine.name,
			building: getBuilding(machine.building, { buildings: current_buildings }),
			width: machine.width,
			height: machine.height,
			xpos: machine.xpos,
			ypos: machine.ypos,
			state: getMachineState(machine.state),
			user: getUser(machine.starter),
		};

		// Adds the entry to the log.
		created_machines.push(log);
	}

	// FIND LOG OF ALL "UPDATED" MACHINES:

	// The array to hold the log.
	let updated_machines = [];

	// Finds all machine entries from the database that were "updated".
	let updated_machine_entries = machines.started.filter((entry) => {
		return entry.log == 1 || entry.log == 3;
	});

	// Iterates through all the entries.
	for (let i = 0; i < updated_machine_entries.length; i++) {
		// Stores the entry in an object.
		let machine = updated_machine_entries[i];

		// Finds the last version of the machine before it was updated.
		let old_versions = machines.ended.filter((entry) => {
			return entry.code == machine.code && entry.start < machine.start;
		});
		let previous_version = old_versions[old_versions.length - 1];

		// Creates a log object for the entry.
		let log = {
			timestamp: machine.start,
			action: "updated machine",
			name: machine.name,
			user: getUser(machine.starter),
			changes: {},
		};

		// Store all changes from the previous version.
		if (previous_version != undefined) {
			if (machine.state != previous_version.state)
				log.changes.state = {
					new: getMachineState(machine.state),
					old: getMachineState(previous_version.state),
				};
		} else {
			log.changes.state = {
				new: getMachineState(machine.state),
				old: "UNKNOWN",
			};
		}

		// Adds the entry to the log.
		updated_machines.push(log);
	}

	// MERGES "LIST" TOGETHER.

	// Create the merged list.
	let merged = [
		...created_jobs,
		...updated_jobs,
		...deleted_jobs,
		...created_machines,
		...updated_machines,
	];

	// Sorts the log by timestamp.
	merged = merged.sort((a, b) => {
		return new Date(b.timestamp) - new Date(a.timestamp);
	});

	// RETURN THE OUTPUT:

	return merged;
}

/**
 * Gets the user name given their ID.
 *
 * @param {number} id - The ID of the user.
 *
 * @returns The name of the user.
 */
function getUser(id) {
	// Based on user ID, return name.
	if (id == 1) return "Kevin";
	if (id == 2) return "Chase";
	if (id == 3) return "Ernie";
	if (id == 4) return "Rocky";
	if (id == 5) return "Gerardo";
	if (id == 6) return "Nick";

	// If the user isn't found, return N/A.
	return "N/A";
}

/**
 * Gets the name of a machine given its code.
 *
 * @param {string} code - The code of the machine.
 *
 * @returns The name of the machine.
 */
function getMachine(code, { machines }) {
	return machines.find((machine) => {
		return machine.code == code;
	}).name;
}

/**
 * Gets the name of a building given its code.
 *
 * @param {string} code - The code of the building.
 *
 * @returns The name of the building.
 */
function getBuilding(code, { buildings }) {
	return buildings.find((building) => {
		return building.code == code;
	}).name;
}

/**
 * Gets a string version of a job's state given a number.
 *
 * @param {number} state - The state of the job as a number.
 *
 * @returns The name of the state.
 */
function getJobState(state) {
	if (state == 0) return "NOW";
	if (state == 1) return "ON HOLD";
	if (state == 2) return "NEXT";
	if (state == 3) return "DONE";
	else return "N/A";
}

/**
 * Gets a string version of a job's priority given a number.
 *
 * @param {number} priority - The priority of the job as a number.
 *
 * @returns The name of the priority.
 */
function getJobPriority(priority) {
	if (priority == 0) return "FALSE";
	if (priority == 1) return "TRUE";
	else return "N/A";
}

/**
 * Gets a string version of a machine's state given a number.
 *
 * @param {number} state - The state of the machine as a number.
 *
 * @returns The name of the state.
 */
function getMachineState(state) {
	if (state == 0) return "Operational";
	if (state == 1) return "Out of Order";
	if (state == 2) return "Priority";
	else return "N/A";
}

export function sortLogByDate(log) {
	// The output object.
	let output = {};

	// Iterates through the log in chronological order.
	for (let i = 0; i < log.length; i++) {
		// Stores the entry in an object.
		let entry = log[i];

		// Finds the date for the entry.
		let date = moment.utc(entry.timestamp).format("YYYY-MM-DD");

		// If this is the first entry for that date, create an array for that date in the output object.
		if (output[date] == undefined) output[date] = [];

		// Push the job to its date in output.
		output[date].push(entry);
	}

	// Return the sorted object.
	return output;
}

export function runFilter(log, filter) {
	let filteredLog = [];

	for (let i = 0; i < log.length; i++) {
		let entry = log[i];

		let date = moment.utc(entry.timestamp).format("MMMM DD, YYYY");
		let time = moment.utc(entry.timestamp).format("h:mm:ss A");

		if (entry.action == "created job") {
			if (
				listIncludes(
					[
						date,
						time,
						entry.action,
						entry.machine,
						entry.op,
						entry.notes,
						entry.state,
						entry.user,
					],
					filter
				)
			)
				filteredLog.push(log[i]);
		} else if (entry.action == "updated job") {
			let changes = [];
			if (entry.changes.op != undefined) {
				changes.push(entry.changes.op.new);
				changes.push(entry.changes.op.old);
			}
			if (entry.changes.notes != undefined) {
				changes.push(entry.changes.notes.new);
				changes.push(entry.changes.notes.old);
			}
			if (entry.changes.state != undefined) {
				changes.push(entry.changes.state.new);
				changes.push(entry.changes.state.old);
			}

			if (
				listIncludes(
					[date, time, entry.action, entry.machine, entry.user, ...changes],
					filter
				)
			)
				filteredLog.push(log[i]);
		} else if (entry.action == "deleted job") {
			if (
				listIncludes(
					[
						date,
						time,
						entry.action,
						entry.machine,
						entry.op,
						entry.notes,
						entry.state,
						entry.user,
					],
					filter
				)
			)
				filteredLog.push(log[i]);
		} else if (entry.action == "created machine") {
			if (
				listIncludes(
					[
						date,
						time,
						entry.action,
						entry.name,
						entry.building,
						entry.state,
						`(${entry.xpos}, ${entry.ypos})`,
						`${entry.width}x${entry.height}`,
						entry.user,
					],
					filter
				)
			)
				filteredLog.push(log[i]);
		} else if (entry.action == "updated machine") {
			let changes = [];
			if (entry.changes.state != undefined) {
				changes.push(entry.changes.state.new);
				changes.push(entry.changes.state.old);
			}

			if (
				listIncludes(
					[date, time, entry.action, entry.name, entry.user, ...changes],
					filter
				)
			)
				filteredLog.push(log[i]);
		}
	}

	return filteredLog;
}

function listIncludes(list, text) {
	for (let i = 0; i < list.length; i++) {
		let item = list[i];
		if (item.toUpperCase().includes(text.toUpperCase())) return true;
	}
	return false;
}
