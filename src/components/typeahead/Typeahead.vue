<template>
  <div>
    <div :class="sizeClasses">
      <div ref="prependDiv" v-if="$slots.prepend || prepend" class="input-group-prepend">
        <slot name="prepend">
          <span class="input-group-text">{{ prepend }}</span>
        </slot>
      </div>
      <input ref="input"
          type="search"
          :class="`form-control ${inputClass}`"
          :placeholder="placeholder"
          :aria-label="placeholder"
          :value="inputValue"
          @keydown.up="selectPrevious"
          @keydown.down="selectNext"
          @keydown.enter.prevent="handleHit(matchedItems[activeIndex])"
          @focus="isFocused = true"
          @blur="handleBlur"
          @input="handleInput($event.target.value)"
          autocomplete="off">
      <div v-if="$slots.append || append" class="input-group-append">
        <slot name="append">
          <span class="input-group-text">{{ append }}</span>
        </slot>
      </div>
    </div>

    <div ref="list"
        class="typeahead-list list-group shadow"
        v-show="isFocused && inputValue.length > 0 ">
      <div v-if="$slots.listPrepend" class="p-2 border-bottom">
        <slot name="listPrepend"></slot>
      </div>
      <typeahead-list-item v-for="(item, id) in matchedItems"

          :active="id === activeIndex"
          :key="id"
          :data="item.data"
          :html-text="highlight(item.text)"
          :background-variant="backgroundVariant"
          :text-variant="textVariant"
          @mouseover.native="activeIndex = id"
          @click.native.prevent="handleHit(item, $event)">
        <template v-if="$scopedSlots.suggestion" slot="suggestion" slot-scope="{ data, htmlText }">
          <slot name="suggestion" v-bind="{ data, htmlText }" />
        </template>
      </typeahead-list-item>
    </div>
  </div>

</template>

<script>
import ResizeObserver from 'resize-observer-polyfill';
import TypeaheadListItem from './TypeaheadListItem.vue';

function sanitize(text) {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default {
  name: 'Typehead',

  components: {
    TypeaheadListItem,
  },

  props: {
    size: {
      type: String,
      default: null,
      validator: size => ['lg', 'sm'].indexOf(size) > -1,
    },
    value: {
      type: String,
    },
    data: {
      type: Array,
      required: true,
      validator: d => d instanceof Array,
    },
    serializer: {
      type: Function,
      default: d => d,
      validator: d => d instanceof Function,
    },
    backgroundVariant: String,
    clearOnSelect: Boolean,
    textVariant: String,
    inputClass: {
      type: String,
      default: '',
    },
    maxMatches: {
      type: Number,
      default: 10,
    },
    minMatchingChars: {
      type: Number,
      default: 2,
    },
    placeholder: String,
    prepend: String,
    append: String,
  },

  data() {
    return {
      isFocused: false,
      inputValue: '',
      activeIndex: -1,
    };
  },

  computed: {
    sizeClasses() {
      return this.size ? `input-group input-group-${this.size}` : 'input-group';
    },

    formattedData() {
      if (!(this.data instanceof Array)) {
        return [];
      }
      return this.data.map((d, i) => ({
        id: i,
        data: d,
        text: this.serializer(d),
      }));
    },

    highlight() {
      return (text) => {
        const cleanText = sanitize(text);
        if (this.inputValue.length === 0) {
          return cleanText;
        }
        const re = new RegExp(this.escapedQuery, 'gi');

        return cleanText.replace(re, '<strong>$&</strong>');
      };
    },

    escapedQuery() {
      return escapeRegExp(sanitize(this.inputValue));
    },

    matchedItems() {
      if (this.inputValue.length === 0 || this.inputValue.length < this.minMatchingChars) {
        return [];
      }

      const re = new RegExp(this.escapedQuery, 'gi');

      // Filter, sort, and concat
      return this.formattedData
        .filter(i => i.text.match(re) !== null)
        .sort((a, b) => {
          const aIndex = a.text.indexOf(a.text.match(re)[0]);
          const bIndex = b.text.indexOf(b.text.match(re)[0]);

          if (aIndex < bIndex) { return -1; }
          if (aIndex > bIndex) { return 1; }
          return 0;
        }).slice(0, this.maxMatches);
    },
  },

  watch: {
    value(newValue) {
      this.inputValue = newValue;
    },
  },

  methods: {
    focus() {
      this.$refs.input.focus();
    },
    resizeList(el) {
      const rect = el.getBoundingClientRect();
      const listStyle = this.$refs.list.style;

      // Set the width of the list on resize
      listStyle.width = `${rect.width}px`;

      // Set the margin when the prepend prop or slot is populated
      // (setting the "left" CSS property doesn't work)
      if (this.$refs.prependDiv) {
        const prependRect = this.$refs.prependDiv.getBoundingClientRect();
        listStyle.marginLeft = `${prependRect.width}px`;
      }
    },

    handleHit(evt = {}) {
      const { text = this.inputValue, data } = evt;
      if (typeof this.value !== 'undefined') {
        this.$emit('input', text);
      }
      if (!data) {
        this.$emit('no-match', text);
      } else {
        this.$emit('hit', data);
      }

      if (!this.clearOnSelect) {
        this.inputValue = text;
        this.$refs.input.blur();
        this.isFocused = false;
      }
    },

    handleBlur(evt) {
      const tgt = evt.relatedTarget;
      if (tgt && tgt.classList.contains('vbst-item')) {
        return;
      }
      this.isFocused = false;
    },

    handleInput(newValue) {
      this.inputValue = newValue;

      // If v-model is being used, emit an input event
      if (typeof this.value !== 'undefined') {
        this.$emit('input', newValue);
      }
    },

    selectNext() {
      if (this.matchedItems.length < 1) {
        this.activeIndex = -1;
        return;
      }
      if (this.activeIndex >= this.matchedItems.length - 1) {
        this.activeIndex = 0;
        return;
      }
      this.activeIndex += 1;
    },

    selectPrevious() {
      if (this.matchedItems.length < 1) {
        this.activeIndex = -1;
        return;
      }
      if (this.activeIndex < 1) {
        this.activeIndex = this.matchedItems.length - 1;
        return;
      }
      this.activeIndex -= 1;
    },
  },

  mounted() {
    this.$_ro = new ResizeObserver(() => {
      this.resizeList(this.$refs.input);
    });
    this.$_ro.observe(this.$refs.input);
    this.$_ro.observe(this.$refs.list);
  },

  beforeDestroy() {
    this.$_ro.disconnect();
  },
};
</script>

<style scoped>
  .typeahead-list {
    background: white;
    padding-top: 5px;
    position: absolute;
    max-height: 350px;
    overflow-y: auto;
    z-index: 999;
  }
</style>
