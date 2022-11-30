import apiClient from 'api';
import {UpdateRecipeProps, RecipeProps} from 'store/recipes/recipes.types';

const recipesService = {
  async getRecipes(limit: number, offset: number) {
    return await apiClient.get<{recipes: RecipeProps[]}>('recipe', {
      params: {
        limit,
        offset,
      },
      headers: {
        'x-3scale-bypass': 'c49e69471a7b51beb2bb0e452ef53867385f7a5a',
      },
    });
  },
  async createRecipe(recipe: UpdateRecipeProps) {
    return await apiClient.post<RecipeProps>('recipe', {
      recipe,
    });
  },
  async updateRecipe(recipe: UpdateRecipeProps) {
    return await apiClient.put<RecipeProps>(`recipe/${recipe.id || ''}`, {
      recipe,
    });
  },
  async deleteRecipe(recipeId: string) {
    return await apiClient.delete(`recipe/${recipeId}`);
  },
  async getRecipeById(id: string) {
    return await apiClient.get(`recipe/${id}`);
  },
  async getIngridients({
    query,
    line_delimited,
    use_raw_foods,
  }: {
    query: string;
    line_delimited?: boolean;
    use_raw_foods?: boolean;
  }) {
    return await apiClient.post(
      'natural/nutrients',
      {
        query,
        line_delimited: line_delimited ?? true,
        use_raw_foods: use_raw_foods ?? true,
      },
      {
        headers: {
          'x-3scale-bypass': 'c49e69471a7b51beb2bb0e452ef53867385f7a5a',
        },
      },
    );
  },
};

export default recipesService;
