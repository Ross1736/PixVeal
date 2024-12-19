import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, colorTema } from "../../utils/colors";
import { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { router } from "expo-router";
import FetchContext from "../../context/FetchContext";

const URL_API = process.env.EXPO_PUBLIC_API_URL;

function ComentarPublicacion({ publicacion_id }) {
  const { usuarioAuth } = useContext(AuthContext);
  const { datosActualizados, setDatosActualizados } = useContext(FetchContext);

  const [comentario, setComentario] = useState("");
  const [estadoComentar, setEstadoComentar] = useState(false);

  async function comentar() {
    if (!usuarioAuth) {
      router.push("/usuario/ingresar");
      return;
    }

    setEstadoComentar(true);

    const comentarioNuevo = {
      comentario: comentario,
      comentario_id: Math.floor(10000000 + Math.random() * 90000000),
      publicacion_id: publicacion_id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user_id: usuarioAuth.user_id,
    };

    setDatosActualizados((prevDatos) => ({
      ...prevDatos,
      comentarios: [...prevDatos.comentarios, comentarioNuevo],
    }));
    setComentario("");

    try {
      await axios.post(
        `${URL_API}/api/v1/publicaciones/comentario`,
        {
          publicacion_id: publicacion_id,
          comentario: comentario,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${usuarioAuth.token}`,
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setEstadoComentar(false);
    }
  }

  return (
    <View style={estilo.contenedor}>
      <TextInput
        style={estilo.text_area}
        keyboardType="default"
        placeholder="Ingresar comentario..."
        placeholderTextColor={colorTema.color_4}
        value={comentario}
        multiline={true}
        numberOfLines={7}
        textAlignVertical="top"
        onChangeText={(valor) => setComentario(valor)}
      />

      {comentario.length > 0 && (
        <Pressable onPress={comentar} disabled={estadoComentar}>
          <Text style={estilo.texto_boton}>Publicar</Text>
        </Pressable>
      )}
    </View>
  );
}

const estilo = StyleSheet.create({
  contenedor: {
    width: "100%",

    borderTopWidth: 1,
    borderColor: colorTema.color_3,

    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
  },
  text_area: {
    flexShrink: 1,
    flexGrow: 1,

    paddingHorizontal: 12,
    paddingVertical: 12,

    fontSize: 14,
    fontFamily: "Texto-300",
    color: colorTema.color_7,
  },
  texto_boton: {
    paddingRight: 12,
    paddingBottom: 12,

    color: colors.color_primario,
    fontSize: 14,
    fontFamily: "Fuente-600",
  },
});

export default ComentarPublicacion;
