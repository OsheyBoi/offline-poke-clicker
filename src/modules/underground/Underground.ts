import type { Observable, Computed, PureComputed } from 'knockout';
import '../koExtenders';
import { Feature } from '../DataStore/common/Feature';
import { Currency, PLATE_VALUE } from '../GameConstants';
import KeyItemType from '../enums/KeyItemType';
import PokemonType from '../enums/PokemonType';
import UndergroundItemValueType from '../enums/UndergroundItemValueType';
import { ItemList } from '../items/ItemList';
import NotificationConstants from '../notifications/NotificationConstants';
import Notifier from '../notifications/Notifier';
import { Mine } from './Mine';
import UndergroundItem from './UndergroundItem';
import UndergroundItems from './UndergroundItems';
import Settings from '../settings/Settings';
import GameHelper from '../GameHelper';
import OakItemType from '../enums/OakItemType';

export class Underground implements Feature {
    name = 'Underground';
    saveKey = 'underground';

    defaults: Record<string, any> = {
        undergroundExp: 0,
    };

    static undergroundExp: Observable<number> = ko.observable(0);
    static undergroundLevel: PureComputed<number> = ko.pureComputed(() => {
        return this.convertExperienceToLevel(this.undergroundExp());
    });

    public static itemSelected;
    public static counter = 0;

    public static sortDirection = -1;
    public static lastPropSort = 'none';
    public static sortOption: Observable<string> = ko.observable('None');
    public static sortFactor: Observable<number> = ko.observable(-1);

    public static BASE_ITEMS_MAX = 3;
    public static BASE_ITEMS_MIN = 1;
    public static BASE_DAILY_DEALS_MAX = 3;
    public static BASE_BOMB_EFFICIENCY = 10;

    public static sizeX = 25;
    public static sizeY = 12;

    // Sort UndergroundItems.list whenever the sort method or quantities change
    public static sortedMineInventory: Computed<Array<UndergroundItem>> = ko.computed(function () {
        const sortOption = Underground.sortOption();
        const direction = Underground.sortFactor();
        return UndergroundItems.list.sort((a: UndergroundItem, b: UndergroundItem) => {
            let result = 0;
            switch (sortOption) {
                case 'Amount':
                    result = (player.itemList[a.itemName]() - player.itemList[b.itemName]()) * direction;
                    break;
                case 'Value':
                    result = (a.value - b.value) * direction;
                    break;
                case 'Item':
                    result = a.name > b.name ? direction : -direction;
                    break;
            }
            if (result == 0) {
                return a.id - b.id;
            }
            return result;
        });
    });

    public static netWorthTooltip: Computed<string> = ko.pureComputed(() => {
        let nMineItems = 0;
        let nFossils = 0;
        let nPlates = 0;
        let nShards = 0;
        UndergroundItems.list.forEach(mineItem => {
            if (mineItem.valueType == UndergroundItemValueType.Diamond) {
                nMineItems += player.itemList[mineItem.itemName]();
            } else if (mineItem.valueType == UndergroundItemValueType.Fossil) {
                nFossils += player.itemList[mineItem.itemName]();
            } else if (mineItem.valueType == UndergroundItemValueType.Gem) {
                nPlates += player.itemList[mineItem.itemName]();
            } else if (mineItem.valueType == UndergroundItemValueType.Shard) {
                nShards += player.itemList[mineItem.itemName]();
            }
        });

        return `<u>Owned:</u><br>Mine items: ${nMineItems.toLocaleString('en-US')}<br>Fossils: ${nFossils.toLocaleString('en-US')}<br>Plates: ${nPlates.toLocaleString('en-US')}<br>Shards: ${nShards.toLocaleString('en-US')}`;
    });

    public tradeAmount: Observable<number> = ko.observable(1).extend({ numeric: 0 });

    public static shortcutVisible: Computed<boolean> = ko.pureComputed(() => {
        return App.game.underground.canAccess() && !Settings.getSetting('showUndergroundModule').observableValue();
    });

    constructor() {
        this.tradeAmount.subscribe((value) => {
            if (value < 0) {
                this.tradeAmount(0);
            }
        });
    }

    static get globalCooldown(): number {
        const cellBatteryBonus = App.game.oakItems.isActive(OakItemType.Cell_Battery) ?
            App.game.oakItems.calculateBonus(OakItemType.Cell_Battery)
            :
            1;

        return Math.max(5 - 0.25 * Underground.undergroundLevel(), 0.1) / cellBatteryBonus;
    }

