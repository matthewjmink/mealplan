<template>
  <transition name="modal" @before-enter="handleModalOpen" @after-leave="handleModalClosed">
    <div class="modal fade show"
        tabindex="-1" role="dialog"
        :aria-hidden="!isModalOpen || null"
        :aria-modal="isModalOpen || null"
        ref="modal"
        @click="handleModalClick">
      <div :class="['modal-dialog', sizeClass]" role="document">
        <div class="modal-content">
          <div :class="['modal-header', headerClass]">
            <slot name="header">
              <h5 class="modal-title"><slot name="title"></slot></h5>
              <button type="button" class="close" aria-label="Close" @click="$emit('close')">
                <span aria-hidden="true"><times-icon class="icon" /></span>
              </button>
            </slot>
          </div>
          <div :class="['modal-body', bodyClass]">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <!-- modal footer -->
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="$emit('close')">
                {{ closeMsg }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import TimesIcon from 'feather-icons/dist/icons/x.svg';

/**
 * Get the width of the scrollbar (if one is needed) for the page
 * @function
 * @memberof utils/dom
 */
export function getScrollbarWidth() {
  if (document.body.scrollHeight <= window.innerHeight) return 0;

  const outer = document.createElement('div');
  const inner = document.createElement('div');

  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);
  outer.appendChild(inner);
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
}

/**
 * A Bootstrap style modal window with FCO flair.
 */
export default {
  name: 'Modal',
  data() {
    return {
      isModalOpen: false,
    };
  },
  props: {
    // The text that will display in the green header bar. Hidden if a header slot is used.
    titleText: {
      type: String,
      required: false,
    },
    // Text used for the close button
    closeMsg: {
      type: String,
      required: false,
      default: 'Close',
    },
    // Must be one of `'sm'`, `'lg'`, or `'xl'`
    size: {
      type: String,
      required: false,
      validator(value) {
        return ['sm', 'lg', 'xl'].indexOf(value) !== -1;
      },
    },
    headerClass: {
      type: String,
      default: '',
    },
    bodyClass: {
      type: String,
      default: '',
    },
  },
  computed: {
    sizeClass() {
      if (!this.size) {
        return '';
      }
      return `modal-${this.size}`;
    },
  },
  components: { TimesIcon },
  methods: {
    handleModalOpen() {
      const scrollBarPadding = getScrollbarWidth();
      this.$nextTick().then(() => {
        this.isModalOpen = true;
        document.body.appendChild(this.$el);
        this.$refs.modal.scrollTop = 0;
      });
      if (scrollBarPadding) {
        document.body.style.paddingRight = `${scrollBarPadding}px`;
      }
      document.body.classList.add('modal-open');
    },
    handleModalClosed() {
      this.isModalOpen = false;
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('padding-right');
      this.$el.remove();
    },
    handleModalClick($event) {
      if ($event.target === this.$refs.modal) {
        // Tells the parent that the modal should be hidden/removed
        this.$emit('close');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/scss/config';
@import '~@/scss/mixins';

.modal {
    display: block;
    background: rgba($black, .5);
    transition: all ease-in-out .25s;

    &.modal-enter,
    &.modal-leave-active {
        transform: scale(1.1);
        opacity: 0;
    }

    .modal-dialog {
        z-index: 9999;
        box-shadow: 0 2px 10px rgba($black, .1);

        &.modal-xl {
            max-width: 1200px;
        }
    }

    .title-bar-close {
        line-height: 1;
        padding: 0;
        border: 0 none;
        background: transparent;
        cursor: pointer;
    }
}
</style>
