import BlendingRecipeType from '../enums/BlendingRecipeType';
import { Region } from '../GameConstants';
import GameHelper from '../GameHelper';
import MaxRegionRequirement from '../requirements/MaxRegionRequirement';
import BlendingRecipe from './BlendingRecipe';

export default class BlendingRecipes {
    public static blendingRecipeList: Record<BlendingRecipeType, BlendingRecipe[]> = {
        [BlendingRecipeType.Contest_Appeal]: [
            new BlendingRecipe('PokeBlock_Red', [40, 0, 0, 0, 0]),
            new BlendingRecipe('PokeBlock_Blue', [0, 40, 0, 0, 0]),
            new BlendingRecipe('PokeBlock_Pink', [0, 0, 40, 0, 0]),
            new BlendingRecipe('PokeBlock_Green', [0, 0, 0, 40, 0]),
            new BlendingRecipe('PokeBlock_Yellow', [0, 0, 0, 0, 40]),
            new BlendingRecipe('PokeBlock_White', [10, 10, 10, 10, 10]),
        ],
        [BlendingRecipeType.Contest_Type]: [
            // Todo: OneFromMany requirement(Max region or Contest won)
            new BlendingRecipe('PokeBlock_Cool', [3200, 0, 0, 0, 0], new MaxRegionRequirement(Region.kalos)),
            new BlendingRecipe('PokeBlock_Beautiful', [0, 3200, 0, 0, 0], new MaxRegionRequirement(Region.kalos)),
            new BlendingRecipe('PokeBlock_Cute', [0, 0, 3200, 0, 0], new MaxRegionRequirement(Region.kalos)),
            new BlendingRecipe('PokeBlock_Smart', [0, 0, 0, 3200, 0], new MaxRegionRequirement(Region.kalos)),
            new BlendingRecipe('PokeBlock_Tough', [0, 0, 0, 0, 3200], new MaxRegionRequirement(Region.kalos)),
            new BlendingRecipe('PokeBlock_Balanced', [2400, 2400, 2400, 2400, 2400], new MaxRegionRequirement(Region.kalos)),
        ],
        [BlendingRecipeType.Alcremie_Sweet]: [
        ],
    };

    public static recipeSet(type: BlendingRecipeType): BlendingRecipe[] {
        return Object.values(BlendingRecipes.blendingRecipeList[type]);
    }

    public static isUnlocked(type: BlendingRecipeType): boolean {
        return BlendingRecipes.getBlendingRecipeSet(type).some(r => r.isUnlocked());
    }

    public static getBlendingRecipeSet(type: BlendingRecipeType, filter: boolean = true): BlendingRecipe[] {
        const recipes = this.recipeSet(type);
        if (filter) {
            return recipes.filter(r => r.isUnlocked());
        } else {
            return recipes;
        }
    }
    
    public static getFullBlendingRecipeList(filter: boolean = true): BlendingRecipe[] {
        let recipes = [];
        GameHelper.enumNumbers(BlendingRecipeType).flatMap(key => {
            if (BlendingRecipes.isUnlocked(key) || !filter) {
                recipes = recipes.concat(BlendingRecipes.getBlendingRecipeSet(key));
            }
        });
        return recipes;
    }
}

