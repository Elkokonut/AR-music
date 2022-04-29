declare function require(name: string);
require("../loading.scss");

export class UI {
    loadingModal: HTMLElement;
    constructor() {
        this.loadingModal = document.getElementById("loading");
        this.hideLoading();
    }

    showLoading() {
        if (!this.loadingModal) return;
        this.loadingModal.classList.remove("hidden");
        this.loadingModal.style.display = "flex";
    }
    hideLoading() {
        if (!this.loadingModal) return;
        this.loadingModal.classList.add("hidden");
        this.loadingModal.style.display = "None";
    }
}