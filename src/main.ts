import App from "./app/App";

async function main() {
    globalThis.APPNamespace = {};
    globalThis.APPNamespace.App = new App(false);
}

main();