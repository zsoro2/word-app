import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Header from "../components/Header";
import ProfilePage from "../pages/ProfilePage";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <ProfilePage />
      </div>
    </ProtectedRoute>
  );
}
