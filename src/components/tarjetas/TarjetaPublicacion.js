import { Image, Pressable, StyleSheet, Text, View, Alert } from "react-native";
import { useContext, useState } from "react";
import FetchContext from "../../context/FetchContext";
import { router } from "expo-router";
import FastImage from "react-native-fast-image";
import { colors, colorTema } from "../../utils/colors";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "../../imports/importsIconos";
import { cantidadNumeros } from "../../utils/funciones";
import axios from "axios";
import AuthContext from "../../context/AuthContext";

const ENDPOINT = process.env.EXPO_PUBLIC_ENDPOINT;
const URL_API = process.env.EXPO_PUBLIC_API_URL;

function TarjetaPublicacion({ e, listaPublicaciones, setListaPublicaciones }) {
  const { usuarioAuth } = useContext(AuthContext);
  const { setDatosActualizados } = useContext(FetchContext);

  const [cargandoImagen, setCargandoImagen] = useState(false);
  const [descripcion, setDescripcion] = useState(
    e.descripcion.length > 100
      ? e.descripcion.substring(0, 100) + "..."
      : e.descripcion
  );
  const [estadoBotonDescripcion, setEstadoBotonDescripcion] = useState(true);
  const [estadoBotonEliminar, setEstadoBotonEliminar] = useState(false);

  const cantidadLikes = cantidadNumeros(e.likes.length);
  const cantidadComentarios = cantidadNumeros(e.comentarios.length);

  function mostrarDescripcion() {
    setDescripcion(e.descripcion);
    setEstadoBotonDescripcion(false);
  }

  function carga(e) {
    setCargandoImagen(true);
  }

  async function modalEliminar() {
    Alert.alert(
      "Eliminar Publicación",
      "¿Estás seguro de que deseas eliminar esta Publicación?",
      [
        {
          text: "Si",
          onPress: async () => {
            await eliminarPublicacion();
          },
        },
        { text: "No" },
      ]
    );
  }

  async function eliminarPublicacion() {
    setEstadoBotonEliminar(true);

    try {
      await axios.delete(`${URL_API}/api/v1/publicaciones`, {
        data: { publicacion_id: e.publicacion_id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuarioAuth.token}`,
        },
        withCredentials: true,
      });

      const respuesta = listaPublicaciones.filter(
        (p) => p.publicacion_id !== e.publicacion_id
      );

      setListaPublicaciones(respuesta);
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setEstadoBotonEliminar(false);
    }
  }

  return (
    <View style={estilo.tarjeta}>
      <Pressable
        style={estilo.img}
        onPress={() => {
          setDatosActualizados(null);

          router.push({
            pathname: "publicaciones/publicacion",
            params: {
              id: e.publicacion_id,
            },
          });
        }}
      >
        {!cargandoImagen && (
          <Image
            style={estilo.image}
            source={require("../../../assets/img/no-img.png")}
          />
        )}

        <FastImage
          style={estilo.image}
          source={{
            uri: `${ENDPOINT}${e.foto}`,
            priority: FastImage.priority.low,
            cache: "immutable",
          }}
          resizeMode={FastImage.resizeMode.cover}
          onLoad={carga}
        />
      </Pressable>

      <View style={estilo.textos}>
        <Text style={estilo.textos_titulo}>{e.titulo}</Text>
        <Text style={estilo.textos_descripcion}>
          {descripcion}
          {estadoBotonDescripcion && (
            <Text onPress={mostrarDescripcion} style={estilo.boton_mostrar_mas}>
              {" "}
              Mostrar Más
            </Text>
          )}
        </Text>
      </View>

      <View style={estilo.iconos}>
        <View style={estilo.iconos_cantidad}>
          <View style={estilo.iconos_cantidad_icono}>
            <AntDesign
              name="heart"
              size={22}
              color={colors.color_9}
              style={{ width: 22 }}
            />
            <Text style={estilo.iconos_cantidad_icono_texto}>
              {cantidadLikes}
            </Text>
          </View>

          <View style={estilo.iconos_cantidad_icono}>
            <MaterialCommunityIcons
              name="comment-processing-outline"
              size={22}
              color={colorTema.color_9}
              style={{ width: 22 }}
            />
            <Text style={estilo.iconos_cantidad_icono_texto}>
              {cantidadComentarios}
            </Text>
          </View>
        </View>

        <Pressable onPress={modalEliminar} disabled={estadoBotonEliminar}>
          <MaterialIcons
            name="delete"
            size={24}
            color={colors.color_rojo}
            style={{ width: 24 }}
          />
        </Pressable>
      </View>
    </View>
  );
}

const estilo = StyleSheet.create({
  tarjeta: {
    width: "100%",

    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 10,
  },
  // foto
  img: {
    width: "100%",
    overflow: "hidden",
    aspectRatio: 4 / 4,
    backgroundColor: colorTema.color_2,
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  // textos
  textos: {
    paddingHorizontal: 4,

    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 2,
  },
  textos_titulo: {
    fontSize: 14,
    fontFamily: "Fuente-600",
  },
  textos_descripcion: {
    fontSize: 14,
    fontFamily: "Fuente-300",
  },
  // boton mostrar mas
  boton_mostrar_mas: {
    fontSize: 12,
    fontFamily: "Fuente-600",
    color: colorTema.color_9,
  },
  //   iconos
  iconos: {
    paddingHorizontal: 4,

    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  iconos_cantidad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 15,
  },
  iconos_cantidad_icono: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  iconos_cantidad_icono_texto: {
    fontSize: 12,
    color: colorTema.color_7,
    fontFamily: "Fuente-400",
  },
});

export default TarjetaPublicacion;
