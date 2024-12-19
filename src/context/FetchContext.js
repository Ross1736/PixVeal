import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AuthContext from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const URL_API = process.env.EXPO_PUBLIC_API_URL;

const FetchContext = createContext();

export const FetchProvider = ({ children }) => {
  const { usuarioAuth } = useContext(AuthContext);

  const DATOS_UUID = "datos-pixveal-29v7csm0";
  const USUARIOS_UUID = "usuarios-datos-2nm41x10";
  const FECHA_GUARDADA = "fecha-actual-29vk291m";
  const TIEMPO = 6 * 3600000;
  // const TIEMPO_PRUEBA = 60000;

  const [publicaciones, setPublicaciones] = useState([]);
  const [paginacion, setPaginacion] = useState({
    page: 1,
    prev_page: 1,
    next_page: 2,
    total_pages: 2,
  });
  //
  const [datosActualizados, setDatosActualizados] = useState(null);
  const [actualizando, setActualizando] = useState(false);

  useEffect(() => {
    getPublicaciones(1);
  }, []);

  // const categorias = ["Animales", "Comida"];
  // const queryString = categorias.join(",");

  async function getPublicaciones(pagina) {
    setActualizando(true);
    setPublicaciones([]);

    try {
      const respuesta = await axios.get(
        `${URL_API}/api/v1/publicaciones?page=${pagina}`,
        {
          timeout: 10000,
        }
      );

      if (respuesta) {
        await AsyncStorage.setItem(
          DATOS_UUID,
          JSON.stringify(respuesta.data.publicaciones)
        );
      }

      setPaginacion({
        page: respuesta.data.page,
        prev_page: respuesta.data.prev_page,
        next_page: respuesta.data.next_page,
        total_pages: respuesta.data.total_pages,
      });
      setPublicaciones(respuesta.data.publicaciones);
    } catch (error) {
      console.log(error.response.data);

      const datos = await getDatosLocal();
      setPublicaciones(datos);
    } finally {
      setActualizando(false);
    }
  }

  async function getDatosLocal() {
    const datosActuales = await AsyncStorage.getItem(DATOS_UUID);
    const datos = datosActuales ? JSON.parse(datosActuales) : [];

    // const aletorio = datos.sort(() => Math.random() - 0.5);

    return datos;
  }

  const postLike = useCallback(
    async (id) => {
      try {
        const respuesta = await axios.post(
          `${URL_API}/api/v1/publicaciones/likes`,
          { publicacion_id: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${usuarioAuth.token}`,
            },
            withCredentials: true,
          }
        );
        setPublicaciones((prevPublicaciones) =>
          prevPublicaciones.map((publicacion) =>
            publicacion.publicacion_id === respuesta.data.publicacion_id
              ? {
                  ...publicacion,
                  likes: [...publicacion.likes, respuesta.data],
                }
              : publicacion
          )
        );
      } catch (error) {
        console.error(error);
      }
    },
    [usuarioAuth]
  );

  const deleteLike = useCallback(
    async (publicacion_id, id) => {
      try {
        await axios.delete(`${URL_API}/api/v1/publicaciones/likes`, {
          data: { like_id: id },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${usuarioAuth.token}`,
          },
          withCredentials: true,
        });
        setPublicaciones((prevPublicaciones) =>
          prevPublicaciones.map((publicacion) =>
            publicacion.publicacion_id === publicacion_id
              ? {
                  ...publicacion,
                  likes: publicacion.likes.filter(
                    (like) => like.like_id !== id
                  ),
                }
              : publicacion
          )
        );
      } catch (error) {
        console.error(error);
      }
    },
    [usuarioAuth]
  );

  async function getDatosPublicacion(id) {
    try {
      const respuesta = await axios.get(
        `${URL_API}/api/v1/publicaciones/publicacion/${Number(id)}`
      );

      setDatosActualizados(respuesta.data);

      return respuesta;
    } catch (error) {
      throw error;
    }
  }

  // Usuarios
  async function seguirUsuario(user_id) {
    try {
      const respuesta = await axios.post(
        `${URL_API}/api/v1/usuarios/seguir`,
        {
          seguido_id: user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${usuarioAuth.token}`,
          },
          withCredentials: true,
        }
      );

      return respuesta.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function dejarSeguirUsuario(user_id) {
    try {
      const respuesta = await axios.delete(
        `${URL_API}/api/v1/usuarios/seguir`,
        {
          data: {
            seguido_id: user_id,
          },
          headers: {
            Authorization: `Bearer ${usuarioAuth.token}`,
          },
          withCredentials: true,
        }
      );

      return respuesta.status;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function getUsuario(user_id) {
    try {
      const ahora = new Date().getTime();

      // Verificar fecha guardada
      const fechaGuardada = await AsyncStorage.getItem(FECHA_GUARDADA);

      // Limpiar caché si es necesario
      if (!fechaGuardada || ahora - fechaGuardada > TIEMPO) {
        await AsyncStorage.removeItem(USUARIOS_UUID);
        await AsyncStorage.setItem(FECHA_GUARDADA, String(ahora));
      }

      // Consultamos datos guardados
      const usuarioGuardado = await AsyncStorage.getItem(USUARIOS_UUID);
      const usuariosCacheados = usuarioGuardado
        ? JSON.parse(usuarioGuardado)
        : [];

      // Buscar usuario en caché
      const usuarioEncontrado = usuariosCacheados.find(
        (u) => u.user_id === user_id
      );

      // retornamos los datos del usuario desde el cache
      if (usuarioEncontrado) {
        return usuarioEncontrado;
      }

      // Consultar API si el usuario no está en caché
      const respuesta = await axios.get(
        `${URL_API}/api/v1/usuarios/usuario/${user_id}`
      );

      // añadimos el usuario a la lista de usuarios guardados
      const usuarioActualizado = [...usuariosCacheados, respuesta.data];

      // Limitar el tamaño del caché
      if (usuarioActualizado.length > 1000) {
        usuarioActualizado.shift();
      }

      await AsyncStorage.setItem(
        USUARIOS_UUID,
        JSON.stringify(usuarioActualizado)
      );

      return respuesta.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function eliminarUsuariosLocal() {
    await AsyncStorage.removeItem(USUARIOS_UUID);
  }

  const DATOS_CONTEXTO = {
    publicaciones,
    setPublicaciones,
    paginacion,
    //
    actualizando,
    setActualizando,
    getPublicaciones,
    postLike,
    deleteLike,
    seguirUsuario,
    dejarSeguirUsuario,
    getDatosPublicacion,
    datosActualizados,
    setDatosActualizados,
    getUsuario,
    eliminarUsuariosLocal,
  };

  return (
    <FetchContext.Provider value={DATOS_CONTEXTO}>
      {children}
    </FetchContext.Provider>
  );
};

export default FetchContext;
