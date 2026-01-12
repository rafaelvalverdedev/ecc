import "./Loader.css";

function Loader() {
  return (
    <div id="global-loader">
      <div className="spinner-wrapper">
        <div className="spinner-circle"></div>

        <img
          src="../../favicon.svg"
          alt="Carregando"
          className="loader-aliancas"
        />
      </div>
    </div>
  );
}

export default Loader;
