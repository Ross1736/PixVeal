import { Pressable, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { colors, colorTema } from "../../src/utils/colors";
import AuthContext from "../../src/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import ComentarioPublicacion from "../../src/components/tarjetas/ComentarioPublicacion";
import { router } from "expo-router";
import FetchContext from "../../src/context/FetchContext";

const URL_API = process.env.EXPO_PUBLIC_API_URL;

function Comentarios() {
  const { usuarioAuth } = useContext(AuthContext);
  const { setDatosActualizados } = useContext(FetchContext);

  const [listaComentarios, setListaComentarios] = useState([]);
  const [verMas, setVerMas] = useState(12);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const respuesta = await axios.get(
          `${URL_API}/api/v1/usuarios/comentarios`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${usuarioAuth.token}`,
            },
            withCredentials: true,
          }
        );

        setListaComentarios(respuesta.data);
      } catch (error) {
        console.log(error.response.data);
      } finally {
        setCargando(false);
      }
    };

    fetchComentarios();
  }, []);

  if (cargando) {
    return (
      <View style={estilo.contenedor_cargando}>
        <Text style={estilo.titulo}>Tus Comentarios</Text>
      </View>
    );
  }

  return (
    <View style={estilo.contenedor}>
      <FlashList
        data={listaComentarios
          .sort((a, b) => b.comentario_id - a.comentario_id)
          .slice(0, verMas)}
        numColumns={1}
        ListHeaderComponent={() => (
          <View style={estilo.textos}>
            <Text style={estilo.titulo}>Tus Comentarios</Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <Pressable
            key={index}
            onPress={() => {
              setDatosActualizados(null);

              router.push({
                pathname: "publicaciones/publicacion",
                params: {
                  id: item.publicacion_id,
                },
              });
            }}
          >
            <ComentarioPublicacion e={item} />
          </Pressable>
        )}
        estimatedItemSize={50}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        ListEmptyComponent={() => (
          <View style={estilo.no_comentarios}>
            <Text style={estilo.no_comentarios_texto}>
              No tienes comentarios
            </Text>
          </View>
        )}
        // paginación
        onEndReached={() => {
          if (listaComentarios.length >= verMas) {
            return setVerMas(verMas + 24);
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

export default Comentarios;
