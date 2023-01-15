import { Observable } from 'knockout';
import { AchievementOption } from '../GameConstants';
import Requirement from './Requirement';

// Requires a later version of TypeScript
// Method to handle retrieving statistics with better type safety.
// Provided by Jessica
/*
type GetNested<O, T>
    = T extends readonly [first: infer F extends keyof O, ...rest: infer R]
        ? GetNested<O[F], R>
        : T extends []
            ? O
            : never;

const getStat = <
    T extends ReadonlyArray<string | number>,
>(keys: T): GetNested<Statistics, T> => keys.reduce((s, p) => s[p], App.game.statistics);

Example: getStat(['secondsPlayed'] as const);
Exmaple: getStat(['pokemonEncountered', PokemonHelper.getPokemonByName('Gengar').id] as const)
*/

export default class StatisticRequirement extends Requirement {
    private focus: Observable<number>;

    constructor(
        private statistic: string | Array<string | number>,
        requiredAmount: number,
        private hintText: string = undefined,
        option = AchievementOption.more,
    ) {
        super(requiredAmount, option);
    }

    public getProgress(): number {
        if (!this.focus) {
            this.focus = Array.isArray(this.statistic)
                ? this.statistic.reduce((s, p) => s[p], App.game.statistics)
                : App.game.statistics[this.statistic];
        }
        return Math.min(this.focus(), this.requiredValue);
    }

    public hint(): string {
        return this.hintText || 'Come back when you have more experience.';
    }
}
