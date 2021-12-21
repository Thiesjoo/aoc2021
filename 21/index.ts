import { default as now } from "performance-now";

type Game = {
	diceAt: number;
	diceRolls: number;
	player1: { score: number; pos: number };
	player2: { score: number; pos: number };
};

function modWithOne(i: number, m: number, n: number): number {
	return ((i + m - 1) % n) + 1;
}

function step(game: Game): number {
	let first =
		game.diceAt +
		modWithOne(game.diceAt, 1, 100) +
		modWithOne(game.diceAt, 2, 100);

	let second =
		modWithOne(game.diceAt, 3, 100) +
		modWithOne(game.diceAt, 4, 100) +
		modWithOne(game.diceAt, 5, 100);

	game.diceAt = modWithOne(game.diceAt, 6, 100);
	game.player1.pos = modWithOne(game.player1.pos, first, 10);
	game.player2.pos = modWithOne(game.player2.pos, second, 10);

	game.player1.score += game.player1.pos;
	game.player2.score += game.player2.pos;

	game.diceRolls += 6;

	console.log(game);

	if (game.player1.score >= 1000) {
		return 1;
	} else if (game.player2.score >= 1000) {
		return 2;
	}

	return -1;
}

// Part 1
// ======
// ~0 ms - answer: 571032

const part1 = (input: string) => {
	const start = now();
	let result = 0;

	let [r1, r2] = input.split("\n");
	let [, p1pos] = r1.split(": ");
	let [, p2pos] = r2.split(": ");

	const startGame = {
		diceAt: 1,
		diceRolls: 0,
		player1: { score: 0, pos: +p1pos },
		player2: { score: 0, pos: +p2pos },
	};

	let winner = -1;

	while ((winner = step(startGame)) === -1) {}

	result =
		(startGame.diceRolls - (winner == 1 ? 3 : 0)) *
		(winner == 1
			? startGame.player2.score - startGame.player2.pos
			: startGame.player1.score);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

// Yoinked from reddit lol (Deze combinaties dan tenminste)
let combinations = [
	[1, 1, 1],
	[1, 1, 2],
	[1, 1, 3],
	[1, 2, 1],
	[1, 2, 2],
	[1, 2, 3],
	[1, 3, 1],
	[1, 3, 2],
	[1, 3, 3],
	[2, 1, 1],
	[2, 1, 2],
	[2, 1, 3],
	[2, 2, 1],
	[2, 2, 2],
	[2, 2, 3],
	[2, 3, 1],
	[2, 3, 2],
	[2, 3, 3],
	[3, 1, 1],
	[3, 1, 2],
	[3, 1, 3],
	[3, 2, 1],
	[3, 2, 2],
	[3, 2, 3],
	[3, 3, 1],
	[3, 3, 2],
	[3, 3, 3],
];

let combinationCounts = new Map();
for (const c of combinations) {
	const sum = c[0] + c[1] + c[2];
	// Count how many times a certain sum comes up.
	combinationCounts.set(sum, (combinationCounts.get(sum) || 0) + 1);
}

let wins = new Map();

function count(
	player1: number,
	player2: number,
	score1: number,
	score2: number
): [number, number] {
	// p2 always wins, because he just made his turn
	if (score2 >= 21) return [0, 1];

	const key = [player1, player2, score1, score2].join(",");
	const cached = wins.get(key);
	if (cached) return cached;

	let res = [0, 0] as [number, number];

	for (const [sum, count1] of combinationCounts.entries()) {
		let n1 = modWithOne(player1, sum, 10);

		let w = count(player2, n1, score2, score1 + n1);
		res[0] += w[1] * count1;
		res[1] += w[0] * count1;
	}

	wins.set(key, res); // memoize result
	return res;
}

// Part 2
// ======
// ~40 ms - answer: 49975322685009

const part2 = (input: string) => {
	const start = now();
	let result = 0;

	let [r1, r2] = input.split("\n");
	let [, p1pos] = r1.split(": ");
	let [, p2pos] = r2.split(": ");

	const cnt = count(+p1pos, +p2pos, 0, 0);
	result = cnt[0] > cnt[1] ? cnt[0] : cnt[1];

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return result;
};

export { part1, part2 };
