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

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
	setUser,
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
	const [jobDisplay, setJobDisplay] = useState(0);

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

		setJobDisplay(
			localStorage.getItem("jobDisplay")
				? JSON.parse(localStorage.getItem("jobDisplay"))
				: 0
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
				user: user.id,
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
			<Menu
				view={view}
				setView={setView}
				jobDisplay={jobDisplay}
				setJobDisplay={setJobDisplay}
				type={type}
				user={user}
				setUser={setUser}
				doAction={doAction}
			/>

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
									jobDisplay={jobDisplay}
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
function Menu({
	view,
	setView,
	jobDisplay,
	setJobDisplay,
	type,
	user,
	setUser,
	doAction,
}) {
	const [show, setShow] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	const controlNavbar = () => {
		if (window.scrollY > lastScrollY) {
			// if scroll down hide the navbar
			setShow(false);
		} else {
			// if scroll up show the navbar
			setShow(true);
		}

		// remember current page location to use in the next move
		setLastScrollY(window.scrollY);
	};

	useEffect(() => {
		window.addEventListener("scroll", controlNavbar);

		// cleanup function
		return () => {
			window.removeEventListener("scroll", controlNavbar);
		};
	}, [lastScrollY]);

	const [loginPopup, setLoginPopup] = useState(false);

	return (
		<>
			<div className="invisible h-16 font-RobotoMono" />
			<div
				className={`fixed z-10 w-screen h-16 m-auto shadow-xl bg-cool-grey-50 transition-[top] ${
					show ? "top-0" : "-top-20"
				}`}
			>
				<div className="relative max-w-[1000px] mx-auto">
					<div className="absolute invisible w-full mx-auto mt-1 text-lg font-semibold text-center sm:visible top-4">
						{user.active ? `${user.name} is now editing` : "Machine Shop"}
					</div>
					<Link
						href="./"
						className="absolute mt-2 ml-4 cursor-pointer w-fit h-fit"
					>
						<img src="./inverted-logo.png" className="h-12" />
					</Link>
					<div>
						<DropdownMenu>
							<DropdownMenuTrigger className="absolute mt-1 mr-8 font-semibold transition-colors cursor-pointer right-1 top-4 hover:text-cool-grey-900 text-cool-grey-500">
								Menu
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{type == "view" && (
									<DropdownMenuItem
										onSelect={(e) => {
											setLoginPopup(true);
										}}
									>
										Log in
									</DropdownMenuItem>
								)}
								{type == "edit" && (
									<DropdownMenuItem
										onSelect={(e) => {
											doAction("save", []);
										}}
									>
										Save
									</DropdownMenuItem>
								)}
								{type == "edit" && (
									<a href="./">
										<DropdownMenuItem>Log Out</DropdownMenuItem>
									</a>
								)}
								<DropdownMenuItem
									onSelect={(e) => {
										e.preventDefault();
										if (typeof window !== undefined)
											localStorage.setItem("view", (view + 1) % 3);
										setView((view + 1) % 3);
									}}
								>
									Switch View
								</DropdownMenuItem>
								<DropdownMenuItem
									onSelect={(e) => {
										e.preventDefault();
										if (typeof window !== undefined)
											localStorage.setItem("jobDisplay", (jobDisplay + 1) % 2);
										setJobDisplay((jobDisplay + 1) % 2);
									}}
								>
									Switch Job Display
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
			<LoginForm
				loginPopup={loginPopup}
				setLoginPopup={setLoginPopup}
				user={user}
				setUser={setUser}
			/>
		</>
	);
}

function LoginForm({ loginPopup, setLoginPopup, user, setUser }) {
	const [invalidLogin, setInvalidLogin] = useState(false);

	const formSchema = z.object({
		password: z.string(),
	});

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
		},
	});

	useEffect(() => {
		form.reset();
		setInvalidLogin(false);
	}, [loginPopup]);

	const onSubmit = async (data) => {
		let newUser = await getLoginInfo({
			user: { password: data.password },
			setUser,
		});
		if (newUser.active == 1) {
			setLoginPopup(false);
			setInvalidLogin(false);
		} else {
			setInvalidLogin(true);
		}
	};

	return (
		<Dialog open={loginPopup} onOpenChange={setLoginPopup}>
			<DialogContent className="sm:max-w-[425px] bg-white">
				<DialogHeader>
					<DialogTitle>Log in</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						{/* PASSWORD */}
						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="password" className="text-left">
										Password <span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<div>
											<Input
												{...form.register("password")}
												placeholder="abc123"
												type="password"
												onFocus={(e) => e.target.select()}
												autoComplete="new-password"
											/>
											<FormMessage className="mt-2">
												{invalidLogin && "Invalid login"}
											</FormMessage>
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
						<DialogFooter className="mt-4">
							<Button type="submit">Submit</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

async function getLoginInfo({ user, setUser }) {
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
		// Accesses the companies API.
		const res = await fetch(
			`${window.location.origin}/api/user/${user.password}`,
			postData
		);
		const response = await res.json();

		setUser(response);

		return response;
	} catch (e) {
		console.error(e);
	}
}
