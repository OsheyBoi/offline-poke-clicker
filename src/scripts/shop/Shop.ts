class Shop {
    items: KnockoutObservableArray<Item>;

    constructor(items: string[]) {
        const itemList: Item[] = [];

        for (const item of items) {
            itemList.push(ItemList[item]);
        }

        this.items = ko.observableArray(itemList);
    }
}

