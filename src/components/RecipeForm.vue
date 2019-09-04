<template>
  <form @submit.prevent="saveRecipe">
    <div class="form-group">
      <label for="recipeName">Recipe Name</label>
      <input v-model="localRecipe.name"
          type="text"
          class="form-control"
          id="recipeName">
    </div>
    <div class="form-group">
      <label for="sourceType">Source Type</label>
      <select v-model="localRecipe.refType"
          class="form-control"
          id="sourceType">
        <option value="Book">Book</option>
        <option value="Website">Website</option>
      </select>
    </div>
    <div class="form-group">
      <label for="sourceName">Source Name</label>
      <input v-model="localRecipe.refName"
          type="text"
          class="form-control"
          id="sourceName"
          :placeholder="localRecipe.refType === 'Website' ? 'AllRecipes.com' : 'Trim Healthy Table'">
    </div>
    <div class="form-group">
      <label for="sourcePage">Page</label>
      <input v-model="localRecipe.refPage"
          type="text"
          class="form-control"
          id="sourcePage"
          :placeholder="localRecipe.refType === 'Website' ? 'URL' : 'page number'">
    </div>
    <div class="form-group">
      <label for="sourcePage">Ingredients</label>
      <ul>
        <li v-for="(ingredient, index) in selectedIngredients" :key="ingredient.ingredient">
          <div class="d-flex">
            <div class="mb-1 mr-3">
              <input type="text" class="form-control form-control-sm quantity-input" v-model="localIngredients[index].amount">
              <label class="font-size-sm form-text text-muted mb-0">Quantity</label>
            </div>
            <div class="mb-1 mr-3">
              <select class="form-control form-control-sm" v-model="localIngredients[index].measure">
                <option value="Tbsp">Tbsp</option>
                <option value="tsp">tsp</option>
                <option value="cups">cups</option>
                <option value="oz">oz</option>
                <option value="pounds">pounds</option>
                <option value="cans">cans</option>
                <option value="boxes">boxes</option>
                <option value="jars">jars</option>
                <option value="pinches">pinches</option>
              </select>
              <label class="font-size-sm form-text text-muted mb-0">Measure</label>
            </div>
            <strong>{{ ingredient.name }}</strong>
          </div>
        </li>
        <li>
          <typeahead v-model="ingredientSearch"
              placeholder="Search for an ingredient..."
              ref="typeahead"
              :clear-on-select="true"
              :data="ingredientList"
              :serializer="s => s.name"
              @no-match="addNewIngredient"
              @hit="selectIngredient">
            <template slot="listPrepend">
              <button type="button" class="btn btn-outline-secondary btn-sm" @click="addNewIngredient">
                Save ingredient: "{{ ingredientSearch }}"</button>
            </template>
          </typeahead>
        </li>
      </ul>
    </div>
    <button class="btn btn-outline-primary">Save Recipe</button>
  </form>
</template>

<script>
import Typeahead from './typeahead/Typeahead.vue';

export default {
  name: 'RecipeForm',
  props: {
    recipe: {
      type: Object,
      default() {
        return {};
      },
    },
    ingredients: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: { Typeahead },
  data() {
    return {
      localRecipe: {
        id: '',
        name: '',
        refName: '',
        refPage: '',
        refType: '',
      },
      localIngredients: [],
      ingredientSearch: '',
    };
  },
  computed: {
    ingredientList() {
      return this.$store.state.ingredients.filter(({ id }) => !this.selectedIngredients.some(({ ingredient }) => id === ingredient));
    },
    selectedIngredients() {
      return this.localIngredients.map((ingredient) => {
        const { name } = this.$store.state.ingredients.find(({ id }) => ingredient.ingredient === id);
        return { ...ingredient, name };
      });
    },
  },
  methods: {
    saveRecipe() {
      this.$emit('submit', {
        recipe: { ...this.localRecipe },
        ingredients: this.localIngredients.slice(),
      });
    },
    async selectIngredient({ id }) {
      this.localIngredients.push({
        ingredient: id,
        measure: null,
        amount: null,
      });
      this.ingredientSearch = '';
    },
    async addNewIngredient() {
      const ingredient = await this.$store.dispatch('addIngredient', { name: this.ingredientSearch });
      this.selectIngredient(this.$store.state.ingredients.find(({ id }) => id === ingredient.id));
    },
  },
  created() {
    Object.assign(this, this.recipe);
    this.localIngredients = this.ingredients.slice();
  },
};
</script>

<style lang="scss" scoped>
.quantity-input {
  width: 50px;
}
</style>
