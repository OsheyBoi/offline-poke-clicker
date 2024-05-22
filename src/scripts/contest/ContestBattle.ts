///<reference path="../Battle.ts"/>
class ContestBattle extends Battle {
    static enemyPokemon: KnockoutObservable<ContestBattlePokemon> = ko.observable(null);

    static trainer: KnockoutObservable<ContestTrainer> = ko.observable(null);
    static trainerIndex: KnockoutObservable<number> = ko.observable(0);
    static pokemonIndex: KnockoutObservable<number> = ko.observable(0);
    static trainerStreak: KnockoutObservable<number> = ko.observable(0);

    public static pokemonAttack() {
        if (ContestRunner.running()) {
            const now = Date.now();
            if (ContestBattle.lastPokemonAttack > now - 900) {
                return;
            }
            ContestBattle.lastPokemonAttack = now;
            if (!ContestBattle.enemyPokemon()?.isAlive()) {
                return;
            }
            // damage enemy and rally audience every tick
            ContestBattle.enemyPokemon().damage(ContestHelper.calculatePokemonContestAppeal(ContestBattle.enemyPokemon().contestType1, ContestBattle.enemyPokemon().contestType2, ContestBattle.enemyPokemon().contestType3));
            // increase the audience bar
            ContestRunner.rally(ContestHelper.calculatePokemonContestAppeal(ContestRunner.type()));

            if (!ContestBattle.enemyPokemon().isAlive()) {
                // increase audience bar based off health, type, and index of defeated pokemon
                ContestRunner.rally(
                    Math.floor(
                        (ContestBattle.enemyPokemon().maxHealth()
                        * ContestTypeHelper.getAppealModifier(ContestBattle.enemyPokemon().contestType1, ContestBattle.enemyPokemon().contestType2, ContestBattle.enemyPokemon().contestType3, ContestRunner.type(), ContestType.None, ContestType.None)
                        * (1 + ContestBattle.pokemonIndex() * 0.2))
                    )
                );
                ContestBattle.defeatPokemon();
            }
        }
    }

    public static clickAttack() {
        if (ContestRunner.running()) {
            return;
        }
    }
    /**
     * Award the player with exp, and go to the next pokemon
     */
    public static defeatPokemon() {
        ContestBattle.enemyPokemon().defeat(true);

        // Make contest "route" regionless
        App.game.breeding.progressEggsBattle(ContestRunner.rank() * 3 + 1, GameConstants.Region.none);

        // Check if all of the trainer's party has been used
        if (ContestBattle.pokemonIndex() + 1 >= ContestRunner.getTrainerList()[ContestBattle.trainerIndex()].getTeam().length) {

            // Reset pokemon index for next trainer
            ContestBattle.pokemonIndex(0);

            // Loop through trainers
            if (ContestBattle.trainerIndex() + 1 >= ContestRunner.getTrainerList().length) {
                ContestBattle.trainerIndex(0);
            } else {
                // move to next trainer
                ContestBattle.trainerIndex(ContestBattle.trainerIndex() + 1);
                // increase trainer streak
                ContestBattle.trainerStreak(ContestBattle.trainerStreak() + 1);
            }

        } else {
            // Move to next pokemon
            ContestBattle.pokemonIndex(ContestBattle.pokemonIndex() + 1);
        }

        ContestBattle.generateNewEnemy();
        player.lowerItemMultipliers(MultiplierDecreaser.Battle);
    }

    /**
     * Reset the counter.
     */
    public static generateNewEnemy() {
        ContestBattle.counter = 0;
        ContestBattle.trainer(ContestRunner.getTrainerList()[ContestBattle.trainerIndex()]);
        ContestBattle.enemyPokemon(PokemonFactory.generateContestTrainerPokemon(ContestBattle.trainerIndex(), ContestBattle.pokemonIndex()));

        ContestBattle.enemyPokemon().health(ContestBattle.enemyPokemon().health() * 8 * ContestRunner.rank() * (1 + 0.2 * ContestBattle.trainerStreak()));
        ContestBattle.enemyPokemon().maxHealth(ContestBattle.enemyPokemon().maxHealth() * 8 * ContestRunner.rank() * (1 + 0.2 * ContestBattle.trainerStreak()));
    }

    // Increase and keep track of the amount of trainers defeated
    public static trainersDefeatedComputable: KnockoutComputed<number> = ko.pureComputed(() => {
        return ContestBattle.trainerStreak();
    });

    public static pokemonContestAppealTooltip: KnockoutComputed<string> = ko.pureComputed(() => {
        if (ContestBattle.enemyPokemon()) {
            const pokemonAppeal = ContestHelper.calculatePokemonContestAppeal(ContestBattle.enemyPokemon().contestType1, ContestBattle.enemyPokemon().contestType2, ContestBattle.enemyPokemon().contestType3);
            return `${pokemonAppeal.toLocaleString('en-US')} against ${ContestBattle.enemyPokemon().displayName}`;
        } else {
            return '';
        }
    }).extend({rateLimit: 1000});
}
