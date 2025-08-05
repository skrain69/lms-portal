import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you're looking for doesn’t exist or under WIP.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
