<template>
  <div>
    <h1>Recipes <button class="btn btn-sm btn-primary" type="button" @click="addingRecipe = true" >New Recipe</button></h1>
    <div class="d-flex flex-wrap">
      <router-link v-for="recipe in recipes"
          :to="{ name: 'recipe', params: { id: recipe.id } }"
          :key="recipe.id"
          class="card recipe-card m-3">
        <div class="card-body">
          <h5 class="card-title">{{ recipe.name }}</h5>
        </div>
      </router-link>
    </div>
    <recipe-form :class="['slide-up', { in: addingRecipe }]" @submit="addRecipe" />
  </div>
</template>

<script>
import RecipeForm from '@/components/RecipeForm.vue';

export default {
  name: 'Recipes',
  components: { RecipeForm },
  data() {
    return {
      addingRecipe: false,
    };
  },
  computed: {
    recipes() {
      return this.$store.state.recipes;
    },
  },
  methods: {
    addRecipe({ recipe, ingredients }) {
      return this.$store.dispatch('addRecipe', { recipe, ingredients });
    },
  },
  created() {
    this.$store.dispatch('bindRecipes');
  },
};
</script>

<style scoped lang="scss">
.recipe-card {
  width: 20rem;
}
</style>
