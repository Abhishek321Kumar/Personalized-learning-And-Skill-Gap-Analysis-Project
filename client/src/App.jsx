import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { api } from "./api/client";
import { Layout } from "./components/Layout";
import { AuthPage } from "./pages/AuthPage";
import { AssessmentPage } from "./pages/AssessmentPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { SkillGapPage } from "./pages/SkillGapPage";

const getStoredUser = () => {
  try {
    return JSON.parse(window.localStorage.getItem("skillbridge-user") || "null");
  } catch (_error) {
    return null;
  }
};

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default function App() {
  const [modules, setModules] = useState([]);
  const [user, setUser] = useState(getStoredUser());

  useEffect(() => {
    api.getModules().then((response) => setModules(response.modules));
  }, []);

  const handleUserUpdate = (nextUser) => {
    setUser(nextUser);
    window.localStorage.setItem("skillbridge-user", JSON.stringify(nextUser));
  };

  return (
    <Layout user={user} modules={modules}>
      <Routes>
        <Route path="/" element={<HomePage modules={modules} user={user} />} />
        <Route path="/auth" element={<AuthPage onAuthSuccess={handleUserUpdate} />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <ProfilePage user={user} onUserUpdate={handleUserUpdate} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skill-gap"
          element={
            <ProtectedRoute user={user}>
              <SkillGapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <DashboardPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute user={user}>
              <AssessmentPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
