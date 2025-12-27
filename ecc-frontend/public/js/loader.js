let BASE_URL = window.location.origin;

BASE_URL === "http://127.0.0.1:5500" ? BASE_URL = "http://127.0.0.1:5500/ecc-frontend/public" : BASE_URL;

document.body.insertAdjacentHTML(
  "beforeend",
  `
  <div id="global-loader">
    <img
      src="${BASE_URL}/assets/aliancas.svg"
      alt="Carregando"
      class="loader-aliancas"
    />
    <!-- <div class="loader-spinner"></div> -->
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