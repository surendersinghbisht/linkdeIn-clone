import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import NotificationsPage from "./pages/NotificationPage";
import NetworkPage from "./pages/NetworkPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        console.log("Fetched user data:", res.data); 
        return res.data;
      } catch (error) {
        console.error("Error fetching /me:", error.response?.data);
        if (error.response?.status === 401) {
          return null; 
        }
        toast.error(error.response?.data?.message || "Something went wrong");
        return null;
      }
    },
  });
  

  if (isLoading) {
    return null; // ✅ Prevents UI from rendering before data is ready
  }

  console.log("data", authUser);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="network" element={authUser? <NetworkPage />: <Navigate to="/login" />} />
        <Route path="/profile/:userName" element={authUser? <ProfilePage />: <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </Layout>
  );
}

export default App;
