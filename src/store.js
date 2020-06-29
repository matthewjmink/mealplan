import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations, firestoreAction } from 'vuexfire';
import { db } from './db';

Vue.use(Vuex);

const excludeId = function stripIdParamFromObject(obj) {
  const { id, ...newObj } = obj;
  return newObj;
};

export default new Vuex.Store({
  state: {
    recipes: [],
    ingredients: [],
  },

  mutations: {
    ...vuexfireMutations,
  },

  actions: {
    bindIngredients: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('ingredients', db.collection('ingredients'))),

    addIngredient: firestoreAction((context, ingredient) => db.collection('ingredients').add(excludeId(ingredient))),

    bindRecipes: firestoreAction(({ bindFirestoreRef }) => bindFirestoreRef('recipes', db.collection('recipes'))),

    addRecipe: firestoreAction(async (context, { recipe, ingredients }) => {
      const batch = db.batch();
      const recipeDocRef = db.collection('recipes').doc();
      batch.set(recipeDocRef, excludeId(recipe));
      ingredients.forEach((ingredient) => {
        const { ingredient: ingredientId, ...ingredientProps } = ingredient;
        const ingredientDocRef = recipeDocRef.collection('ingredients').doc();
        batch.set(ingredientDocRef, {
          ingredient: db.collection('ingredients').doc(ingredientId),
          ...ingredientProps,
        });
      });
      return batch.commit();
    }),

    addPlanRecipe: firestoreAction((context, planRecipe) => db.collection('plan-recipes').add(excludeId(planRecipe))),

    updateRecipe: firestoreAction((context, { recipe }) => {
      const batch = db.batch();
      const recipeDocRef = db.collection('recipes').doc(recipe.id);
      batch.update(recipeDocRef, excludeId(recipe));
      // TODO: Need to save ingredient updates here
      return batch.commit();
    }),
  },
});
