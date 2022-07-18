class RoamerNPC extends NPC {

    constructor(
        public name: string,
        public dialog: string[],
        public region: GameConstants.Region,
        public subRegionRoamerGroup: number
    ) {
        super(name, dialog);
    }

    get dialogHTML(): string {
        const route = RoamingPokemonList.getIncreasedChanceRouteBySubRegionGroup(this.region, this.subRegionRoamerGroup);
        const roamers = RoamingPokemonList.getSubRegionalGroupRoamers(this.region, this.subRegionRoamerGroup);

        // If no roaming Pokemon yet
        if (!roamers.length) {
            return `There hasn't been any reports of roaming Pokémon around ${GameConstants.camelCaseToString(GameConstants.Region[this.region])} lately.`;
        }

        const roamersHTML = roamers.map(r => `<img width="64px" src="assets/images/pokemon/${r.pokemon.id}.png" />`).join('');

        return super.dialogHTML.replace(/{ROUTE_NAME}/g, route()?.routeName) + roamersHTML;
    }
}
