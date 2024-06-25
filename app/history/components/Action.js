export default function Action({ action }) {
	if (action.action == "created machine") return CreatedMachine({ action });
	if (action.action == "updated machine") return UpdatedMachine({ action });
	if (action.action == "created job") return CreatedJob({ action });
	if (action.action == "updated job") return UpdatedJob({ action });
	if (action.action == "deleted job") return DeletedJob({ action });

	return <p className="ml-2 sm:ml-4">{action.action}</p>;
}

function CreatedMachine({ action }) {
	return <h4 className="mb-1 ml-2 sm:ml-4">Created machine</h4>;
}

function UpdatedMachine({ action }) {
	return (
		<ul className="ml-2 sm:ml-4">
			{Object.entries(action.changes).map(([key, value]) => {
				if (key == "state") {
					return (
						<li key={key}>
							{`Set to `}
							<span className="font-semibold">{value.old.trim()}</span>
							<span className="text-sm font-light text-cool-grey-700">{` from ${value.new.trim()}`}</span>
						</li>
					);
				}

				return (
					<li key={key}>
						{`Changed ${key} from `}
						<span className="font-semibold">{value.old.trim()}</span>
						{" to "}
						<span className="font-semibold">{value.new.trim()}</span>.
					</li>
				);
			})}
		</ul>
	);
}

function CreatedJob({ action }) {
	return (
		<h4 className="mb-1 ml-2 sm:ml-4">
			{`Created `}
			<span className="font-semibold">{action.op}</span>
			<span className="text-sm font-light text-cool-grey-700">{` (${action.state})`}</span>
			{action.notes && (
				<p className="ml-2 text-sm sm:ml-4">
					<span className="font-light text-cool-grey-700">{"Notes: "}</span>
					<span>{action.notes.trim()}</span>
				</p>
			)}
		</h4>
	);
}

function UpdatedJob({ action }) {
	if (Object.keys(action.changes).length == 1) {
		let key = Object.keys(action.changes)[0];

		if (key == "state") {
			if (action.changes.state.new == "DONE") {
				return (
					<h4 className="mb-1 ml-2 sm:ml-4">
						{`Completed `}
						<span className="font-semibold">{action.op}</span>
					</h4>
				);
			}

			return (
				<h4 className="mb-1 ml-2 sm:ml-4">
					{`Set `}
					<span className="font-semibold">{action.op}</span>
					{` to ${action.changes.state.new}`}
					<span className="text-sm font-light text-cool-grey-700">{` from ${action.changes.state.old}`}</span>
				</h4>
			);
		}
	}

	return (
		<h4 className="mb-1 ml-2 sm:ml-4">
			{"Updated "}
			{action.op ? <span className="font-semibold">{action.op}</span> : "Job"}
			<ul className="ml-2 sm:ml-4">
				{Object.entries(action.changes).map(([key, value]) => {
					return (
						<li className="text-sm" key={key}>
							{value.new.trim() ? `Set ${key} to ` : `Removed ${key} `}
							<span className="font-medium">{value.new.trim()}</span>
							{value.old.trim() != "" && key != "op" && (
								<span className="text-sm font-light text-cool-grey-700">{` (from ${value.old.trim()})`}</span>
							)}
						</li>
					);
				})}
			</ul>
		</h4>
	);
}

function DeletedJob({ action }) {
	return (
		<h4 className="mb-1 ml-2 sm:ml-4">
			{"Deleted "}
			<span className="font-semibold">{action.op.trim()}</span>
		</h4>
	);
}
