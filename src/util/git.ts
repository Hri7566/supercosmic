import { exec } from "child_process";

// https://stackoverflow.com/questions/62225567/get-current-git-branch-with-node-js
export function getGitBranch() {
	return new Promise((resolve, reject) => {
		exec("git rev-parse --abbrev-ref HEAD", (err, stdout, stderr) => {
			if (err || typeof stdout !== "string") reject(err);

			resolve(stdout.split("\n").join(""));
		});
	});
}

export async function isMainBranch() {
	const branch = await getGitBranch();
	return branch === "main" || branch === "master";
}
