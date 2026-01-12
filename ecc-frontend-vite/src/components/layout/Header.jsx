import LogoutButton from "../common/LogoutButton";

function Header() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        background: "#5a0000",
        color: "#fff"
      }}
    >
      <strong>ECC • Administração</strong>
      <LogoutButton />
    </header>
  );
}

export default Header;
