/// <reference path="../Quest.ts" />

class DefeatDungeonQuest extends Quest implements QuestInterface {
    private region: GameConstants.Region;

    constructor(
        amount: number,
        reward: number,
        public dungeon: string
    ) {
        super(amount, reward);
        this.region = GameConstants.getDungeonRegion(this.dungeon);
        if (this.region == GameConstants.Region.none) {
            throw new Error(`Invalid dungeon for quest: ${this.dungeon}`);
        }
        this.focus = App.game.statistics.dungeonsCleared[GameConstants.getDungeonIndex(this.dungeon)];
    }

    // Only add Defeat Dungeon Quest if the player has access to Viridian Forest.
    public static canComplete() {
        return TownList['Viridian Forest'].isUnlocked();
    }

    public static generateData(): any[] {
        // Allow up to highest region
        const amount = SeededRand.intBetween(5, 20);
        let maxRegion = player.highestRegion();
        // Check if any dungeon is unlocked in the highest region.
        if (GameConstants.RegionDungeons[maxRegion].filter(dungeon => TownList[dungeon].isUnlocked()).length == 0) {
            maxRegion -= 1;
        }
        const region = SeededRand.intBetween(0, maxRegion);
        // Only use unlocked dungeons
        const possibleDungeons = GameConstants.RegionDungeons[region].filter(dungeon => TownList[dungeon].isUnlocked());
        const dungeon = SeededRand.fromArray(possibleDungeons);
        const reward = this.calcReward(amount, dungeon);
        return [amount, reward, dungeon];
    }

    private static calcReward(amount: number, dungeon: string): number {
        const playerDamage = App.game.party.calculateClickAttack() + (App.game.party.pokemonAttackObservable() / GameConstants.QUEST_CLICKS_PER_SECOND);
        const attacksToDefeatPokemon = Math.ceil(Math.min(4, dungeonList[dungeon].baseHealth / playerDamage));
        const averageTilesToBoss = 13;
        const attacksToCompleteDungeon = attacksToDefeatPokemon * averageTilesToBoss;
        const completeDungeonsReward = attacksToCompleteDungeon * GameConstants.DEFEAT_POKEMONS_BASE_REWARD * GameConstants.ACTIVE_QUEST_MULTIPLIER * amount;

        let region: GameConstants.Region, route: number;
        for (region = player.highestRegion(); region >= 0; region--) {
            route = QuestHelper.highestOneShotRoute(region); // returns 0 if no routes in this region can be one shot
            if (route) {
                break;
            }
        }
        if (!route) {
            route = 1, region = GameConstants.Region.kanto;
        }
        const tokens = PokemonFactory.routeDungeonTokens(route,region);
        const routeKillsPerDungeon = dungeonList[dungeon].tokenCost / tokens;
        const collectTokensReward = routeKillsPerDungeon * GameConstants.DEFEAT_POKEMONS_BASE_REWARD * amount;

        const reward = Math.min(5000, Math.ceil(completeDungeonsReward + collectTokensReward));
        return super.randomizeReward(reward);
    }

    get description(): string {
        return this.customDescription ?? `Defeat the ${this.dungeon} dungeon in ${GameConstants.camelCaseToString(GameConstants.Region[this.region])} ${this.amount.toLocaleString('en-US')} times.`;
    }

    toJSON() {
        const json = super.toJSON();
        json.name = this.constructor.name;
        json.data.push(this.dungeon);
        return json;
    }
}
