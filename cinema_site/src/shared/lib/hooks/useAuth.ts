import { getUserThunk, selectIsAuthenticated } from "@/features/auth/model/slice";
import { useAppSelector } from "@/store";

const useAuth = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  console.log("isAuthenticated", isAuthenticated);
  return {
    isAuth: isAuthenticated
  }
}

export default useAuth
