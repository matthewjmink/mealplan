<template>
  <article>
    <header class="mb-4">
      <h2 class="d-inline-block">{{ recipe.name }}</h2>
      <br class="d-sm-none">
      <button class="btn btn-sm btn-link ml-sm-3" @click="isEditingRecipe = true"><edit-icon class="icon" /> edit</button>
      <button class="btn btn-sm btn-link ml-2"><print-icon class="icon" /> print</button>
      <!-- TODO: Print view -->
    </header>

    <section id="ingredients" class="mb-5">
      <h2 class="section-label">Ingredients</h2>
      <ul class="ingredient-list">
          <li v-for="ingredient in selectedIngredients" :key="ingredient.id">
              {{ ingredient.quantity }} {{ measureAbbr(ingredient.measure, ingredient.quantity) }} {{ ingredient.name }}
          </li>
      </ul>
    </section>

    <section id="directions" class="mb-5">
      <h2 class="section-label">Directions</h2>
      <div class="p-list description-list" v-html="recipe.directions"></div>
    </section>

    <section id="reference" class="mb-5" v-if="recipe.refName && recipe.refPage">
      <h2 class="section-label bg-gray">Source</h2>
      <div>
        <span class="font-italic text-large">{{ recipe.refName }}</span>
        <a v-if="recipe.refType === 'Website'" :href="recipe.refPage" class="ml-3"><external-link-icon class="icon" /> visit</a>
        <span v-else class="small">, p {{ recipe.refPage }}</span>
      </div>
    </section>

    <modal size="xl" v-show="isEditingRecipe" @close="isEditingRecipe = false">
      <div slot="title">Edit {{ recipe.name }}</div>

      <recipe-form :recipe="recipe"
          :ingredients="ingredients"
          @submit="updateRecipe"
          btn-class="d-none"
          ref="recipeForm" />

      <div slot="footer">
        <button class="btn btn-outline-secondary mr-2" @click="isEditingRecipe = false;">Close</button>
        <button class="btn btn-primary" @click="submitRecipeForm">Save Recipe</button>
      </div>
    </modal>

  </article>
</template>

<script>
import ExternalLinkIcon from 'feather-icons/dist/icons/external-link.svg';
import EditIcon from 'feather-icons/dist/icons/edit-2.svg';
import PrintIcon from 'feather-icons/dist/icons/printer.svg';
import RecipeForm from '@/components/RecipeForm.vue';
import Modal from '@/components/Modal.vue';
import { db } from '@/db';
import { excludeId } from '@/utils';
import measuresMixin from '@/mixins/measures';

export default {
  name: 'Recipe',
  components: {
    EditIcon, ExternalLinkIcon, Modal, PrintIcon, RecipeForm,
  },
  mixins: [measuresMixin],
  data() {
    return {
      recipe: {},
      ingredients: [],
      isEditingRecipe: false,
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
    async updateRecipe({ recipe, ingredients }) {
      const loading = this.$loading('Saving recipe...');
      const batch = db.batch();
      batch.update(this.recipeRef, excludeId(recipe));
      ingredients.forEach((ingredient) => {
        const { id, ingredient: ingredientId, ...recipeIngredient } = ingredient;
        const recipeIngredientDoc = id ? this.ingredientsRef.doc(id) : this.ingredientsRef.doc();
        batch.set(recipeIngredientDoc, {
          ...recipeIngredient,
          ingredient: db.collection('ingredients').doc(ingredientId),
        });
      });
      await batch.commit();
      this.isEditingRecipe = false;
      loading.remove();
    },
    submitRecipeForm() {
      this.$refs.recipeForm.saveRecipe();
    },
  },
  created() {
    const recipeId = this.$route.params.id;

    this.recipeRef = db.collection('recipes').doc(recipeId);
    this.ingredientsRef = db.collection(`recipes/${recipeId}/ingredients`);

    this.recipeRef.onSnapshot((recipe) => {
      this.recipe = { id: recipeId, ...recipe.data() };
    });

    this.ingredientsRef.onSnapshot((ingredientCollection) => {
      this.ingredients = ingredientCollection.docs.map((snapshot) => {
        const { ingredient: ingredientRef, measure, quantity } = snapshot.data();
        return {
          id: snapshot.id,
          ingredient: ingredientRef.id,
          measure,
          quantity,
        };
      });
    });
  },
};
</script>

<style lang="scss" scoped>
@import '~@/scss/config';
@import '~@/scss/mixins';

.description-list {
  ::v-deep p {
    margin-bottom: .75rem;
  }
}

</style>
