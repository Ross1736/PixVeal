import { Image, Pressable, StyleSheet, Text, View, Share } from "react-native";
import {
  AntDesign,
  MaterialCommunityIcons,
  Feather,
  FontAwesome,
} from "../../imports/importsIconos";
import { useState, useContext, memo, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { router } from "expo-router";
import { colors, colorTema } from "../../utils/colors";
import FetchContext from "../../context/FetchContext";
import FastImage from "react-native-fast-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { cantidadNumeros } from "../../utils/funciones";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

const ENDPOINT = process.env.EXPO_PUBLIC_ENDPOINT;

const Memo = memo(({ item, index }) => {
  const { usuarioAuth } = useContext(AuthContext);
  const { postLike, deleteLike, setDatosActualizados } =
    useContext(FetchContext);

  const [cargandoImagen, setCargandoImagen] = useState(false);
  const [estadoLike, setEstadoLike] = useState(false);
  const [estadoBoton, setEstadoBoton] = useState(false);
  const [estadoCompartir, setEstadoCompartir] = useState(false);

  const cantidadLikes = cantidadNumeros(item.likes.length);
  const cantidadComentarios = cantidadNumeros(item.comentarios.length);

  useEffect(() => {
    const fetchLikes = async () => {
      if (item.likes.length === 0 || !usuarioAuth) {
        setEstadoLike(false);
        return;
      }

      const existe = item.likes.some((f) => f.user_id === usuarioAuth.user_id);
      setEstadoLike(existe);
    };

    fetchLikes();
  }, [item.likes, usuarioAuth]);

  function carga(e) {
    setCargandoImagen(true);
  }

  async function quitarLike() {
    if (!usuarioAuth) {
      router.push("/usuario/ingresar");
      return;
    }

    setEstadoBoton(true);
    setEstadoLike(!estadoLike);

    try {
      await deleteLike(
        item.publicacion_id,
        item.likes.find((f) => f.user_id === usuarioAuth.user_id).like_id
      );
    } catch (error) {
      console.log(error);
    } finally {
      setEstadoBoton(false);
    }
  }

  async function darLike() {
    if (!usuarioAuth) {
      router.push("/usuario/ingresar");
      return;
    }

    setEstadoBoton(true);
    setEstadoLike(!estadoLike);

    try {
      await postLike(item.publicacion_id);
    } catch (error) {
      console.log(error);
    } finally {
      setEstadoBoton(false);
    }
  }

  function irPublicacion() {
    setDatosActualizados(null);

    router.push({
      pathname: "publicaciones/publicacion",
      params: {
        id: item.publicacion_id,
      },
    });
  }

  // animacion
  const opacidad = useSharedValue(0);

  useEffect(() => {
    opacidad.value = withTiming(1, { duration: 500 });
  }, []);

  const estiloAnimado = useAnimatedStyle(() => ({
    opacity: opacidad.value,
  }));

  async function compartirLink() {
    try {
      const resultado = await Share.share({
        message: `${item.titulo}: ${ENDPOINT}${item.foto}`,
      });

      console.log(resultado);
    } catch (error) {
      console.log(error);
    }
  }

  async function compartir() {
    setEstadoCompartir(true);

    try {
      const fotoUrl = `${ENDPOINT}${item.foto}`;
      const localUri = FileSystem.cacheDirectory + item.titulo + ".webp";

      //
      const fotoLocal = await FileSystem.downloadAsync(fotoUrl, localUri);

      await Sharing.shareAsync(fotoLocal.uri, {
        mimeType: "image/webp",
        dialogTitle: "Compartir Foto",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setEstadoCompartir(false);
    }
  }

  return (
    <Animated.View style={estiloAnimado}>
      <View style={estilo.tarjeta}>
        <Pressable style={estilo.img} onPress={irPublicacion}>
          {!cargandoImagen && (
            <Image
              style={estilo.image}
              source={require("../../../assets/img/no-img.png")}
            />
          )}

          <FastImage
            style={estilo.image}
            source={{
              uri: `${ENDPOINT}${item.foto}`,
              priority: FastImage.priority.low,
              cache: "immutable",
            }}
            resizeMode={FastImage.resizeMode.cover}
            onLoad={carga}
          />
        </Pressable>

        <Pressable style={estilo.textos} onPress={irPublicacion}>
          <Text
            style={estilo.textos_titulo}
            ellipsizeMode="clip"
            numberOfLines={1}
          >
            {item.titulo}
          </Text>
          <Text
            style={estilo.textos_descripcion}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            {item.descripcion}
          </Text>
        </Pressable>

        <View style={estilo.botones}>
          <View style={estilo.botones_usuario}>
            {estadoLike ? (
              <Pressable
                style={estilo.botones_boton}
                disabled={estadoBoton}
                onPress={quitarLike}
              >
                <AntDesign
                  name="heart"
                  size={24}
                  color={colors.color_rojo}
                  style={{ width: 24 }}
                />

                <Text style={estilo.botones_boton_texto}>{cantidadLikes}</Text>
              </Pressable>
            ) : (
              <Pressable
                style={estilo.botones_boton}
                disabled={estadoBoton}
                onPress={darLike}
              >
                <AntDesign
                  name="hearto"
                  size={24}
                  color={colorTema.color_9}
                  style={{ width: 24 }}
                />
                <Text style={estilo.botones_boton_texto}>{cantidadLikes}</Text>
              </Pressable>
            )}

            <Pressable style={estilo.botones_boton} onPress={irPublicacion}>
              <MaterialCommunityIcons
                name="comment-processing-outline"
                size={24}
                color={colorTema.color_9}
                style={{ width: 24 }}
              />
              <Text style={estilo.botones_boton_texto}>
                {cantidadComentarios}
              </Text>
            </Pressable>

            {/* <Pressable style={estilo.botones_boton}>
              <Feather
                name="send"
                size={22}
                color={colorTema.color_9}
                style={{ width: 22 }}
              />
            </Pressable> */}
          </View>

          <Pressable
            style={estilo.botones_boton}
            onPress={compartir}
            disabled={estadoCompartir}
          >
            <AntDesign
              name="sharealt"
              size={24}
              style={{ width: 24 }}
              color={colorTema.color_9}
            />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
});

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
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  // textos
  textos: {
    paddingHorizontal: 15,

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
  // botones
  botones: {
    paddingHorizontal: 15,

    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 20,
  },
  botones_usuario: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 15,
  },
  botones_boton: {
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: colors.blanco,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  botones_boton_texto: {
    fontSize: 12,
    color: colorTema.color_7,
    fontFamily: "Fuente-400",
  },
});

export default Memo;
