// This is an interactive component, so it's a client component.
"use client";

// Imports other modules.
import Building from "./Building/Building";
import Popup from "./Popup/Popup";

// Helper functions for saving & reloading.
import { reload, save } from "./Helpers/Interface";

// React hooks used later.
import { useEffect } from "react";
import { useState } from "react";

import { motion } from "framer-motion";

import Link from "next/link";

// Action functions to be passed into other components.
import {
	clickMachine,
	setMachine,
	setJob,
	createJob,
	deleteJob,
	setJobState,
	setJobPriority,
	closePopup,
	undo,
} from "./Helpers/Actions";

// Default export for the machine shop.
export default function Shop({
	type,
	machines,
	buildings,
	jobs,
	setMachines,
	setBuildings,
	setJobs,
	user,
	hasChanges,
	setHasChanges,
}) {
	// HOOKS

	// Tracks the unsaved changes when in edit mode.
	const [changes, setChanges] = useState({
		"buildings": {},
		"machines": {},
		"jobs": {},
	});

	// Tracks which machines have been updated. Initial is set to help with the first load.
	const [updated, setUpdated] = useState({ "initial": true });

	// A representation of machines in the shop to compare to updates. Immunity -1 gives infinite immunity until localStorage is imported.
	const [shopRecord, setShopRecord] = useState({
		"machines": {},
		"immune": -1,
	});

	// Tracks which shops are on display.
	const [view, setView] = useState(0);

	// Tracks the state of the popup (saving, view, edit).
	const [popupState, setPopupState] = useState(0);

	// Tracks the current machine.
	const [currentMachine, setCurrentMachine] = useState("");

	// This gets all the data when the page loads, and then again every 60 seconds.
	useEffect(() => {
		// Loads the updated value from localStorage if it exists.
		setUpdated(
			localStorage.getItem("updated")
				? JSON.parse(localStorage.getItem("updated"))
				: { "initial": false }
		);

		// Sets shopRecord immunity based on if the page is loading for the first time.
		setShopRecord({
			"machines": {},
			"immune": localStorage.getItem("new") ? 1 : 3,
		});

		// Loads the buildings, machines, and jobs.
		setBuildings(
			localStorage.getItem("buildings")
				? JSON.parse(localStorage.getItem("buildings"))
				: []
		);
		setMachines(
			localStorage.getItem("machines")
				? JSON.parse(localStorage.getItem("machines"))
				: []
		);
		setJobs(
			localStorage.getItem("jobs")
				? JSON.parse(localStorage.getItem("jobs"))
				: []
		);

		// Loads the shop view from localStorage if it exists.
		setView(
			localStorage.getItem("view")
				? JSON.parse(localStorage.getItem("view"))
				: 1
		);

		// Marks that the page has been loaded.
		localStorage.setItem("new", true);

		// Loads the page.
		reload("all", { setBuildings, setMachines, setJobs });

		// Recurringly reloads the page.
		const interval = setInterval(() => {
			reload("all", { setBuildings, setMachines, setJobs });
		}, 60000);

		// Clears the above loop on return.
		return () => clearInterval(interval);
	}, []);

	// Updates the 'updated' value in localStorage whenever it's updated.
	useEffect(() => {
		// Only does it once the page has loaded.
		if (!updated.initial)
			localStorage.setItem("updated", JSON.stringify(updated));
	}, [updated]);

	// Updates the shop record & list of updated machines whenever machines or jobs update.
	useEffect(() => {
		// Only does it once the page has loaded.
		if (!updated.initial) {
			// Creates a new shop record & updated duplicate.
			let newShop = { "machines": {}, "immune": shopRecord.immune };
			let newUpdated = { ...updated };

			// Iterates through all the machines.
			machines.forEach((machine) => {
				// Sets the new shop record values for every machine.
				newShop["machines"][machine.code] = {};
				newShop["machines"][machine.code].id = machine.id;
				newShop["machines"][machine.code].jobs = jobs
					.filter((job) => {
						return job.machine == machine.code && job.state != 3;
					})
					.map((job) => {
						return job.entry;
					});
				newShop["machines"][machine.code].jobs.sort();

				// Only sets the updated list if it's not immune to displaying changes.
				if (shopRecord.immune == 0) {
					// If the machine is new, set it as updated.
					if (shopRecord["machines"][machine.code] == undefined) {
						newUpdated[machine.code] = true;
					}

					// If the machine has a new set of job IDs (this will include updates), set it as updated.
					else if (
						JSON.stringify(shopRecord["machines"][machine.code].jobs) !=
						JSON.stringify(newShop["machines"][machine.code].jobs)
					) {
						newUpdated[machine.code] = true;
					}

					// If the machine has a new ID, set it as updated.
					else if (shopRecord["machines"][machine.code].id != machine.id) {
						newUpdated[machine.code] = true;
					}
				}
			});

			// If the shop is immune, decreases immunity by 1.
			if (shopRecord.immune != 0) newShop.immune = newShop.immune - 1;

			// Sets the updated & shop record values.
			setUpdated(newUpdated);
			setShopRecord(newShop);
		}
	}, [machines, jobs]);

	// Checks if the page has any unsaved changes whenever changes list updates.
	useEffect(() => {
		// Only does the following if the page is being edited.
		if (type == "edit") {
			// A variable set to track if the page has been unsaved.
			let unsaved = false;

			// If there are any unsaved changes to machines, set unsaved to true.
			Object.entries(changes["machines"]).forEach(([key, value]) => {
				if (Object.entries(value).length > 0) unsaved = true;
			});

			// If there are any unsaved changes to jobs, set unsaved to true.
			Object.entries(changes["jobs"]).forEach(([key, value]) => {
				if (Object.entries(value).length > 0) unsaved = true;
			});

			// Sets hasChanges.
			setHasChanges(unsaved);
		}
	}, [changes]);

	// Calls the action helper function given an action and parameters.

	function doAction(act, params) {
		if (act == "clickMachine")
			clickMachine(params[0], {
				type,
				updated,
				setUpdated,
				popupState,
				setPopupState,
				setCurrentMachine,
			});
		if (act == "setMachine")
			setMachine(params[0], params[1], {
				machines,
				changes,
				setChanges,
				currentMachine,
			});
		if (act == "setJob")
			setJob(params[0], params[1], params[2], params[3], {
				changes,
				setChanges,
				jobs,
			});
		if (act == "createJob")
			createJob(
				params[0],
				params[1],
				params[2],
				params[3],
				params[4],
				params[5],
				{ changes, setChanges }
			);
		if (act == "deleteJob")
			deleteJob(params[0], params[1], { changes, setChanges });
		if (act == "setJobState")
			setJobState(params[0], params[1], params[2], {
				changes,
				setChanges,
				jobs,
			});
		if (act == "setJobPriority")
			setJobPriority(params[0], params[1], params[2], {
				changes,
				setChanges,
				jobs,
			});
		if (act == "closePopup") closePopup({ setPopupState, setCurrentMachine });
		if (act == "undo") undo(params[0], { changes, setChanges });
		if (act == "save")
			save({
				user,
				changes,
				setChanges,
				setBuildings,
				machines,
				setMachines,
				jobs,
				setJobs,
				setPopupState,
			});
	}

	// JSX (RETURN VALUE)

	return (
		<>
			<Menu />

			{/* This div sets the style for the whole shop. */}
			<div className="w-full mt-6 text-center">
				{
					// Creates building components.
					buildings
						.filter((building) => {
							// Filters buildings based on the view.
							if (view == 0) return true;
							if (view == 1) return building.code != "lm";
							if (view == 2) return building.code == "lm";
						})
						.map((building) => {
							return (
								<Building
									key={building.code}
									data={building}
									machines={
										/* Filters for only machines in the given building. */
										machines.filter((machine) => {
											return machine.building == building.code;
										})
									}
									jobs={jobs}
									changes={changes}
									updated={updated}
									doAction={(action, params) => {
										doAction(action, params);
									}}
									selectedMachine={currentMachine}
								/>
							);
						})
				}
			</div>

			{/* POPUP */}
			<Popup
				doAction={(action, params) => {
					doAction(action, params);
				}}
				popupState={popupState}
				machine={machines.find((machine) => {
					return machine.code == currentMachine;
				})}
				jobs={jobs.filter((job) => {
					return job.machine == currentMachine;
				})}
				changes={changes}
			/>
		</>
	);
}

// The menu bar component.
function Menu() {
	return (
		<>
			<div className="invisible h-16 font-RobotoMono" />
			<div className="fixed top-0 z-10 w-screen h-16 m-auto shadow-xl bg-cool-grey-50">
				<div className="relative max-w-[1000px] mx-auto">
					<div className="absolute invisible w-full mx-auto mt-1 text-lg font-semibold text-center sm:visible top-4">
						Machine Shop
					</div>
					<Link
						href="./"
						className="absolute mt-2 ml-4 cursor-pointer w-fit h-fit"
					>
						<img src="./inverted-logo.png" className="h-12" />
					</Link>
				</div>
			</div>
		</>
	);
}
