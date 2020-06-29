<template>
  <form @submit.prevent="saveRecipe">
    <div class="row">
      <div class="col-md-6 mb-3">
        <div class="form-group">
          <label for="recipeName">Recipe Name</label>
          <input v-model="localRecipe.name"
              type="text"
              class="form-control"
              id="recipeName">
        </div>
        <div class="form-group">
          <label>Ingredients</label>
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
                  <select class="custom-select custom-select-sm" v-model="localIngredients[index].measure">
                    <option v-for="(measure, key) in measures" :value="key" :key="key">
                        {{ measureAbbr(key, localIngredients[index].quantity) }}
                    </option>
                  </select>
                  <label class="font-size-sm form-text text-muted mb-0">Measure</label>
                </div>
                <strong>{{ ingredient.name }}</strong>
              </div>
            </li>
            <li class="new-ingredient">
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
        <div class="form-group">
          <label>Directions</label>
          <editor-content class="rich-text" :editor="editor" />
        </div>
      </div>
      <!-- Reference Info -->
      <div class="col-md-6 mb-3">
        <fieldset>
          <legend>Reference Info <span class="small text-sm font-italic text-white-50">optional</span></legend>
          <div class="form-group">
            <label for="sourceType">Source Type</label>
            <div class="custom-control custom-radio">
              <input class="custom-control-input"
                  type="radio"
                  name="sourceType"
                  id="sourceTypeBook"
                  v-model="localRecipe.refType"
                  value="Book" />
              <label class="custom-control-label" for="sourceTypeBook">Book</label>
            </div>
            <div class="custom-control custom-radio">
              <input class="custom-control-input"
                  type="radio"
                  name="sourceType"
                  id="sourceTypeWebsite"
                  v-model="localRecipe.refType"
                  value="Website" />
              <label class="custom-control-label" for="sourceTypeWebsite">Website</label>
            </div>
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
        </fieldset>
      </div>
    </div>
    <button type="submit" :class="['btn btn-primary', btnClass]">Save Recipe</button>
  </form>
</template>

<script>
import { Editor, EditorContent } from 'tiptap';
import { OrderedList, ListItem } from 'tiptap-extensions';
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
    btnClass: {
      type: [String, Object],
      required: false,
    },
  },
  components: { Typeahead, EditorContent },
  mixins: [measuresMixin],
  data() {
    return {
      localRecipe: {
        id: '',
        name: '',
        refName: '',
        refPage: '',
        refType: '',
        directions: '',
      },
      localIngredients: [],
      ingredientSearch: '',
      editor: new Editor({
        extensions: [
          new OrderedList(),
          new ListItem(),
        ],
        content: this.recipe.directions || '<p></p>',
        onUpdate: ({ getHTML }) => {
          this.$set(this.localRecipe, 'directions', getHTML());
        },
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
        ingredients: this.localIngredients.map(ingredient => Object.assign({}, ingredient)),
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
      this.ingredientSearch = '';
      this.selectIngredient(this.$store.state.ingredients.find(({ id }) => id === ingredient.id));
    },
  },
  watch: {
    ingredients: {
      immediate: true,
      handler(ingredients) {
        if (!ingredients) {
          this.localIngredients = [];
          return;
        }
        this.localIngredients = ingredients.map(ingredient => Object.assign({}, ingredient));
      },
    },
    recipe: {
      immediate: true,
      handler(recipe) {
        Object.assign(this.localRecipe, recipe);
        this.editor.setContent(this.localRecipe.directions);
      },
    },
  },
  destroyed() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss" scoped>
@import '~@/scss/config';
@import '~@/scss/mixins';

.new-ingredient:not(:first-child) {
  margin-top: map-get($spacers, 3);
}
.quantity-input {
  width: 75px;
}
.editor-menu {
  background: #eee;
  padding: 8px;

  button {
    margin-right: 5px;
  }
}
::v-deep .ProseMirror {
  display: block;
  width: 100%;
  height: auto;
  overflow-y: auto;
  resize: vertical;
  min-height: 128px;
  padding: $textarea-padding-y $input-padding-x;
  font-family: $input-font-family;
  @include font-size($input-font-size);
  font-weight: $input-font-weight;
  line-height: $input-line-height;
  color: $input-color;
  background-color: $input-bg;
  background-clip: padding-box;
  border: $input-border-width solid $input-border-color;

  // Note: This has no effect on <select>s in some browsers, due to the limited stylability of `<select>`s in CSS.
  @include border-radius($input-border-radius, 0);

  @include box-shadow($input-box-shadow);
  @include transition($input-transition);

  // Unstyle the caret on `<select>`s in IE10+.
  &::-ms-expand {
    background-color: transparent;
    border: 0;
  }

  // Customize the `:focus` state to imitate native WebKit styles.
  @include form-control-focus();

  // Placeholder
  &::placeholder {
    color: $input-placeholder-color;
    // Override Firefox's unusual default opacity; see https://github.com/twbs/bootstrap/pull/11526.
    opacity: 1;
  }

  // Disabled and read-only inputs
  //
  // HTML5 says that controls under a fieldset > legend:first-child won't be
  // disabled if the fieldset is disabled. Due to implementation difficulty, we
  // don't honor that edge case; we style them as disabled anyway.
  &:disabled,
  &[readonly] {
    background-color: $input-disabled-bg;
    // iOS fix for unreadable disabled content; see https://github.com/twbs/bootstrap/issues/11655.
    opacity: 1;
  }

  @include p-list;
}
</style>
