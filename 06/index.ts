import { default as now } from "performance-now";

/** Not mine, but still very cool solution  */
function runSimulation(times: number, input: string): number {
	const data = input.split(",").map(Number);

	/** Map of every fish at that age */
	let cycle: number[] = new Array(9).fill(0);

	data.forEach((age) => (cycle[age] += 1));

	for (let day = 0; day < times; day++) {
		const [newFish, ...fishCycle] = cycle;
		cycle = [...fishCycle, newFish];
		cycle[6] += newFish;
	}

	return cycle.reduce((acc, fish) => acc + fish);
}

/** My initial slow af solution */
function runSimulationSlow(times: number, input: string): number {
	const data = input.split(",").map(Number);

	for (let iter = 0; iter < 80; iter++) {
		let currentLength = data.length;
		for (let i = 0; i < currentLength; i++) {
			if (data[i] == 0) {
				data.push(8);
				data[i] = 6;
			} else {
				data[i]--;
			}
		}
	}
	return data.length;
}

// Part 1
// ======
// ~0.4 ms - answer: 393019

const part1 = (input: string) => {
	const start = now();
	let result = runSimulation(80, input);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~1.1 ms - answer: 1757714216975

const part2 = (input: string) => {
	const start = now();

	let result = runSimulation(256, input);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
