export class UI {
    loadingModal: HTMLElement;
    loadingModelModal: HTMLElement;
    constructor() {
        this.loadingModal = document.getElementById("loading");
        this.loadingModelModal = document.getElementById("loading_cube");
        this.hideLoading();
        this.hideModelLoading();
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


    showModelLoading() {
        if (!this.loadingModelModal) return;
        this.loadingModelModal.classList.remove("hidden");
        this.loadingModelModal.style.display = "flex";
        const scene = document.getElementById("scene");
        if (scene)
            scene.style.display = "none";
    }
    hideModelLoading() {
        if (!this.loadingModelModal) return;
        this.loadingModelModal.classList.add("hidden");
        this.loadingModelModal.style.display = "None";
        const scene = document.getElementById("scene");
        if (scene)
            scene.style.display = "block";
    }
}