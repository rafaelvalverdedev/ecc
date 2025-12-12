// Insere o loader no DOM
document.body.insertAdjacentHTML(
    "beforeend",
    `
<div id="global-loader">
  <div class="loader-spinner"></div>
</div>
`
);

const loader = document.getElementById("global-loader");

window.showLoader = function () {
    loader.style.display = "flex";
};

window.hideLoader = function () {
    loader.style.display = "none";
};


// Executa qualquer função async mostrando um loader automaticamente
window.withLoader = async function (fn) {
    try {
        showLoader();
        return await fn();
    } catch (err) {
        console.error("Erro em função com loader:", err);
        throw err;
    } finally {
        hideLoader();
    }
};