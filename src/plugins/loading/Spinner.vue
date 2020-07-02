<template>
  <div class="spinner">
    <div class="dot1"></div>
    <div class="dot2"></div>
  </div>
</template>

<script>
export default {
  name: 'Spinner',
};
</script>

<style lang="scss" scoped>
@import '~@/scss/config';
@import '~@/scss/mixins';

.spinner {
  font-size: 1rem;
  margin: auto;
  width: 2em;
  height: 2em;
  position: relative;
  text-align: center;

  animation: sk-rotate 2.0s infinite linear;
}

.dot1, .dot2 {
  width: 60%;
  height: 60%;
  display: inline-block;
  position: absolute;
  top: 0;
  background-color: $primary;
  border-radius: 100%;

  animation: sk-bounce 2.0s infinite ease-in-out;
}

.dot2 {
  top: auto;
  bottom: 0;
  background-color: $secondary;
  animation-delay: -1.0s;
}

@keyframes sk-rotate { 100% { transform: rotate(360deg); -webkit-transform: rotate(360deg) }}

@keyframes sk-bounce {
  0%, 100% {
    transform: scale(0.0);
  } 50% {
    transform: scale(1.0);
  }
}
</style>
