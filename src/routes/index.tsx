import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, FolderOpen, BarChart3, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-gray-800" />
              <span className="text-xl font-semibold text-gray-800">
                VocabMaster
              </span>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/folders"
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all text-sm"
                >
                  My Folders
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all text-sm"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Header/Hero Section */}
        <section className="py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Master Vocabulary at Your Own Pace
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Build your language skills with smart flashcards, organized folders,
            and an intuitive learning experience designed for success.
          </p>
          {isAuthenticated ? (
            <Link
              to="/folders"
              className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
            >
              Go to My Folders
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/signup"
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-white text-gray-800 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all"
              >
                Sign In
              </Link>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Everything You Need to Learn
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-gray-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Smart Flashcards
                  </h3>
                  <p className="text-sm text-gray-600">
                    Create and practice with intelligent flashcards designed for
                    effective learning.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="h-6 w-6 text-gray-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Organized Folders
                  </h3>
                  <p className="text-sm text-gray-600">
                    Keep your vocabulary organized by topics, subjects, or
                    difficulty levels.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-gray-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Track Progress
                  </h3>
                  <p className="text-sm text-gray-600">
                    Monitor your learning journey and celebrate your achievements
                    along the way.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-gray-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Fast & Simple
                  </h3>
                  <p className="text-sm text-gray-600">
                    Intuitive interface that lets you focus on learning, not
                    navigation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!isAuthenticated && (
          <section className="py-12">
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">
                Ready to Start Learning?
              </h2>
              <p className="text-gray-300 mb-6">
                Join VocabMaster today and take your vocabulary to the next
                level.
              </p>
              <Link
                to="/signup"
                className="inline-block px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-all"
              >
                Create Free Account
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gray-800" />
              <span className="font-semibold text-gray-800">VocabMaster</span>
            </div>
            <div>&copy; {new Date().getFullYear()} All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
