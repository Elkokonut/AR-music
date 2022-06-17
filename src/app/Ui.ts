export class UI {
    loadingModal: HTMLElement;
    loadingModelModal: HTMLElement;
    errorModal: HTMLElement;
    constructor() {
        this.loadingModal = document.getElementById("loading");
        this.loadingModelModal = document.getElementById("loading_cube");
        this.errorModal = document.getElementById("errorPage");

        this.hideLoading();
        this.hideModelLoading();
        this.hideErrorPage();
    }

    showLoading() {
        if (!this.loadingModal) return;
        this.loadingModal.classList.remove("hidden");
        this.loadingModal.style.display = "flex";
        this.hideModelLoading();
        this.hideErrorPage();
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
        this.hideLoading();
        this.hideErrorPage();
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

    showErrorPage() {
        if (!this.errorModal) return;
        this.errorModal.classList.remove("hidden");
        this.errorModal.style.display = "flex";
        this.hideLoading();
        this.hideModelLoading();
        const scene = document.getElementById("scene");
        if (scene)
            scene.style.display = "none";
    }

    hideErrorPage() {
        if (!this.errorModal) return;
        this.errorModal.classList.add("hidden");
        this.errorModal.style.display = "None";
        const scene = document.getElementById("scene");
        if (scene)
            scene.style.display = "block";
    }
}