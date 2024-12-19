import { AuthProvider } from "./AuthContext";
import { FetchProvider } from "./FetchContext";

const ContextProviders = ({ children }) => {
  return (
    <AuthProvider>
      <FetchProvider>{children}</FetchProvider>
    </AuthProvider>
  );
};

export default ContextProviders;
