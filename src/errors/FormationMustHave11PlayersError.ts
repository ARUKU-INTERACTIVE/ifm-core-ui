export class FormationMustHave11PlayersError extends Error {
	constructor() {
		super('You must select 11 players to create a formation.');
		this.name = 'FormationMustHave11PlayersError';
	}
}

export class FormationMustHave11PlayersToUpdateError extends Error {
	constructor() {
		super('You must select 11 players to update a formation.');
		this.name = 'FormationMustHave11PlayersToUpdateError';
	}
}
