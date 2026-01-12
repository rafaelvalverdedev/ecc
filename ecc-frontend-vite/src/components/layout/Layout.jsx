import Header from "./Header";
import Nav from "./Nav";

function Layout({ children }) {
  return (
    <div>
      <Header />
      <Nav />
      <main style={{ padding: 20 }}>
        {children}
      </main>
    </div>
  );
}

export default Layout;
