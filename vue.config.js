module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/TableProject/' : '/',
  css: {
    // loaderOptions: {
    //   postcss: {
    //     plugins: [
    //       require("postcss-px-to-viewport")({
    //         viewportWidth: 375, // (Number) The width of the viewport.
    //         viewportHeight: 667, // (Number) The height of the viewport.
    //         unitPrecision: 3,
    //         viewportUnit: "vw",
    //         selectorBlackList: ['.ignore', '.hairlines'],
    //         minPixelValue: 1,
    //         mediaQuery: false
    //       })
    //     ]
    //   }
    // }
  }
};
