// importing only types, as we are "allowed" to have circular type dependencies
import type {
    Observable as KnockoutObservable,
    ObservableArray as KnockoutObservableArray,
    Computed as KnockoutComputed,
} from 'knockout';
import type LogBook from './logbook/LogBook';
import type BadgeCase from './DataStore/BadgeCase';
import type Profile from './profile/Profile';
import type Statistics from './DataStore/StatisticStore';
import type Challenges from './challenges/Challenges';
import type Multiplier from './multiplier/Multiplier';
import * as GameConstants from './GameConstants';
import type Wallet from './wallet/Wallet';
import type PokemonCategories from './party/Category';
import type OakItems from './oakItems/OakItems';
import type OakItemLoadouts from './oakItems/OakItemLoadouts';
import type SaveReminder from './saveReminder/SaveReminder';
import type Translate from './translation/Translation';
import type Achievement from './achievements/Achievement';
import type { AchievementSortOptions } from './achievements/AchievementSortOptions';
import type AchievementCategory from './achievements/AchievementCategory';
import type KeyItems from './keyItems/KeyItems';
import type PokeballFilters from './pokeballs/PokeballFilters';
import type { Underground } from './underground/Underground';
import type SubRegion from './subRegion/SubRegion';
import type CssVariableSetting from './settings/CssVariableSetting';

// These types are only temporary while we are converting things to modules
// As things are converted, we should import their types here for use,
// instead of these cheap imitations

// TODO types for classes not yet described
export type TmpUpdateType = any;
export type TmpBreedingType = any;
export type TmpPokeballsType = any;
export type TmpPartyType = any;
export type TmpGemsType = any;
export type TmpFarmingType = any;
export type TmpRedeemableCodesType = any;
export type TmpQuestsType = any;
export type TmpSpecialEventsType = any;
export type TmpDiscordType = any;
export type TmpAchievementTrackerType = any;
export type TmpBattleFrontierType = any;
export type TmpBattleCafeSaveObjectType = any;
export type TmpDreamOrbControllerType = any;
export type TmpPurifyChamberType = any;
export type TmpWeatherAppType = any;
export type TmpZMovesType = any;
export type TmpPokemonContestType = any;
export type TmpBattlePokemonType = any;
export type TmpMultiplierDecreaserType = any;
export type TmpTownType = any;

export type TmpGameType = {
    gameState: GameConstants.GameState;

    // constructor properties
    update: TmpUpdateType;
    profile: Profile;
    breeding: TmpBreedingType;
    pokeballs: TmpPokeballsType;
    pokeballFilters: PokeballFilters;
    wallet: Wallet;
    keyItems: KeyItems;
    badgeCase: BadgeCase;
    oakItems: OakItems;
    oakItemLoadouts: OakItemLoadouts;
    categories: PokemonCategories;
    party: TmpPartyType;
    gems: TmpGemsType;
    underground: Underground;
    farming: TmpFarmingType;
    logbook: LogBook;
    redeemableCodes: TmpRedeemableCodesType;
    statistics: Statistics;
    quests: TmpQuestsType;
    specialEvents: TmpSpecialEventsType;
    discord: TmpDiscordType;
    achievementTracker: TmpAchievementTrackerType;
    challenges: Challenges;
    battleFrontier: TmpBattleFrontierType;
    multiplier: Multiplier;
    saveReminder: SaveReminder;
    battleCafe: TmpBattleCafeSaveObjectType;
    dreamOrbController: TmpDreamOrbControllerType;
    purifyChamber: TmpPurifyChamberType;
    weatherApp: TmpWeatherAppType;
    zMoves: TmpZMovesType;
    pokemonContest: TmpPokemonContestType;

    // functions
    load: () => void;
    initialize: () => void;
    computeOfflineEarnings: () => void;
    checkAndFix: () => void;
    start: () => void;
    stop: () => void;
    gameTick: () => void;
    save: () => void;
};

export type TmpAppType = {
    debug: boolean;
    game: TmpGameType;
    isUsingClient: boolean;
    translation: Translate;
    start: () => void;
};

export type TmpSaveType = {
    counter: number;
    key: string;
    store: (player: TmpPlayerType) => void;
    getSaveObject: () => void;
    load: () => TmpPlayerType;
    download: () => void;
    copySaveToClipboard: () => void;
    delete: () => Promise<void>;
    filter: (object: any, keep: string[]) => Record<string, any>;
    initializeMultipliers: () => { [name: string]: number };
    initializeItemlist: () => { [name: string]: KnockoutObservable<number> };
    initializeGems: (saved?: Array<Array<number>>) => Array<Array<KnockoutObservable<number>>>;
    initializeEffects: (saved?: Array<string>) => { [name: string]: KnockoutObservable<number> };
    initializeEffectTimer: () => { [name: string]: KnockoutObservable<string> };
    loadFromFile: (file) => void;
    convert: () => void;
    convertShinies: (list: Array<any>) => void;
};

