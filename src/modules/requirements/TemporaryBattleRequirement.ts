import Requirement from './Requirement';
import * as GameConstants from '../GameConstants';

export default class TemporaryBattleRequirement extends Requirement {
    constructor(public battleName: string, defeatsRequired = 1, option = GameConstants.AchievementOption.more) {
        super(defeatsRequired, option);
    }

    public getProgress() {
        return App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex(this.battleName)]();
    }

    public hint(): string {
        const tempBattle = TemporaryBattleList[this.battleName];
        const locationHint = ` ${tempBattle.parent ? 'in' : 'near'} ${tempBattle.getTown().name.replace(/\.$/, '')}`;
        return `Requires beating ${this.battleName.replace(/(?: route)?\s\d+$/, '')}${locationHint}.`;
    }
}
