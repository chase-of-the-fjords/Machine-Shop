// This is an interactive component, so it's a client component.
"use client";

// Imports the shop component.
import Shop from "../modules/Shop";

// The style sheet for the main page.
import PasswordForm from "./PasswordForm";

// Basic React hooks.
import { useState, useEffect } from "react";

/**
 * The default export for the edit page.
 *
 * @returns JSX representation of the edit page.
 */
export default function App() {
	// These 3 hooks contain the buildings, machines, and jobs.
	const [buildings, setBuildings] = useState([]);
	const [machines, setMachines] = useState([]);
	const [jobs, setJobs] = useState([]);

	// Tracks the user editing based on the password form.
	const [user, setUser] = useState(0);

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
			<div className="bg-green-200 -z-10 fixed top-0 left-0 w-full h-[150%]"></div>

			{/* FOREGROUND */}
			<div>
				{/* The rest of the machine shop. */}
				<Shop
					type={user == 0 ? "view" : "edit"}
					buildings={buildings}
					machines={machines}
					jobs={jobs}
					setBuildings={setBuildings}
					setMachines={setMachines}
					setJobs={setJobs}
					user={user}
					hasChanges={hasChanges}
					setHasChanges={setHasChanges}
				/>
			</div>

			{/* PASSWORD FORM */}
			<PasswordForm setUser={setUser}></PasswordForm>
		</>
	);
}
