import { useState } from "react";
import { User, Save, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWords } from "../context/WordContext";

export default function ProfilePage() {
  const { user, updateName } = useAuth();
  const { words, folders } = useWords();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (tempName.trim()) {
      setIsLoading(true);
      setError("");
      try {
        await updateName(tempName);
        setIsEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update name");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStartEdit = () => {
    setTempName(user?.name || "");
    setIsEditing(true);
    setError("");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">Profile Settings</h2>
            <p className="text-sm text-gray-500">Manage your account preferences</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Enter name"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSave}
                  disabled={isLoading || !tempName.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-gray-900">{user?.name || "Not set"}</div>
                <button
                  onClick={handleStartEdit}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="text-gray-900">{user?.email}</div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-2xl font-medium text-gray-900">
                  {words.length}
                </div>
                <div className="text-sm text-gray-500">Words Added</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-2xl font-medium text-gray-900">
                  {folders.length}
                </div>
                <div className="text-sm text-gray-500">Folders Created</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
