<template>
  <div id="app" class="container">
    <div id="nav" class="nav nav-pills">
      <li class="nav-item">
        <router-link :class="['nav-link', { active: $route.name === 'plan'}]"
            to="/">Plan</router-link>
      </li>
      <li class="nav-item">
        <router-link :class="['nav-link', { active: $route.name === 'recipes'}]"
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
@import '~bootstrap/dist/css/bootstrap.css';
.font-size-sm {
  font-size: .8rem;
}
.font-size-lg {
  font-size: 1.2rem;
}
</style>
