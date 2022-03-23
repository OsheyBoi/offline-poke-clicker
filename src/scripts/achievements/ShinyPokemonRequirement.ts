///<reference path="../../declarations/requirements/AchievementRequirement.d.ts"/>

class ShinyPokemonRequirement extends AchievementRequirement {
    constructor(value: number, option: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
        super(value, option, GameConstants.AchievementType['Shiny Pokemon']);
    }

    public getProgress() {
        return Math.min(App.game.party.caughtPokemon.filter(p => p.shiny).length, this.requiredValue);
    }

    public hint(): string {
        return `${this.requiredValue} Shiny Pokémon need to be obtained .`;
    }
}
