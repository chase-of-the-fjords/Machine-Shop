// This is an interactive component, so it's a client component.
"use client";

// Basic React hooks.
import { useState, useEffect } from "react";

import Link from "next/link";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClusterHeading from "./components/ClusterHeading";

import { getClusterLog } from "./Helpers/Interface";
import Action from "./components/Action";

/**
 * The default export for the history page.
 *
 * @returns JSX representation of the history page.
 */
export default function App() {
	// JSX (RETURN VALUE)

	return (
		<>
			{/* BACKGROUND */}
			<div className="bg-cool-grey-100 -z-10 fixed top-0 left-0 w-full h-[150%]"></div>

			<Menu />

			<History />
		</>
	);
}

// The menu bar component.
function Menu() {
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
				className={`fixed z-50 w-screen h-16 m-auto shadow-xl bg-cool-grey-50 transition-[top] ${
					show ? "top-0" : "-top-20"
				}`}
			>
				<div className="relative max-w-[1000px] mx-auto">
					<div className="absolute invisible w-full mx-auto mt-1 text-lg font-semibold text-center sm:visible top-4">
						Shop History
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
								<Link href="./">
									<DropdownMenuItem>View Shop</DropdownMenuItem>
								</Link>
								<Link href="./moment">
									<DropdownMenuItem>Moment History</DropdownMenuItem>
								</Link>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</>
	);
}

function History() {
	const [log, setLog] = useState([]);

	useEffect(() => {
		async function fetchData() {
			let start = new Date("03/01/2024").toLocaleDateString("sv");
			let end = new Date(Date.now()).toLocaleDateString("sv");
			setLog(await getClusterLog(start, end));
		}
		fetchData();
	}, []);

	return (
		<>
			<div className="flex max-w-[1200px] mx-auto my-6 space-x-6 px-6">
				<Filter />
				<Log log={log} />
			</div>
		</>
	);
}

function Filter() {
	return (
		<div className="w-64 p-6 rounded-md shadow-lg h-fit bg-cool-grey-50">
			<div className="mb-4">
				<h2 className="mb-1 ml-1 text-xl font-medium font-Poppins">
					Start Date
				</h2>
				<input
					type="date"
					className="block w-full px-2 py-1 rounded-md bg-cool-grey-100 text-md"
					defaultValue={new Date(
						Date.now() - 7 * 24 * 60 * 60 * 1000
					).toLocaleDateString("sv")}
					onChange={(e) => {}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
						}
					}}
				/>
			</div>
			<div className="mb-4">
				<h2 className="mb-1 ml-1 text-xl font-medium font-Poppins">End Date</h2>
				<input
					type="date"
					className="block w-full px-2 py-1 rounded-md bg-cool-grey-100 text-md"
					defaultValue={new Date(Date.now()).toLocaleDateString("sv")}
					onChange={(e) => {}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
						}
					}}
				/>
			</div>
			<div className="mb-4">
				<h2 className="mb-1 ml-1 text-xl font-medium font-Poppins">Filter</h2>
				<input
					className="block w-full px-2 py-1 transition-all rounded-md text-md bg-cool-grey-100 focus:outline focus:outline-cool-grey-500"
					type="text"
					onChange={(e) => {}}
					placeholder="Search"
				/>
			</div>
			<button className="block px-2 py-1 mx-auto mt-8 font-medium transition-colors bg-yellow-300 rounded-md hover:bg-yellow-400 font-Poppins text-md">
				Submit
			</button>
		</div>
	);
}

function Log({ log }) {
	return (
		<div className="flex-grow p-6 rounded-md shadow-lg h-fit bg-cool-grey-50">
			{log.map((cluster) => {
				return (
					<div key={cluster.date + " " + cluster.time + " " + cluster.user}>
						<ClusterHeading
							name={cluster.user}
							date={cluster.date}
							time={cluster.time}
						/>
						<div className="m-4">
							{Object.entries(cluster.entries).map(([key, value]) => (
								<div className="mb-4 font-Poppins" key={key}>
									<h3 className="text-lg font-semibold text-cool-grey-900">
										{key}
									</h3>
									{value.map((action, i) => (
										<Action action={action} key={i} />
									))}
								</div>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}
