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
        const scene = document.getElementById("scene");
        if (scene)
            scene.style.display = "none";
    }
    hideLoading() {
        if (!this.loadingModal) return;
        this.loadingModal.classList.add("hidden");
        this.loadingModal.style.display = "None";
        const scene = document.getElementById("scene");
        if (scene)
            scene.style.display = "block";
    }
}