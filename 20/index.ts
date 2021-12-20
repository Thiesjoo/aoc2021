import { default as now } from "performance-now";

function neighbors(
	map: { [key: string]: boolean },
	i: number,
	j: number
): boolean[] {
	const directions = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 0],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1],
	];

	return directions.map((x) => {
		return get(map, i + x[0], j + x[1]);
	});
}

function findLargest(map: { [key: string]: boolean }) {
	let temp = Object.keys(map).map((x) => x.split(",").map(Number));

	let maxX = Math.max(...temp.map((x) => x[0])) + 1;
	let minX = Math.min(...temp.map((x) => x[0])) - 1;

	let maxY = Math.max(...temp.map((x) => x[1])) + 1;
	let minY = Math.min(...temp.map((x) => x[1])) - 1;

	return {
		i: { maxX, minX },
		j: { maxY, minY },
	};
}

function get(map: { [key: string]: boolean }, i: number, j: number): boolean {
	return map[`${i},${j}`] || false;
}

// Part 1
// ======
// ~0 ms - answer: 0

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const [enhance2, image2] = input.split("\n\n");
	let image = image2.split("\n").map((x) => x.split(""));

	let map: { [key: string]: boolean } = {};

	image.forEach((x, i) => {
		x.forEach((y, j) => {
			map[`${i},${j}`] = y == "#";
		});
	});

	let newMap: { [key: string]: boolean } = {};
	let max = findLargest(map);

	for (let i = max.i.minX; i < max.i.maxX; i++) {
		console.log(
			Object.entries(map)
				.filter((x) => x[0].split(",").map(Number)[0] == i)
				.map((x) => (x[1] ? "#" : "."))
				.join("")
		);
	}

	for (let i = max.i.minX; i < max.i.maxX; i++) {
		for (let j = max.j.minY; j < max.j.maxY; j++) {
			let neigh = neighbors(map, i, j);
			let newest = parseInt(neigh.map((x) => (x ? "1" : "0")).join(""), 2);
			newMap[`${i},${j}`] = enhance2[newest] == "#";
		}
	}

	for (let i = max.i.minX; i < max.i.maxX; i++) {
		console.log(
			Object.entries(newMap)
				.filter((x) => x[0].split(",").map(Number)[0] == i)
				.map((x) => (x[1] ? "#" : "."))
				.join("")
		);
	}

	map = newMap;
	max = findLargest(map);

	newMap = {};

	for (let i = max.i.minX; i < max.i.maxX; i++) {
		for (let j = max.j.minY; j < max.j.maxY; j++) {
			let neigh = neighbors(map, i, j);
			let newest = parseInt(neigh.map((x) => (x ? "1" : "0")).join(""), 2);
			newMap[`${i},${j}`] = enhance2[newest] == "#";
		}
	}

	for (let i = max.i.minX; i < max.i.maxX; i++) {
		console.log(
			Object.entries(newMap)
				.filter((x) => x[0].split(",").map(Number)[0] == i)
				.map((x) => (x[1] ? "#" : "."))
				.join("")
		);
	}

	console.log(Object.entries(newMap).filter((x) => x[1]).length);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~0 ms - answer: 0

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const data = input.split("\n");

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
