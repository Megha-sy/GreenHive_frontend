import { useTheme } from "../../context/ThemeContext";

export default function Settings() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-6">
        Settings ⚙️
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-800 dark:text-white">
            Dark Mode
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Toggle light / dark theme
          </p>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
            darkMode ? "bg-green-600" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transform transition ${
              darkMode ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
