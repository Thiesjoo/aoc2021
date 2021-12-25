import { default as now } from "performance-now";

type Map = (">" | "v" | ".")[];

function step(map: Map[]): { map: Map[]; stepped: boolean } {
	let stepped = false;
	let newMap: Map[] = Array.from({ length: map.length }, (x, i) =>
		new Array(map[0].length).fill(".")
	);

	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] == ">") {
				if (map[i][(j + 1) % map[0].length] == ".") {
					newMap[i][(j + 1) % map[0].length] = ">";
					stepped = true;
				} else {
					newMap[i][j] = ">";
				}
			}
		}
	}

	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] == "v") {
				if (
					newMap[(i + 1) % map.length][j] == "." &&
					map[(i + 1) % map.length][j] !== "v"
				) {
					newMap[(i + 1) % map.length][j] = "v";
					stepped = true;
				} else {
					newMap[i][j] = "v";
				}
			}
		}
	}

	return { stepped, map: newMap };
}

// Part 1
// ======
// ~210 ms - answer: 516

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n").map((x) => x.split("") as Map);
	let current = { map: data, stepped: true };

	while (current.stepped) {
		current = step(current.map);
		result++;
	}

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~0 ms - answer: 69

const part2 = (input: string) => {
	const start = now();
	let result = 69;

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
