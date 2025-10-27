import { useCurrentUser } from "@/features/auth/model/supabase-hooks";

export const useAuth = () => {
  const { data: userData } = useCurrentUser();
  const isAuth = !!userData?.user;

  return {
    isAuth,
    user: userData?.user,
  };
};

export default useAuth;
