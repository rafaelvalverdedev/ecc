import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useLoader } from "../../contexts/LoaderContext";

function LogoutButton() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const { withLoader } = useLoader();

  async function handleLogout() {
    await withLoader(async () => {
      logout();
      showToast("Logout realizado com sucesso", "success");
    });
  }

  return (
    <button onClick={handleLogout}>
      Sair
    </button>
  );
}

export default LogoutButton;
