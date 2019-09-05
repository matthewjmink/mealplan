<template>
  <div>
    <h1>{{ recipe.name }}</h1>
    <h2>Ingredients</h2>
    <ul class="ingredient-list">
        <li v-for="ingredient in selectedIngredients" :key="ingredient.id">
            {{ ingredient.quantity }} {{ measureAbbr(ingredient.measure, ingredient.quantity) }} {{ ingredient.name }}
        </li>
    </ul>
  </div>
</template>

<script>
// import RecipeForm from '@/components/RecipeForm.vue';
import { db } from '@/db';
import measuresMixin from '@/mixins/measures';

export default {
  name: 'Recipe',
  // components: { RecipeForm },
  mixins: [measuresMixin],
  data() {
    return {
      recipe: {},
      ingredients: [],
    };
  },
  computed: {
    selectedIngredients() {
      return this.ingredients.map((ingredient) => {
        const { name } = this.$store.state.ingredients.find(({ id }) => ingredient.ingredient === id);
        return { ...ingredient, name };
      });
    },
  },
  methods: {
    save(recipe) {
      return this.$store.dispatch('editRecipe', recipe);
    },
  },
  created() {
    const recipeId = this.$route.params.id;
    db.collection('recipes')
      .doc(recipeId)
      .onSnapshot((recipe) => {
        this.recipe = recipe.data();
      });
    db.collection(`recipes/${recipeId}/ingredients`)
      .onSnapshot((ingredientCollection) => {
        this.ingredients = ingredientCollection.docs.map((snapshot) => {
          const { ingredient: ingredientRef, measure, quantity } = snapshot.data();
          return {
            ingredient: ingredientRef.id,
            measure,
            quantity,
          };
        });
      });
  },
};
</script>
