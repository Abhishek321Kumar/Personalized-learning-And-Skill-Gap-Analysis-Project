import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { api } from "./api/client";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { SignInPage } from "./pages/SignInPage";
import { RegistrationFlow } from "./pages/RegistrationFlow";
import { DashboardPage } from "./pages/DashboardPage";
import { AssessmentSetupPage } from "./pages/AssessmentSetupPage";
import { AssessmentLoadingPage } from "./pages/AssessmentLoadingPage";
import { AssessmentReviewPage } from "./pages/AssessmentReviewPage";
import { QuizPage } from "./pages/QuizPage";
import { QuizSuccessPage } from "./pages/QuizSuccessPage";
import { SkillGapLoadingPage } from "./pages/SkillGapLoadingPage";
import { SkillGapFlow } from "./pages/SkillGapFlow";
import { ProfilePage } from "./pages/ProfilePage";

const getStoredUser = () => {
  try {
    return JSON.parse(window.localStorage.getItem("skillbridge-user") || "null");
  } catch (_error) {
    return null;
  }
};

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
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
    if (nextUser) {
      window.localStorage.setItem("skillbridge-user", JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem("skillbridge-user");
    }
  };

  return (
    <Layout user={user} modules={modules} onUserUpdate={handleUserUpdate}>
      <Routes>
        <Route path="/" element={<HomePage modules={modules} user={user} />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<SignInPage onAuthSuccess={handleUserUpdate} />} />
        <Route path="/register/*" element={<RegistrationFlow onAuthSuccess={handleUserUpdate} />} />
        
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <DashboardPage user={user} />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <ProfilePage user={user} onUserUpdate={handleUserUpdate} />
            </ProtectedRoute>
          }
        />

        {/* Assessment Flow */}
        <Route
          path="/assessments/setup"
          element={
            <ProtectedRoute user={user}>
              <AssessmentSetupPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessments/loading"
          element={
            <ProtectedRoute user={user}>
              <AssessmentLoadingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessments/review"
          element={
            <ProtectedRoute user={user}>
              <AssessmentReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessments/quiz"
          element={
            <ProtectedRoute user={user}>
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessments/success"
          element={
            <ProtectedRoute user={user}>
              <QuizSuccessPage />
            </ProtectedRoute>
          }
        />

        {/* Skill Gap Flow */}
        <Route
          path="/skill-gap/loading"
          element={
            <ProtectedRoute user={user}>
              <SkillGapLoadingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skill-gap/*"
          element={
            <ProtectedRoute user={user}>
              <SkillGapFlow user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
