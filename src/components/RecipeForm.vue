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
              <input type="number"
                    min="0"
                    step="1"
                    class="form-control form-control-sm quantity-input"
                    v-model.number="localIngredients[index].quantity">
              <label class="font-size-sm form-text text-muted mb-0">Quantity</label>
            </div>
            <div class="mb-1 mr-3">
              <select class="form-control form-control-sm" v-model="localIngredients[index].measure">
                <option v-for="(measure, key) in measures" :value="key" :key="key">
                    {{ measureAbbr(key, localIngredients[index].quantity) }}
                </option>
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
      <div>
        <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
          <div>
            <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
              Bold
            </button>
            <button :class="{ 'is-active': isActive.ordered_list() }" @click="commands.ordered_list">
              List
            </button>
          </div>
        </editor-menu-bar>
        <editor-content class="form-control" :editor="editor" />
      </div>
    <button class="btn btn-outline-primary">Save Recipe</button>
  </form>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  OrderedList,
  ListItem,
  Bold,
  Italic,
  Underline,
} from 'tiptap-extensions';
import Typeahead from './typeahead/Typeahead.vue';
import measuresMixin from '@/mixins/measures';

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
  components: { Typeahead, EditorContent, EditorMenuBar },
  mixins: [measuresMixin],
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
      editor: new Editor({
        extensions: [
          new OrderedList(),
          new ListItem(),
          new Bold(),
          new Italic(),
          new Underline(),
        ],
        content: `
          <ol>
            <li></li>
          </ol>
        `,
      }),
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
        quantity: null,
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
  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss" scoped>
.quantity-input {
  width: 75px;
}
</style>
