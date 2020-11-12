///<reference path="Item.ts"/>

class ShovelItem extends Item {

    constructor(basePrice: number, displayName: string, description: string) {
        super('Berry_Shovel', basePrice, GameConstants.Currency.farmPoint, { multiplierDecreaser: MultiplierDecreaser.Berry }, displayName, description);
    }

    gain(amt: number) {
        GameHelper.incrementObservable(App.game.farming.shovelAmt, amt);
    }

    use() {
    }
}

ItemList['Berry_Shovel']   = new ShovelItem(400, 'Berry Shovel', 'Removes Berry Plants in the Farm.');
