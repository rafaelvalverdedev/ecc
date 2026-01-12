import { useLoader } from "../contexts/LoaderContext";
import { useToast } from "../contexts/ToastContext";
import Loader from "../components/common/Loader";
import Toast from "../components/common/Toast";
import AppRouter from "./Router";

function App() {
  const { isLoading } = useLoader();
  const { toast } = useToast();

  return (
    <>
      {isLoading && <Loader />}
      {toast && <Toast message={toast.message} type={toast.type} />}
      <AppRouter />
    </>
  );
}

export default App;
