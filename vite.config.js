import path from "path";

export default {
  root: "src",
  build: {
    outDir: "../dist",
  },
  resolve: {
    alias: {
      "~materialize": path.resolve(
        __dirname,
        "node_modules/@materializecss/materialize"
      ),
    },
  },
  server: {
    port: 8080,
    hot: true,
  },
};
