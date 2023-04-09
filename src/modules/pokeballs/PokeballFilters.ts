/* eslint-disable class-methods-use-this */
import { ObservableArray } from 'knockout';
import { Feature } from '../DataStore/common/Feature';
import KeyItemType from '../enums/KeyItemType';
import { Pokeball, Pokerus } from '../GameConstants';
import PokeballFilter, { PokeballFilterParams } from './PokeballFilter';
import { PokeballFilterOptions, settingsMap } from './PokeballFilterOptions';
import Notifier from '../notifications/Notifier';
import NotificationOption from '../notifications/NotificationOption';

export default class PokeballFilters implements Feature {
    name = 'Pokeball Filters';
    saveKey = 'pokeballFilters';
    defaults = {};

    public presets: PokeballFilterParams[] = [
        { name: 'New Shiny', options: { shiny: true, caughtShiny: false }, ball: Pokeball.Pokeball },
        { name: 'New', options: { caught: false }, ball: Pokeball.Pokeball },
        { name: 'Caught Shiny', options: { shiny: true, caughtShiny: true }, ball: Pokeball.Pokeball },
        { name: 'Contagious', options: { pokerus: Pokerus.Contagious } },
        { name: 'Caught', options: { caught: true } },
    ];

    public list: ObservableArray<PokeballFilter> = ko.observableArray([]);
    public displayList = ko.pureComputed(
        () => this.list()
            .filter((f) => !PokeballFilters.hideFilter(f))
            .reverse(),
    );

    public testSettings = Object.fromEntries(
        Object.entries(settingsMap).map(([k, fn]) => [k, fn()]),
    );
    public testSettingsData = ko.pureComputed(() =>
        Object.fromEntries(Object.entries(this.testSettings).map(([k, v]) => [k, v.observableValue()])),
    );

    public static hideFilter(filter: PokeballFilter) {
        return filter.options.pokerus !== undefined && !App.game.keyItems.hasKeyItem(KeyItemType.Pokerus_virus);
    }

    initialize() {}

    canAccess() { return true; }

    update() {}

    getFilterByName(name: string) {
        return this.list().find((filter) => filter.name === name);
    }

    findMatch(data: PokeballFilterOptions): PokeballFilter | undefined {
        return this.list().find((filter) => filter.test(data));
    }

    async deleteFilter(filter: PokeballFilter) {
        if (await Notifier.confirm({
            title: 'Delete pokeball filter',
            message: `Are you sure you want to delete "${filter.name}"?`,
            type: NotificationOption.danger,
        })) {
            this.list.remove(filter);
        }
    }

    createFilter() {
        // Starts disabled so it doesn't interfere with existing filters
        this.list.unshift(new PokeballFilter('New Filter', {}, undefined, false));
    }

    addFilterOption(filter: PokeballFilter, option: keyof PokeballFilterOptions) {
        if (filter.options[option]) {
            // Don't replace the option if it exists already
            return;
        }
        const newOptions = {
            ...filter.options,
            [option]: settingsMap[option](),
        };
        filter.options = newOptions;
    }

    removeFilterOption(filter: PokeballFilter, option: keyof PokeballFilterOptions) {
        // Make a copy to put in observable, to make sure UI is updated properly
        const newOptions = { ...filter.options };
        delete newOptions[option];
        filter.options = newOptions;
    }

    async reset() {
        if (!(await Notifier.confirm({
            title: 'Reset filters to defaults',
            message: 'Are you sure you want to reset your filters to the default ones?',
        }))) {
            return;
        }

        const defaultFilters = this.presets.map(({ name, options, ball, enabled, inverted }) => (
            new PokeballFilter(name, options, ball, enabled, inverted)
        ));

        this.list(defaultFilters);
    }

    toJSON() {
        return {
            list: this.list().map((pf) => pf.toJSON()),
        };
    }

    fromJSON(json: Record<string, any>): void {
        if (json === null) {
            return;
        }

        const list: PokeballFilterParams[] = json.list?.length > 0
            ? json.list
            : this.presets;

        list.forEach(({ name, options, ball, inverted, enabled }) => {
            this.list.push(new PokeballFilter(
                name,
                options,
                ball,
                enabled,
                inverted,
            ));
        });
    }
}
