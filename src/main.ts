import App from "./app/app";

async function main() {
    globalThis.APPNamespace = {};
    new App(false);
}

main();