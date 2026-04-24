import React from "react"
import "./index.css"
import "./styles/themes.css" // Import the themes CSS
import "./styles/theme-fixes.css" // Import the theme fixes CSS
import "./utils/axiosConfig" // Import axios configuration
import App from "./App.jsx"
import { Toaster } from "sonner"
import { Provider } from "react-redux"
import ReactDOM from "react-dom/client"
import store from "./redux/store"
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"
import { ThemeProvider } from "./context/ThemeContext" // Import ThemeProvider

const persistor = persistStore(store)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
    <Toaster />
  </React.StrictMode>,
)
