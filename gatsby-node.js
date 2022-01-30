exports.onCreateWebpackConfig = ({ stage, actions }) => {
  if (stage.startsWith("build-javascript")) {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-spring/,
            sideEffects: true,
          },
        ],
      },
    })
  }
}
