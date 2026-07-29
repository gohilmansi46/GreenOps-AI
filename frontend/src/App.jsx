import { useTheme } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const { darkMode } = useTheme();

  return (
    <div className={darkMode ? "dark" : ""}>
      <AppRoutes />
    </div>
  );
}

export default App;