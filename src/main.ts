import App from "./app/App";

async function main() {
    globalThis.APPNamespace = {};
    new App(true);
}

main();