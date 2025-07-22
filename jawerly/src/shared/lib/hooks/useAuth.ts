import { getUserProfileThunk } from "@/entities/user/model/slice";
import { getUserThunk, selectIsAuthenticated } from "@/features/auth/model/slice";
import { useAppDispatch, useAppSelector } from "@/store";

const useAuth = () => {
  const dispatch = useAppDispatch()
  dispatch(getUserThunk());
  dispatch(getUserProfileThunk());


  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  console.log("isAuthenticated", isAuthenticated);
  return {
    isAuth: isAuthenticated
  }
}

export default useAuth
