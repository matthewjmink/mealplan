<template>
  <transition name="loading-overlay">
    <div class="loading-overlay text-center d-flex">
      <div class="loading-content m-auto p-3 text-lg">
        <spinner class="text-x-large" />
        <div class="mt-3 text-muted text-large" v-if="message" data-qa="loadingMessage">{{ message }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'LoadingOverlay',
  props: {
    message: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
  $zindex-loading: 1090 !default;

  .loading-overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transition: all ease-in-out .2s;
    background: rgba(#ffffff, .9);
    z-index: $zindex-loading;

    .loading-content {
      max-width: 500px;
    }

    &.loading-overlay-enter,
    &.loading-overlay-leave-active {
      transform: scale(0.75);
      opacity: 0;
    }
  }
</style>
