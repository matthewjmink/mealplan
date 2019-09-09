<template>
  <div id="app" class="container">
    <div id="nav" class="nav nav-pills">
      <li class="nav-item">
        <router-link :class="['nav-link', { active: $route.name === 'plan'}]"
            to="/">Plan</router-link>
      </li>
      <li class="nav-item">
        <router-link :class="['nav-link', { active: ['recipes', 'recipe'].includes($route.name)}]"
            to="/recipes">Recipes</router-link>
      </li>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.$store.dispatch('bindIngredients');
  },
};
</script>

<style lang="scss">
@import '~@/scss/config';
@import '~bootstrap/scss/bootstrap';
@import '~@/scss/base';
</style>
