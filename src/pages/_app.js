import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AuthConsumer, AuthProvider } from "src/contexts/auth-context";
import store from "../redux/store";
import { Provider, useSelector } from "react-redux";
import { useNProgress } from "src/hooks/use-nprogress";
import { createTheme } from "src/theme";
import { createEmotionCache } from "src/utils/create-emotion-cache";
import { ToastContainer } from "react-toastify";
import "simplebar-react/dist/simplebar.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { moduleAccess } from "src/utils/module-access";
import UnAuthoraize from "src/components/authorizePage";
import NotFound404 from "src/components/notFound404";
import Maintenance from "src/components/maintenance";
import "../styles/globals.css";

// Create a client-side emotion cache for SSR (server-side rendering)
const clientSideEmotionCache = createEmotionCache();

// Splash screen component (can be used for loading indicator during initialization)
const SplashScreen = () => null;

// AccessGuard component to handle route access control
const AccessGuard = ({ children }) => {
  // Check if the application is in maintenance mode
  if (process.env.NEXT_PUBLIC_IS_MAINTENANCE == 1) {
    return <Maintenance />; // Show maintenance page if enabled
  }

  const { loginUserData: user, loading } = useSelector((state) => state.auth);

  const [isAccess, setIsAccess] = useState();
  const router = useRouter();

  // Check user access on route change or page load
  useEffect(() => {
    (async () => {
      const isPermited = await moduleAccess(user, router.route); // Check if user has access to the current route
      setIsAccess(isPermited); // Update access state
    })();
  }, [router.asPath]);

  // Conditional rendering based on the access permission
  if (isAccess === 404) {
    return <NotFound404 />; // Show 404 page if the route is not found
  } else if (isAccess) {
    return <>{children}</>; // Show the children (actual page) if the user has access
  } else if (isAccess == undefined) {
    return <></>; // Render nothing while access is being checked
  } else {
    return <UnAuthoraize />; // Show unauthorized page if access is denied
  }
};

// Main App component
const App = (props) => {
  // Destructure the page props passed from Next.js
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // Custom hook to manage NProgress (progress bar)
  useNProgress();

  // Determine the layout for the page (either default or custom defined in the page component)
  const getLayout = Component.getLayout ?? ((page) => page);

  // Create a theme object for Material UI
  const theme = createTheme();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>eSanad | Admin</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Provider store={store}>
        {/* Provide Redux store to the app */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            {/* Provide authentication context to the app */}
            <ThemeProvider theme={theme}>
              {/* Wrap the app with the Material UI theme */}
              <CssBaseline />
              <AuthConsumer>
                {(auth) =>
                  auth.isLoading ? (
                    <SplashScreen />
                  ) : (
                    getLayout(
                      <AccessGuard>
                        {/* Wrap the page with access control */}
                        <Component {...pageProps} />
                      </AccessGuard>
                    )
                  )
                }
              </AuthConsumer>
            </ThemeProvider>
          </AuthProvider>
        </LocalizationProvider>
        <ToastContainer /> {/* Display toast notifications globally */}
      </Provider>
    </CacheProvider>
  );
};

export default App;
