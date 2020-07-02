<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <router-link class="navbar-brand h1" to="/">
        <img src="./assets/logo.png" class="rounded-circle"> <span>MealPlanner</span>
      </router-link>
      <button class="navbar-toggler" type="button">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ml-4 mr-auto font-size-lg">
          <li :class="['nav-item', { active: $route.name === 'plan'}]">
            <router-link class="nav-link" to="/">Plan</router-link>
          </li>
          <li :class="['nav-item', { active: ['recipes', 'recipe'].includes($route.name)}]">
            <router-link class="nav-link" to="/recipes">Recipes</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container py-5">
      <router-view/>
    </div>
    <loading />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      navOpen: false,
    };
  },
  created() {
    this.$store.dispatch('bindIngredients');
  },
};
</script>

<style lang="scss">
@import '~@/scss/config';
@import '~bootstrap/scss/bootstrap';
@import '~@/scss/base';

.navbar-brand {
  font-size: 2rem;
  line-height: 1;
  margin-bottom: 0;

  span {
    position: relative;
    top: 2px;
    margin-left: 10px;
    opacity: .85;
  }
  img {
    width: 60px;
    display: inline-block;
    vertical-align: middle;
  }
}
.navbar-nav .nav-item.active {
  font-weight: 600;
}
</style>
