
export const measures = {
  tablespoon: {
    name: 'tablespoons',
    singular: 'tablespoon',
    abbr: 'Tbsp',
    abbrSingular: 'Tbsp',
  },
  teaspoon: {
    name: 'teaspoons',
    singular: 'teaspoon',
    abbr: 'tsp',
    abbrSingular: 'tsp',
  },
  cup: {
    name: 'cups',
    singular: 'cup',
    abbr: 'cups',
    abbrSingular: 'cup',
  },
  ounce: {
    name: 'ounces',
    singular: 'ounce',
    abbr: 'oz',
    abbrSingular: 'oz',
  },
  pound: {
    name: 'pounds',
    singular: 'pound',
    abbr: 'lbs',
    abbrSingular: 'lb',
  },
  can: {
    name: 'cans',
    singular: 'can',
    abbr: 'cans',
    abbrSingular: 'can',
  },
  box: {
    name: 'boxes',
    singular: 'box',
    abbr: 'boxes',
    abbrSingular: 'box',
  },
  jar: {
    name: 'jars',
    singular: 'jars',
    abbr: 'jars',
    abbrSingular: 'jar',
  },
  pinch: {
    name: 'pinches',
    singular: 'pinch',
    abbr: 'pinches',
    abbrSingular: 'pinch',
  },
};

export default {
  data() {
    return {
      measures,
    };
  },
  computed: {
    measureName() {
      return (key, quantity) => {
        if (!key || !measures[key]) return '';
        if (quantity <= 1 && quantity > 0) return measures[key].singular;
        return measures[key].name;
      };
    },
    measureAbbr() {
      return (key, quantity) => {
        if (!key || !measures[key]) return '';
        if (quantity <= 1 && quantity > 0) return measures[key].abbrSingular;
        return measures[key].abbr;
      };
    },
  },
};
