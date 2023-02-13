import * as path from "path";

export default {
  base: "/NumerosPrimosJS/",
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
