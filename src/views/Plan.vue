<template>
  <div>
    <div class="mb-5">
      <h2 class="mb-2">Week of {{ weekStartString }}</h2>
      <div class="btn-group">
        <button class="btn btn-outline-secondary" @click="previousWeek"><chevron-left-icon class="icon" /></button>
        <button class="btn btn-outline-secondary font-weight-bold" :disabled="isToday" @click="today">Today</button>
        <button class="btn btn-outline-secondary" @click="nextWeek"><chevron-right-icon class="icon" /></button>
      </div>
    </div>
    <div class="mb-4" v-for="(day, index) in days" :key="`dayIndex${index}`">
      <h3 class="section-label">{{ day }}</h3>
      <div class="pl-4 py-3">
        <div class="row">
          <div v-for="recipe in recipesByDay[index]"
              :key="recipe.recipe"
              class="col-md-6 col-lg-4">
            <div class="card mb-4 border-primary text-center">
              <router-link class="card-header" :to="`/recipe/${recipe.recipe}`">{{ recipe.name }}</router-link>
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <button class="btn btn-outline-danger" @click="removePlanRecipe(recipe.id)">
                    <trash-icon class="font-size-lg icon"/>
                  </button>
                  <router-link class="btn btn-primary ml-auto" :to="`/recipe/${recipe.recipe}`">view recipe</router-link>
                  <!-- TODO: servings multiplier -->
                </div>
              </div>
            </div>
          </div>
          <div class="col-4">
            <div :class="['card add-recipe-card', { adding: addRecipeIndex === index }]">
              <a v-if="addRecipeIndex !== index"
                  href="javascript:void(0)"
                  @click.prevent="toggleRecipeSearch(index)"
                  class="py-3 d-block text-center font-size-lg font-weight-semi-bold">
                Add a Recipe<br>
                <plus-circle-icon class="plus-icon" />
              </a>
              <div v-if="addRecipeIndex === index" class="card-body">
                <typeahead placeholder="Search for a recipe..."
                    v-model="recipeSearchQuery"
                    :ref="`typeahead${index}`"
                    :clear-on-select="true"
                    :data="recipes"
                    :serializer="s => s.name"
                    @hit="addPlanRecipe($event, index)">
                </typeahead>
                <button type="button" class="btn btn-link" @click="addRecipeIndex = null">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import TrashIcon from 'feather-icons/dist/icons/trash-2.svg';
import PlusCircleIcon from 'feather-icons/dist/icons/plus-circle.svg';
import ChevronLeftIcon from 'feather-icons/dist/icons/chevron-left.svg';
import ChevronRightIcon from 'feather-icons/dist/icons/chevron-right.svg';
import { db } from '@/db';
import Typeahead from '@/components/typeahead/Typeahead.vue';

const planRecipesRef = db.collection('plan-recipes');

function getSunday(dateValue = new Date()) {
  const d = new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());
  return new Date(d.setDate(d.getDate() - d.getDay()));
}
function leadingZero(n) {
  if (n > 9 || n < 1) return `${n}`;
  return `0${n}`;
}
function dateToYMD(d) {
  return Number(`${d.getFullYear()}${leadingZero(d.getMonth() + 1)}${leadingZero(d.getDate())}`);
}

export default {
  name: 'Plan',
  components: {
    Typeahead,
    TrashIcon,
    PlusCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
  },
  data() {
    return {
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      // TODO: move this to the store
      weekStart: getSunday(),
      planRecipes: [],
      addRecipeIndex: null,
      recipeSearchQuery: '',
    };
  },
  computed: {
    isToday() {
      return this.weekStart.getTime() === getSunday().getTime();
    },
    recipes() {
      return this.$store.state.recipes;
    },
    weekStartString() {
      return this.weekStart.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    },
    recipesByDay() {
      return this.planRecipes.reduce((recipesByDay, planRecipe) => {
        const { name } = this.recipes.find(({ id }) => id === planRecipe.recipe) || {};
        recipesByDay[planRecipe.day].push({ ...planRecipe, name });
        return recipesByDay;
      }, this.days.map(() => []));
    },
  },
  methods: {
    setWeekStart(date) {
      this.weekStart = date;
      this.bindPlanRecipes();
    },
    jumpWeeks(weeks = 1) {
      const d = new Date(this.weekStart);
      d.setDate(d.getDate() + (7 * weeks));
      this.setWeekStart(d);
    },
    today() {
      this.setWeekStart(getSunday());
    },
    nextWeek() {
      this.jumpWeeks(1);
    },
    previousWeek() {
      this.jumpWeeks(-1);
    },
    addPlanRecipe({ id }, index) {
      this.recipeSearchQuery = '';
      this.addRecipeIndex = null;
      this.$store.dispatch('addPlanRecipe', {
        day: index,
        qtyMultiplier: 1,
        recipe: db.collection('recipes').doc(id),
        weekStart: dateToYMD(this.weekStart),
      });
    },
    async toggleRecipeSearch(index) {
      this.addRecipeIndex = index;
      await this.$nextTick();
      this.$refs[`typeahead${index}`][0].focus();
    },
    removePlanRecipe(id) {
      planRecipesRef.doc(id).delete();
    },
    bindPlanRecipes() {
      // TODO: move this to the store
      planRecipesRef
        .where('weekStart', '==', dateToYMD(this.weekStart))
        .orderBy('day')
        .onSnapshot((querySnapshot) => {
          this.planRecipes = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            recipe: doc.data().recipe.id,
          }));
        });
    },
  },
  created() {
    this.$store.dispatch('bindRecipes');
    this.bindPlanRecipes();
  },
};
</script>

<style lang="scss" scoped>
@import '~@/scss/config';
@import '~bootstrap/scss/variables';

.add-recipe-card:not(.adding) {
  opacity: .8;
}
.card-header {
  font-size: 1.5rem;
}
.plus-icon {
  display: inline-block;
  font-size: 2.5rem;
  width: 1em;
  height: 1em;
  text-decoration: none;
  cursor: pointer;
}
</style>
