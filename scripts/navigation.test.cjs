// Run with node --test scripts/navigation.test.cjs. Native views are stubbed;
// these checks cover route wiring and hydration guards, not UIKit rendering.
const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { runInNewContext } = require("node:vm");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const ts = require("typescript");

const app = path.resolve(__dirname, "../src/app");
const h = React.createElement;
const VaultContext = React.createContext(null);
let state;
let routes;
let tabs;
const View = ({ children }) => h("div", null, children);
const NativeTabs = Object.assign(({ children }) => {
  tabs = React.Children.toArray(children).map((child) => child.props.name);
  for (const name of tabs) {
    assert.ok(existsSync(path.join(app, "(tabs)", `${name}.tsx`)), name);
  }
  return children;
}, { Trigger: Object.assign(View, { Icon: () => null, Label: View }) });

const mocks = {
  "expo-router/unstable-native-tabs": { NativeTabs },
  "expo-status-bar": { StatusBar: () => null },
  "react-native": {
    View,
    Text: View,
    ActivityIndicator: ({ accessibilityLabel }) => h("span", null, accessibilityLabel),
    StyleSheet: { create: (styles) => styles },
  },
  "react-native-gesture-handler": { GestureHandlerRootView: View },
  "@/providers/vault-provider": {
    VaultProvider: ({ children }) => h(VaultContext.Provider, { value: state }, children),
    useVault: () => {
      const value = React.useContext(VaultContext);
      assert.ok(value, "Navigation must be mounted inside VaultProvider");
      return value;
    },
  },
  "expo-router": {
    DarkTheme: { dark: true, colors: {} },
    ThemeProvider: ({ value, children }) => {
      assert.equal(value.dark, true);
      return children;
    },
    Stack: Object.assign(({ children }) => {
      routes = React.Children.toArray(children).map((child) => child.props);
      for (const { name } of routes) {
        assert.ok(existsSync(path.join(app, name === "(tabs)" ? "(tabs)/_layout.tsx" : `${name}.tsx`)), name);
      }
      return h(TabsLayout);
    }, { Screen: () => null }),
  },
};

function load(file) {
  const module = { exports: {} };
  const { outputText } = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  runInNewContext(outputText, {
    module,
    exports: module.exports,
    require: (name) => mocks[name] ?? (name === "@/style/colors"
      ? load(path.join(app, "../style/colors.ts")) : require(name)),
  }, { filename: file });
  return module.exports;
}

const TabsLayout = load(path.join(app, "(tabs)/_layout.tsx")).default;
const RootLayout = load(path.join(app, "_layout.tsx")).default;
function render(vault) {
  state = vault;
  routes = [];
  tabs = [];
  return renderToStaticMarkup(h(RootLayout));
}

test("loading and failed reads show feedback without mounting editable screens", () => {
  assert.match(render({ loading: true }), /Carregando/);
  assert.equal(routes.length, 0);
  assert.match(render({ loading: false, loadFailed: true, error: "Dados indisponíveis" }), /Dados indisponíveis/);
  assert.equal(routes.length, 0);
});

test("hydrated navigation mounts three native tabs and retains modal and edit routes", () => {
  const html = render({ loading: false, loadFailed: false, error: null });
  assert.deepEqual(tabs, ["index", "collections", "favorites"]);
  for (const label of ["Início", "Coleções", "Favoritos"]) assert.ok(html.includes(label));
  assert.equal(routes.length, 5);
  assert.equal(routes.find(({ name }) => name === "(tabs)").options.headerShown, false);
  for (const name of ["item/new", "collection/new"]) {
    assert.equal(routes.find((route) => route.name === name).options.presentation, "modal");
  }
  for (const name of ["item/[id]", "collection/[id]"]) assert.ok(routes.some((route) => route.name === name));
});

test("save failures keep navigation available for the existing retry UI", () => {
  render({ loading: false, loadFailed: false, error: "Falha ao salvar" });
  assert.equal(tabs.length, 3);
});
