///<reference path="./NPC.ts"/>

class GiftNPC extends NPC {
    constructor(
        public name: string,
        public dialog: string[],
        private giftFunction: () => void,
        public giftImage?: string,
        options: NPCOptionalArgument = {}
    ) {
        super(name, dialog, options, NPCType.Gift);
    }

    public acceptGift() {
        this.giftFunction?.();
        GameHelper.incrementObservable(App.game.statistics.npcTalkedTo[this.saveKey]);
    }

    public setTalkedTo() {} // intentionally left blank
}
