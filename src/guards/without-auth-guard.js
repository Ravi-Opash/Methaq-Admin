import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useAuthContext } from "src/contexts/auth-context";

export const WithoutAuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const ignore = useRef(false);
  const { isAuthenticated } = useAuthContext();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (ignore.current) {
      return;
    }

    ignore.current = true;

    if (isAuthenticated) {
      console.log("authenticated, redirecting");

      router.push("/");

      //   router
      //     .replace({
      //       pathname: "/auth/login",
      //       query: router.asPath !== "/" ? { continueUrl: router.asPath } : undefined,
      //     })
      //     .catch(console.error);
    } else {
      setChecked(true);
    }
  }, [router.isReady]);

  if (!checked) {
    return null;
  }

  return children;
};

WithoutAuthGuard.propTypes = {
  children: PropTypes.node,
};
