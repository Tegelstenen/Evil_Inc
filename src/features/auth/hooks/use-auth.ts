export function useAuth() {
	// const router = useRouter();
	// const [isLoading, setIsLoading] = useState(true);
	// const [isAuthenticated, setIsAuthenticated] = useState(false);
	// const [user, setUser] = useState<>(null);
	// useEffect(() => {
	//   const checkAuth = async () => {
	//     try {
	//       const { data: session } = await getSession();
	//       if (session?.user) {
	//         setIsAuthenticated(true);
	//         setUser(session.user);
	//       } else {
	//         setIsAuthenticated(false);
	//         setUser(null);
	//       }
	//     } catch (error) {
	//       console.error("Error checking auth status:", error);
	//       setIsAuthenticated(false);
	//       setUser(null);
	//     } finally {
	//       setIsLoading(false);
	//     }
	//   };
	//   checkAuth();
	// }, []);
	// const signOut = async () => {
	//   try {
	//     // TODO: Implement sign out logic
	//     setIsAuthenticated(false);
	//     setUser(null);
	//     router.push("/auth");
	//   } catch (error) {
	//     console.error("Error signing out:", error);
	//   }
	// };
	// return {
	//   isLoading,
	//   isAuthenticated,
	//   user,
	//   signOut,
	// };
}
