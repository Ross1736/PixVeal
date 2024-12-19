import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const URL_API = process.env.EXPO_PUBLIC_API_URL;

export const AuthProvider = ({ children }) => {
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  const [usuarioAuth, setUsuarioAuth] = useState(null);
  const [datosUsuarioLocal, setDatosUsuarioLocal] = useState(null);

  useEffect(() => {
    actualizarUsuario();
  }, []);

  async function actualizarUsuario() {
    setCargandoUsuario(true);

    try {
      const usuarioActual = await AsyncStorage.getItem("Usuario-2cdf6b53");
      const usuario = usuarioActual ? JSON.parse(usuarioActual) : null;
      setUsuarioAuth(usuario);
    } catch (error) {
      console.log(error);
    } finally {
      setCargandoUsuario(false);
    }
  }

  async function agregarUsuario(e) {
    try {
      await AsyncStorage.setItem("Usuario-2cdf6b53", JSON.stringify(e));
      actualizarUsuario();
    } catch (error) {
      console.log(error);
    }
  }

  async function cerrarSesion() {
    try {
      await AsyncStorage.removeItem("Usuario-2cdf6b53");
      actualizarUsuario();
    } catch (error) {
      console.log(error);
    }
  }

  // Verificamos session
  useEffect(() => {
    if (usuarioAuth) {
      const fetchEstadoSesion = async () => {
        try {
          const respuesta = await axios.get(
            `${URL_API}/api/v1/auth/verificar`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${usuarioAuth.token}`,
              },
              withCredentials: true,
            }
          );

          if (respuesta.status === 200) {
            await getDatosUsuario(respuesta.data.user_id);
          }
        } catch (error) {
          if (error.response.status === 401) {
            cerrarSesion();
          }
        }
      };

      fetchEstadoSesion();
    }
  }, [usuarioAuth]);

  //
  async function getDatosUsuario(user_id) {
    try {
      const respuesta = await axios.get(
        `${URL_API}/api/v1/usuarios/usuario/${user_id}`
      );

      await AsyncStorage.setItem(
        "Datos-Usuario=92mc8ns1",
        JSON.stringify(respuesta.data)
      );

      setDatosUsuarioLocal(respuesta.data);
    } catch (error) {
      console.log(error.response.data);
    }
  }

  async function getDatosUsuarioLocal() {
    const datos = await AsyncStorage.getItem("Datos-Usuario=92mc8ns1");
    const datosActuales = datos ? JSON.parse(datos) : null;

    return datosActuales;
  }

  const DATOS_CONTEXTO = {
    cargandoUsuario,
    setCargandoUsuario,
    usuarioAuth,
    agregarUsuario,
    cerrarSesion,
    getDatosUsuario,
    datosUsuarioLocal,
    setDatosUsuarioLocal,
    getDatosUsuarioLocal,
  };

  return (
    <AuthContext.Provider value={DATOS_CONTEXTO}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
