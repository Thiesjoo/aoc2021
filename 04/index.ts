import { default as now } from "performance-now";

function checkRow(inp: number[][]): boolean {
	return inp.some((x) => {
		return x.every((y) => x[0] == y);
	});
}

function checkCol(inp: number[][]): boolean {
	const transposed = inp[0].map((_, colIndex) =>
		inp.map((row) => row[colIndex])
	);
	return checkRow(transposed);
}

function checkCompleted(inp: number[][]): boolean {
	return checkCol(inp) || checkRow(inp);
}

function markCompleted(inp: number[][], toComplete: number) {
	inp.forEach((x, i) => {
		x.forEach((y, j) => {
			if (y == toComplete) {
				inp[i][j] = -1;
				return;
			}
		});
	});
}

function calcUnmarked(inp: number[][]): number {
	return inp.reduce((acc, x) => {
		return (
			acc +
			x.reduce((acc2, y) => {
				return acc2 + (y == -1 ? 0 : y);
			}, 0)
		);
	}, 0);
}

function bingoFromInput(input: string): any {
	const [numbers, ...boards] = input.split("\n\n");
	const parsedBoards = boards.map((x) =>
		x.split("\n").map((y) => {
			let [firstSpace, ...rest] = y.split(/[ ]+/);
			return (firstSpace == "" ? rest : [firstSpace, ...rest]).map(Number);
		})
	);
	const parsedNumbers = numbers.split(",").map(Number);
	return [parsedNumbers, parsedBoards];
}

// Part 1
// ======
// ~31 ms - answer: 51034

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	const lol = bingoFromInput(input);
	const parsedNumbers: number[] = lol[0];
	const parsedBoards: number[][][] = lol[1];

	for (let i = 0; i < parsedNumbers.length; i++) {
		parsedBoards.forEach((x) => markCompleted(x, parsedNumbers[i]));

		const found = parsedBoards.find(checkCompleted);
		if (found) {
			result = parsedNumbers[i] * calcUnmarked(found);
			break;
		}
	}

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Part 2
// ======
// ~46 ms - answer: 5453

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	const lol = bingoFromInput(input);
	const parsedNumbers: number[] = lol[0];
	const parsedBoards: number[][][] = lol[1];

	for (let i = 0; i < parsedNumbers.length; i++) {
		parsedBoards.forEach((x) => markCompleted(x, parsedNumbers[i]));

		let found = parsedBoards.findIndex(checkCompleted);
		while (found > -1) {
			result = parsedNumbers[i] * calcUnmarked(parsedBoards[found]);
			parsedBoards.splice(found, 1);

			found = parsedBoards.findIndex(checkCompleted);
		}
	}

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
