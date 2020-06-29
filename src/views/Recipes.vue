<template>
  <div>
    <h1>Recipes <button class="btn btn-sm btn-primary" type="button" @click="isAddingRecipe = true" >New Recipe</button></h1>
    <div class="row">
      <div v-for="recipe in recipes"
          :key="recipe.id"
          class="col-md-4">
        <router-link :to="{ name: 'recipe', params: { id: recipe.id } }" class="card">
          <div class="card-body">
            <h5 class="card-title">{{ recipe.name }}</h5>
          </div>
        </router-link>
      </div>
    </div>

    <modal size="xl" v-if="isAddingRecipe" @close="isAddingRecipe = false">
      <div slot="title">New Recipe</div>

      <recipe-form @submit="addRecipe"
          ref="recipeForm"
          btn-class="d-none" />

      <div slot="footer">
        <button class="btn btn-outline-secondary mr-2" @click="isAddingRecipe = false;">Close</button>
        <button class="btn btn-primary" @click="submitRecipeForm">Save Recipe</button>
      </div>
    </modal>
  </div>
</template>

<script>
import RecipeForm from '@/components/RecipeForm.vue';
import Modal from '@/components/Modal.vue';

export default {
  name: 'Recipes',
  components: { Modal, RecipeForm },
  data() {
    return {
      isAddingRecipe: false,
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
    submitRecipeForm() {
      this.$refs.recipeForm.saveRecipe();
    },
  },
  created() {
    this.$store.dispatch('bindRecipes');
  },
};
</script>