export type TmpPlayerType = {
    route: number;
    region: GameConstants.Region;
    subregion: number;
    townName: string;
    town: TmpTownType;
    timeTraveller: boolean;
    regionStarters: Array<KnockoutObservable<GameConstants.Starter>>;
    subregionObject: KnockoutObservable<SubRegion>;
    trainerId: string;
    itemList: { [name: string]: KnockoutObservable<number> };
    _lastSeen: number;
    effectList: { [name: string]: KnockoutObservable<number> };
    effectTimer: { [name: string]: KnockoutObservable<string> };
    highestRegion: KnockoutObservable<GameConstants.Region>;
    highestSubRegion: KnockoutObservable<number>;
    amountOfItem: (itemName: string) => number;
    itemMultipliers: () => { [p: string]: number };
    gainItem: (itemName: string, amount: number) => void;
    loseItem: (itemName: string, amount: number) => void;
    lowerItemMultipliers: (multiplierDecreaser: TmpMultiplierDecreaserType, amount?: number) => void;
    hasMegaStone: (megaStone: GameConstants.MegaStoneType) => boolean;
    gainMegaStone: (megaStone: GameConstants.MegaStoneType, notify?: boolean) => void;
    toJSON: () => Record<string, any>;
};

export type TmpBattleType = {
    enemyPokemon: KnockoutObservable<TmpBattlePokemonType | null>;
    counter: number;
    catching: KnockoutObservable<boolean>;
    catchRateActual: KnockoutObservable<number>;
    pokeball: KnockoutObservable<GameConstants.Pokeball>;
    lastPokemonAttack: number;
    lastClickAttack: number;
    route: number;
    tick: () => void;
    pokemonAttack: () => void;
    clickAttack: () => void;
    defeatPokemon: () => void;
    generateNewEnemy: () => void;
    catchPokemon: (enemyPokemon: TmpBattlePokemonType, route: number, region: GameConstants.Region) => void;
    gainTokens: (route: number, region: GameConstants.Region) => void;
    gainItem: () => void;
    pokemonAttackTooltip: KnockoutComputed<string>;
};

export type TmpMapHelperType = {
    getUsableFilters: () => CssVariableSetting[];
    moveToRoute: (route: number, region: GameConstants.Region) => void;
    routeExist: (route: number, region: GameConstants.Region) => boolean;
    normalizeRoute: (route: number, region: GameConstants.Region) => number;
    accessToRoute: (route: number, region: GameConstants.Region) => boolean;
    getCurrentEnvironment: () => GameConstants.Environment;
    calculateBattleCssClass: () => string;
    calculateRouteCssClass: (route: number, region: GameConstants.Region) => string;
    isRouteCurrentLocation: (route: number, region: GameConstants.Region) => boolean;
    isTownCurrentLocation: (townName: string) => boolean;
    calculateTownCssClass: (townName: string) => string;
    accessToTown: (townName: string) => boolean;
    moveToTown: (townName: string) => void;
    validRoute: (route: number, region: GameConstants.Region) => boolean;
    openShipModal: () => void;
    ableToTravel: () => boolean;
    travelToNextRegion: () => void;
};

export type TmpDungeonRunnerType = {
    dungeon: {
        name: string
    };
};

export type TmpGymType = {
    town: string;
};

export type TmpGymRunnerType = {
    gymObservable: () => TmpGymType;
};

export type TmpAchievementHandlerType = {
    achievementList: Achievement[];
    navigateIndex: KnockoutObservable<number>;
    achievementListFiltered: KnockoutObservableArray<Achievement>;
    numberOfTabs: KnockoutObservable<number>;
    setNavigateIndex: (index: number) => void;
    navigateRight: () => void;
    navigateLeft: () => void;
    isNavigateDirectionDisabled: (navigateBackward: boolean) => boolean;
    calculateNumberOfTabs: () => void;
    filter: Record<string, any>;
    getAchievementListWithIndex: () => void;
    cachedSortedList: Achievement[];
    achievementSortedList: KnockoutComputed<any[]>;
    filterAchievementList: (retainPage: boolean) => void;
    compareBy: (option: AchievementSortOptions, direction: boolean) => (a: Achievement, b: Achievement) => number;
    preCheckAchievements: () => void;
    checkAchievements: () => void;
    addAchievement: (...rest) => void;
    calculateBonus: () => void;
    calculateMaxBonus: () => void;
    achievementBonus: () => number;
    achievementBonusPercent: () => string;
    findByName: (name: string) => Achievement;
    getAchievementCategories: () => AchievementCategory[];
    getAchievementCategoryByRegion: (region: GameConstants.Region) => AchievementCategory;
    getAchievementCategoryByExtraCategory: (category: GameConstants.ExtraAchievementCategories) => AchievementCategory;
    initialize: (multiplier: Multiplier, challenges: Challenges) => void;
    load: () => void;
};