    initialize() {

    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(delta: number) {
    }

    getMaxItems() {
        return Underground.BASE_ITEMS_MAX;
    }

    getDailyDealsMax() {
        return Underground.BASE_DAILY_DEALS_MAX;
    }

    getBombEfficiency() {
        return Underground.BASE_BOMB_EFFICIENCY;
    }

    getSizeY() {
        return Underground.sizeY;
    }

    getMinItems() {
        return Underground.BASE_ITEMS_MIN;
    }

    public static showMine() {
        let html = '';
        for (let i = 0; i < Mine.grid.length; i++) {
            html += '<div class="row">';
            for (let j = 0; j < Mine.grid[0].length; j++) {
                html += Underground.mineSquare(Mine.grid[i][j](), i, j);
            }
            html += '</div>';
        }
        $('#mineBody').html(html);
    }

    private static mineSquare(amount: number, i: number, j: number): string {
        if (Mine.rewardGrid[i][j] != 0 && Mine.grid[i][j]() == 0) {
            Mine.rewardGrid[i][j].revealed = 1;
            const image = UndergroundItems.getById(Mine.rewardGrid[i][j].value).undergroundImage;
            return `<div data-bind='css: Underground.calculateCssClass(${i},${j})' data-i='${i}' data-j='${j}'><div class="mineReward size-${Mine.rewardGrid[i][j].sizeX}-${Mine.rewardGrid[i][j].sizeY} pos-${Mine.rewardGrid[i][j].x}-${Mine.rewardGrid[i][j].y} rotations-${Mine.rewardGrid[i][j].rotations}" style="background-image: url('${image}');"></div></div>`;
        } else {
            return `<div data-bind='css: Underground.calculateCssClass(${i},${j})' data-i='${i}' data-j='${j}'></div>`;
        }
    }

    public static calculateCssClass(i: number, j: number): string {
        return `col-sm-1 rock${Math.max(Mine.grid[i][j](), 0)} mineSquare ${Mine.Tool[Mine.toolSelected()]}Selected`;
    }

    public static gainMineItem(id: number, num = 1) {
        const item = UndergroundItems.getById(id);
        ItemList[item.itemName].gain(num);
    }

    public static getDiamondNetWorth(): number {
        let diamondNetWorth = 0;
        UndergroundItems.list.forEach(mineItem => {
            if (mineItem.valueType == UndergroundItemValueType.Diamond) {
                diamondNetWorth += mineItem.value * player.itemList[mineItem.itemName]();
            }
        });

        return diamondNetWorth + App.game.wallet.currencies[Currency.diamond]();
    }

    public static getCumulativeValues(): Record<string, { cumulativeValue: number, imgSrc: string }> {
        const cumulativeValues = {};
        UndergroundItems.list.forEach(item => {
            if (item.hasSellValue() && player.itemList[item.itemName]() > 0 && !item.sellLocked()) {
                let valueType;
                switch (item.valueType) {
                    case UndergroundItemValueType.Gem:
                        valueType = `${PokemonType[item.type]} Gems`;
                        break;
                    case UndergroundItemValueType.Diamond:
                    default:
                        valueType = `${UndergroundItemValueType[item.valueType]}s`;
                }

                let cumulativeValueOfType = cumulativeValues[valueType];
                if (!cumulativeValueOfType) {
                    cumulativeValueOfType = { cumulativeValue: 0 };
                    // Set image source
                    if (item.valueType == UndergroundItemValueType.Diamond) {
                        cumulativeValueOfType.imgSrc = 'assets/images/underground/diamond.svg';
                    } else {
                        cumulativeValueOfType.imgSrc = item.image;
                    }
                    cumulativeValues[valueType] = cumulativeValueOfType;
                }

                cumulativeValueOfType.cumulativeValue += item.value * player.itemList[item.itemName]();
            }
        });

        return cumulativeValues;
    }

    public static updateTreasureSorting(newSortOption: string) {
        if (Underground.sortOption() === newSortOption) {
            Underground.sortFactor(Underground.sortFactor() * -1);
        } else {
            Underground.sortOption(newSortOption);
        }
    }

    public static playerHasMineItems(): boolean {
        return UndergroundItems.list.some(i => player.itemList[i.itemName]());
    }

    public static sellMineItem(item: UndergroundItem, amount = 1) {
        if (item.sellLocked()) {
            Notifier.notify({
                message: 'Item is locked for selling, you first have to unlock it.',
                type: NotificationConstants.NotificationOption.warning,
            });
            return;
        }
        if (item.valueType == UndergroundItemValueType.Fossil) {
            amount = 1;
        }
        const curAmt = player.itemList[item.itemName]();
        if (curAmt > 0) {
            const sellAmt = Math.min(curAmt, amount);
            const success = Underground.gainProfit(item, sellAmt);
            if (success) {
                player.loseItem(item.itemName, sellAmt);
            }
            return;
        }
    }

    public static sellAllMineItems() {
        UndergroundItems.list.forEach((item) => {
            if (!item.sellLocked() && item.hasSellValue()) {
                Underground.sellMineItem(item, Infinity);
            }
        });
        $('#mineSellAllTreasuresModal').modal('hide');
    }

    private static gainProfit(item: UndergroundItem, amount: number): boolean {
        let success = true;
        switch (item.valueType) {
            case UndergroundItemValueType.Diamond:
                App.game.wallet.gainDiamonds(item.value * amount);
                break;
            case UndergroundItemValueType.Fossil:
                if (!App.game.breeding.hasFreeEggSlot()) {
                    return false;
                }
                success = App.game.breeding.gainEgg(App.game.breeding.createFossilEgg(item.name));
                break;
            case UndergroundItemValueType.Gem:
                const type = item.type;
                App.game.gems.gainGems(PLATE_VALUE * amount, type);
                break;
            // Nothing else can be sold
            default:
                return false;
        }
        return success;
    }

    openUndergroundModal() {
        if (this.canAccess()) {
            $('#mineModal').modal('show');
        } else {
            Notifier.notify({
                message: 'You need the Explorer Kit to access this location.\n<i>Check out the shop at Cinnabar Island.</i>',
                type: NotificationConstants.NotificationOption.warning,
            });
        }
    }

    openUndergroundSellAllModal() {
        if (this.canAccess()) {
            if (Object.keys(Underground.getCumulativeValues()).length == 0) {
                Notifier.notify({
                    message: 'You have no items selected for selling.',
                    type: NotificationConstants.NotificationOption.warning,
                });
                return;
            }
            $('#mineSellAllTreasuresModal').modal('show');
        } else {
            Notifier.notify({
                message: 'You need the Explorer Kit to access this location.\n<i>Check out the shop at Cinnabar Island.</i>',
                type: NotificationConstants.NotificationOption.warning,
            });
        }
    }

    public canAccess() {
        return MapHelper.accessToRoute(11, 0) && App.game.keyItems.hasKeyItem(KeyItemType.Explorer_kit);
    }

    public increaseTradeAmount(amount: number) {
        this.tradeAmount(this.tradeAmount() + amount);
    }

    public multiplyTradeAmount(amount: number) {
        this.tradeAmount(this.tradeAmount() * amount);
    }

    public static addUndergroundExp(amount: number) {
        if (isNaN(amount)) {
            return;
        }

        const currentLevel = Underground.undergroundLevel();
        GameHelper.incrementObservable(Underground.undergroundExp, amount);

        if (Underground.undergroundLevel() > currentLevel) {
            Notifier.notify({
                message: `Your Underground level has increased to ${Underground.undergroundLevel()}!`,
                type: NotificationConstants.NotificationOption.success,
                timeout: 1e4,
            });
        }
    }

    public static convertLevelToExperience(level: number): number {
        let total = 0;
        for (let i = 0; i < level; ++i) {
            total = Math.floor(total + i + 300 * Math.pow(2, i / 7));
        }
        return Math.floor(total / 4);
    }

    public static convertExperienceToLevel(experience: number): number {
        let level = 0;
        while (experience >= this.convertLevelToExperience(level + 1)) {
            ++level;
        }
        return level;
    }

    fromJSON(json: Record<string, any>): void {
        if (!json) {
            console.warn('Underground not loaded.');
            return;
        }

        const mine = json.mine;
        if (mine) {
            Mine.loadSavedMine(mine);
        } else {
            Mine.loadMine();
        }
        UndergroundItems.list.forEach(it => it.sellLocked(json.sellLocks[it.itemName] || false));

        Underground.undergroundExp(json.undergroundExp || this.defaults.undergroundExp);
    }

    toJSON(): Record<string, any> {
        const undergroundSave: Record<string, any> = {};
        undergroundSave.undergroundExp = Underground.undergroundExp();
        undergroundSave.mine = Mine.save();
        undergroundSave.sellLocks = UndergroundItems.list.reduce((sellLocks, item) => {
            if (item.sellLocked()) {
                sellLocks[item.itemName] = true;
            }
            return sellLocks;
        }, {});
        return undergroundSave;
    }
}

$(document).ready(() => {
    $('body').on('click', '.mineSquare', function () {
        Mine.click(parseInt(this.dataset.i, 10), parseInt(this.dataset.j, 10));
    });
});

namespace Underground {
}
