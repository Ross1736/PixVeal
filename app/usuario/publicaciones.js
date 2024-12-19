import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import AuthContext from "../../src/context/AuthContext";
import { colorTema } from "../../src/utils/colors";
import { FlashList } from "@shopify/flash-list";
import TarjetaPublicacion from "../../src/components/tarjetas/TarjetaPublicacion";

const { width, height } = Dimensions.get("window");

const URL_API = process.env.EXPO_PUBLIC_API_URL;

function Publicaciones() {
  const { usuarioAuth } = useContext(AuthContext);

  const [cargando, setCargando] = useState(true);
  const [verMas, setVerMas] = useState(12);
  const [listaPublicaciones, setListaPublicaciones] = useState([]);

  useEffect(() => {
    const fetchPublicacionesUsuario = async () => {
      setCargando(true);

      try {
        const respuesta = await axios.get(
          `${URL_API}/api/v1/publicaciones/usuario/${usuarioAuth.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${usuarioAuth.token}`,
            },
            withCredentials: true,
          }
        );

        setListaPublicaciones(respuesta.data);
      } catch (error) {
        console.log(error.response.data);
      } finally {
        setCargando(false);
      }
    };

    fetchPublicacionesUsuario();
  }, []);

  if (cargando) {
    return (
      <View style={estilo.contenedor_cargando}>
        <Text style={estilo.titulo}>Tus Publicaciones</Text>
      </View>
    );
  }

  return (
    <View style={estilo.contenedor}>
      <FlashList
        data={listaPublicaciones
          .sort((a, b) => b.comentario_id - a.comentario_id)
          .slice(0, verMas)}
        numColumns={1}
        ListHeaderComponent={() => (
          <View style={estilo.textos}>
            <Text style={estilo.titulo}>Tus Publicaciones</Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <TarjetaPublicacion
            key={index}
            e={item}
            listaPublicaciones={listaPublicaciones}
            setListaPublicaciones={setListaPublicaciones}
          />
        )}
        estimatedItemSize={width}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
        ListEmptyComponent={() => (
          <View style={estilo.no_comentarios}>
            <Text style={estilo.no_comentarios_texto}>
              No tienes Publicaciones
            </Text>
          </View>
        )}
        // paginación
        onEndReached={() => {
          if (listaPublicaciones.length >= verMas) {
            return setVerMas(verMas + 12);
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const estilo = StyleSheet.create({
  contenedor_cargando: {
    flex: 1,

    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 20,

    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 20,
  },
  contenedor: {
    flex: 1,

    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  // textos
  textos: {
    marginBottom: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  titulo: {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 12,

    fontFamily: "Fuente-600",
    color: colorTema.color_9,
  },
  // comentarios
  no_comentarios: {
    paddingHorizontal: 20,
    paddingVertical: 40,

    alignItems: "center",
    justifyContent: "center",
  },
  no_comentarios_texto: {
    fontSize: 12,
    fontFamily: "Fuente-300",
    color: colorTema.color_7,
  },
});

export default Publicaciones;
