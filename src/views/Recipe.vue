<template>
  <div>
    <h1>{{ recipe.name }}</h1>
    <div class="text-sm">
      {{ ingredients }}
    </div>
  </div>
</template>

<script>
// import RecipeForm from '@/components/RecipeForm.vue';

export default {
  name: 'Recipe',
  // components: { RecipeForm },
  data() {
    return {
      recipe: {},
      ingredients: [],
    };
  },
  methods: {
    save(recipe) {
      return this.$store.dispatch('editRecipe', recipe);
    },
  },
  async created() {
    this.$store.dispatch('bindRecipe', this.$route.params.id).then((recipe) => {
      this.recipe = recipe;
    });
    this.ingredients = await this.$store.dispatch('bindRecipeIngredients', this.$route.params.id);
  },
};
</script>
