// This is an interactive component, so it's a client component.
"use client";

// Imports the shop component.
import Shop from "./modules/Shop";

// Basic React hook.
import { useState, useEffect } from "react";

/**
 * The default export for the view page.
 *
 * @returns JSX representation of the edit page.
 */
export default function App() {
	// These 3 hooks contain the buildings, machines, and jobs.
	const [buildings, setBuildings] = useState([]);
	const [machines, setMachines] = useState([]);
	const [jobs, setJobs] = useState([]);

	// Tracks the user editing based on the password form.
	const [user, setUser] = useState({
		name: "",
		id: 0,
		password: "",
		active: 0,
	});

	// Tracks if the user has any unsaved changes.
	const [hasChanges, setHasChanges] = useState(false);

	// Prevents reloading/leaving if there are unsaved changes.
	useEffect(() => {
		const unloadCallback = (event) => {
			if (hasChanges) {
				event.preventDefault();
				event.returnValue = "";
				return "";
			}
		};

		window.addEventListener("beforeunload", unloadCallback);
		return () => window.removeEventListener("beforeunload", unloadCallback);
	}, [hasChanges]);

	// JSX (RETURN VALUE)

	return (
		<>
			{/* BACKGROUND */}
			<div
				className={`${
					user.active ? "bg-blue-100" : "bg-cool-grey-100"
				} -z-10 fixed top-0 left-0 w-full h-[150%]`}
			/>

			{/* FOREGROUND */}
			<div>
				{/* The rest of the machine shop. */}
				<Shop
					type={user.active != 0 ? "edit" : "view"}
					buildings={buildings}
					machines={machines}
					jobs={jobs}
					setBuildings={setBuildings}
					setMachines={setMachines}
					setJobs={setJobs}
					user={user}
					setUser={setUser}
					hasChanges={hasChanges}
					setHasChanges={setHasChanges}
				/>
			</div>
		</>
	);
}
