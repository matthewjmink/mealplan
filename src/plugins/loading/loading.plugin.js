import LoadingOverlay from './LoadingOverlay.vue';
import Spinner from './Spinner.vue';

const Plugin = {
  install(Vue) {
    const show = function showLoadingMessage(message = '') {
      const id = Symbol(message);
      this.addOverlay(message, id);
      return {
        show: () => this.addOverlay(message, id),
        remove: () => this.removeOverlay(id),
        when: computedFn => this.$watch(computedFn, (shouldShow) => {
          if (shouldShow) {
            // Don't add the overlay if it's already been added
            if (!this.overlays.find(overlay => overlay.id === id)) {
              this.addOverlay(message, id);
            }
          } else {
            this.removeOverlay(id);
          }
        }, { immediate: true }),
      };
    };

    const $loading = new Vue({
      data() {
        return {
          overlays: [],
        };
      },
      methods: {
        show,
        addOverlay(message, id) {
          this.overlays.push(Object.defineProperties({}, {
            message: {
              get: typeof message === 'function' ? message : () => message,
            },
            id: { value: id },
          }));
        },
        removeOverlay(id) {
          const overlayIndex = this.overlays.findIndex(overlay => overlay.id === id);
          if (overlayIndex > -1) {
            this.overlays.splice(overlayIndex, 1);
          }
        },
      },
    });

    $loading.show.removeAll = function removeAllLoadingOverlays() {
      $loading.overlays.splice(0);
    };

    // Register the global components
    // Loading Overlay - displays a single overlay with optional message prop
    const loadingOverlay = Vue.component(LoadingOverlay.name, LoadingOverlay);
    // Spinner - an inline loading spinner
    Vue.component(Spinner.name, Spinner);
    // Loading - responsible for displaying the list of overlays registered through the $loading() method (place at the root of the project)
    Vue.component('Loading', {
      render(createElement) {
        if (!$loading.overlays[0]) {
          return '';
        }
        return createElement(loadingOverlay, {
          props: {
            message: $loading.overlays[0].message,
          },
        });
      },
    });

    // eslint-disable-next-line
        Vue.prototype.$loading = $loading.show;
  },
};

export default Plugin;
