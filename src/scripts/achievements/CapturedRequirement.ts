/// <reference path="../../declarations/achievements/Requirement.d.ts" />

class CapturedRequirement extends Requirement {
    constructor( value: number, type: GameConstants.AchievementOption = GameConstants.AchievementOption.more) {
        super(value, type);
    }

    public getProgress() {
        return Math.min(App.game.statistics.totalPokemonCaptured(), this.requiredValue);
    }

    public hint(): string {
        return `${this.requiredValue} Pokémon need to be captured.`;
    }
}
