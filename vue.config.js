module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    // Clear out the default loader for SVGs (file-loader) and replace it with vue-svg-loader
    svgRule.uses.clear();

    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .options({
        svgo: {
          plugins: [
            { removeDimensions: true },
          ],
        },
      });

    config.module.rule('vue')
      .use('vue-loader')
      .tap((options) => {
        // eslint-disable-next-line no-param-reassign
        options.compilerOptions.modules = [{
          preTransformNode(astEl) {
            if (process.env.NODE_ENV === 'production') {
              const { attrsMap, attrsList } = astEl;
              // For prod, remove [data-test-id] attribute used for testing purposes
              if (attrsMap['data-test-id']) {
                delete attrsMap['data-test-id'];
                const index = attrsList.findIndex(x => x.name === 'data-test-id');
                attrsList.splice(index, 1);
              }
            }
            return astEl;
          },
        }];
        return options;
      });
  },
};
