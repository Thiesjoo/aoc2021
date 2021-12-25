import { default as now } from "performance-now";

// Part 1
// ======
// ~1.2 s - answer: 15538

const part1 = (raw: string) => {
	const start = now();

	const state = { cost: 0, ...input(raw) };
	play(state, true);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return minimumCost;
};

// Part 2
// ======
// ~1.2 s - answer: 47258

const part2 = (raw: string) => {
	const start = now();

	const state = { cost: 0, ...input(raw) };

	state.rooms[0] = [state.rooms[0][0], 3, 3, state.rooms[0][1]];
	state.rooms[1] = [state.rooms[1][0], 2, 1, state.rooms[1][1]];
	state.rooms[2] = [state.rooms[2][0], 1, 0, state.rooms[2][1]];
	state.rooms[3] = [state.rooms[3][0], 0, 2, state.rooms[3][1]];

	play(state, true);

	const end = now();
	console.log("Execution time: ~%dms", (end - start).toFixed(3));

	return minimumCost;
};

export { part1, part2 };

const input = (raw: string) => {
	const letters = {
		A: 0,
		B: 1,
		C: 2,
		D: 3,
	};

	const toads = raw
		.split("\n")
		.slice(2, 4)
		.map((x) => {
			return [...x.matchAll(/(A|B|C|D)/gi)].map(
				(l) => letters[l[0] as keyof typeof letters]
			);
		});

	// Null is a place you can't go. False is an empty spot.
	const hallway = [...Array(11)].map((_, i) =>
		i > 0 && i < 10 && i % 2 === 0 ? null : false
	);

	let rooms = toads[0].reduce((acc, _, i) => {
		acc.push(
			toads.map((_, j) => {
				return toads[j][i];
			})
		);
		return acc;
	}, [] as number[][]);

	return { hallway, rooms };
};

type GameState = {
	/** Null means not occupiable, false means THIS BISH EMPTY and number means there is a toad there  */
	hallway: (number | null | false)[];
	rooms: number[][];
	cost: number;
};

const stateCosts = new Map();
let minimumCost = Infinity;

const getStateKey = ({ hallway, rooms }: Partial<GameState>) =>
	hallway + "|" + rooms;

const play = (state: GameState, init = false) => {
	if (init) {
		stateCosts.clear();
		minimumCost = Infinity;
	}

	if (state.cost > minimumCost) {
		return;
	}

	const { cost, hallway, rooms } = state;

	// I've won, but at what cost (:
	const won = rooms.every((room, i) => room.every((toad) => toad === i));
	if (won) {
		if (cost < minimumCost) {
			minimumCost = cost;
		}
		return;
	}

	const stateKey = getStateKey({ hallway, rooms });
	if ((stateCosts.get(stateKey) ?? Infinity) <= cost) {
		return;
	}
	stateCosts.set(stateKey, cost);

	// See if any toads can go home.
	for (let hallSpot = 0; hallSpot < hallway.length; hallSpot += 1) {
		if (hallway[hallSpot] === null || hallway[hallSpot] === false) {
			// This is not a stoppable spot, or nobody's in it.
			continue;
		}

		const toad = hallway[hallSpot] as number;

		// If its home room is empty or only occupied by the same kind of toad,
		// we're good to go.
		if (rooms[toad].every((t: any) => t === toad || t === false)) {
			// This is the hallway column the toad needs to get to in order to
			// reach its room.
			const homeSpot = toad * 2 + 2;

			let allClear = false;
			if (homeSpot > hallSpot) {
				const ahead = hallway.slice(hallSpot + 1, homeSpot);
				if (ahead.every((spot: any) => spot === false || spot === null)) {
					// The way forward is clear. This toad can go home.
					allClear = true;
				}
			} else {
				const behind = hallway.slice(homeSpot, hallSpot);
				if (behind.every((spot: any) => spot === false || spot === null)) {
					// The way back is clear. This toad can go home.
					allClear = true;
				}
			}

			if (allClear) {
				// Where in the room the toad will end up
				const roomIndex =
					rooms[toad].filter((spot: any) => spot === false).length - 1;

				const newHallway = [...hallway];
				const newRooms = JSON.parse(JSON.stringify(rooms));

				newHallway[hallSpot] = false;
				newRooms[toad][roomIndex] = toad;

				const newCost =
					(Math.abs(hallSpot - homeSpot) +
						rooms[toad].filter((t: any) => t === false).length) *
					10 ** toad;

				play({
					cost: cost + newCost,
					hallway: newHallway,
					rooms: newRooms,
				});
			}
		}
	}

	// Otherwise, all the toads at the tops of their rooms can try all of the
	// available hall spots that they can get to.
	for (let room = 0; room < rooms.length; room += 1) {
		// If all of the creatures in this room live here, we can skip this room
		if (rooms[room].every((t: any) => t === room || t === false)) {
			continue;
		}

		const depth = rooms[room].filter((t: any) => t === false).length;
		const toadSpot = room * 2 + 2;

		if (depth === rooms[0].length) {
			// This room is empty, so no toads can move out of it.
			continue;
		}

		const tryHallSpot = (hallSpot: any) => {
			const newHallway = [...hallway];
			const newRooms = JSON.parse(JSON.stringify(rooms));

			newHallway[hallSpot] = rooms[room][depth];
			newRooms[room][depth] = false;

			const newCost =
				(depth + 1 + Math.abs(toadSpot - hallSpot)) * 10 ** rooms[room][depth];

			play({ cost: cost + newCost, hallway: newHallway, rooms: newRooms });
		};

		for (let hallSpot = toadSpot - 1; hallSpot >= 0; hallSpot -= 1) {
			if (hallway[hallSpot] === null) {
				// Unoccupiable
				continue;
			}
			if (hallway[hallSpot] !== false) {
				// Occupied. The toad can't go here, and it can't go beyond this
				// spot, either.
				break;
			}

			tryHallSpot(hallSpot);
		}

		for (
			let hallSpot = toadSpot + 1;
			hallSpot < hallway.length;
			hallSpot += 1
		) {
			if (hallway[hallSpot] === null) {
				// Unoccupiable
				continue;
			}
			if (hallway[hallSpot] !== false) {
				// Occupied. The toad can't go here, and it can't go beyond this
				// spot, either.
				break;
			}

			tryHallSpot(hallSpot);
		}
	}
};
