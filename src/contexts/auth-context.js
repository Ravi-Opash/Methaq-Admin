import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import PropTypes from "prop-types";
import {
  getAdminDetails,
  loginAdmin,
  logoutAdmin,
} from "src/redux/actions/authAcion";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getNotificationNumbers } from "src/sections/overview/action/overviewAction";
import { setNotificationNumber } from "src/sections/overview/reducer/overviewSlice";
import { socket } from "src/utils/socket";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const router = useRouter();
  const { children } = props;

  const { loginUserData } = useSelector((state) => state.auth);

  const mainDispatch = useDispatch();
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled

    if (initialized.current) {
      return;
    }

    initialized.current = true;

    // let isAuthenticated = false;

    if (socket) {
      if (socket.disconnected) socket.connect();
      socket.emit("join", { room: "notificationsidebar" });

      socket.off("notification-updated");
      socket.on("notification-updated", (info) => {
        if (info?.Errors?.length > 0) {
        } else {
          mainDispatch(setNotificationNumber(info));
        }
      });
    }

    try {
      // isAuthenticated = window.sessionStorage.getItem("authenticated") === "true";

      const token = globalThis.localStorage.getItem("accessToken");

      // console.log("token", token);
      // console.log("initialState", initialState);
      // console.log("loginUserData", loginUserData);

      if (token) {
        mainDispatch(getAdminDetails())
          .unwrap()
          .then((res) => {
            // console.log("res", res);
            if (res?.success) {
              dispatch({
                type: HANDLERS.INITIALIZE,
                payload: res?.data,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });

        mainDispatch(getNotificationNumbers({}))
          .unwrap()
          .then((res) => {
            mainDispatch(setNotificationNumber(res?.data));
          })
          .catch((err) => {
            console.log(err, "err");
          });

        // const user = {
        //   id: "5e86809283e28b96d2d38537",
        //   avatar: "/assets/avatars/avatar-anika-visser.png",
        //   name: "Anika Visser",
        //   email: "anika.visser@devias.io",
        // };
      } else {
        dispatch({
          type: HANDLERS.INITIALIZE,
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  // const initialize = async (): Promise<void> => {
  //   try {
  //     const token = globalThis.localStorage.getItem("accessToken");

  //     if (token) {
  //       const user = await authApi.me({ token });

  //       dispatch({
  //         type: ActionType.INITIALIZE,
  //         payload: {
  //           isAuthenticated: true,
  //           user,
  //         },
  //       });
  //     } else {
  //       dispatch({
  //         type: ActionType.INITIALIZE,
  //         payload: {
  //           isAuthenticated: false,
  //           user: null,
  //         },
  //       });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     dispatch({
  //       type: ActionType.INITIALIZE,
  //       payload: {
  //         isAuthenticated: false,
  //         user: null,
  //       },
  //     });
  //   }
  // };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // const skip = () => {
  //   try {
  //     window.sessionStorage.setItem('authenticated', 'true');
  //   } catch (err) {
  //     console.error(err);
  //   }

  //   const user = {
  //     id: '5e86809283e28b96d2d38537',
  //     avatar: '/assets/avatars/avatar-anika-visser.png',
  //     name: 'Anika Visser',
  //     email: 'anika.visser@devias.io'
  //   };

  //   dispatch({
  //     type: HANDLERS.SIGN_IN,
  //     payload: user
  //   });
  // };

  const signIn = async (data) => {
    // if (email !== "demo@devias.io" || password !== "Password123!") {
    //   throw new Error("Please check your email and password");
    // }

    mainDispatch(loginAdmin(data))
      .unwrap()
      .then((res) => {
        // console.log("res", res);
        if (res?.success) {
          dispatch({
            type: HANDLERS.SIGN_IN,
            payload: res?.data,
          });

          router.push("/");
        }

        // const user = {
        //   id: "5e86809283e28b96d2d38537",
        //   avatar: "/assets/avatars/avatar-anika-visser.png",
        //   name: "Anika Visser",
        //   email: "anika.visser@devias.io",
        // };
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });

    // try {
    //   window.sessionStorage.setItem("authenticated", "true");
    // } catch (err) {
    //   console.error(err);
    // }
  };

  // const signUp = async (email, name, password) => {
  //   throw new Error("Sign up is not implemented");
  // };

  const signOut = () => {
    mainDispatch(logoutAdmin())
      .unwrap()
      .then((res) => {
        router.push("/auth/login");
        dispatch({
          type: HANDLERS.SIGN_OUT,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        // skip,
        signIn,
        // signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
