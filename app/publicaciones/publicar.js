import React, { useContext, useState, useRef } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, colorTema } from "../../src/utils/colors";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import axios from "axios";
import AuthContext from "../../src/context/AuthContext";
import { router } from "expo-router";
import { generarNombreFoto } from "../../src/utils/funciones";
import FetchContext from "../../src/context/FetchContext";
import { Picker } from "@react-native-picker/picker";
import { listaCategorias } from "../../src/utils/listas";

const URL_API = process.env.EXPO_PUBLIC_API_URL;

function Publicar() {
  const { usuarioAuth } = useContext(AuthContext);
  const { getPublicaciones } = useContext(FetchContext);

  const scrollViewRef = useRef(null);

  const [datosForm, setDatosForm] = useState({
    titulo: "",
    descripcion: "",
  });
  const [seleccionarCategoria, setSeleccionarCategoria] = useState("Otros");
  const [fotoComprimida, setFotoComprimida] = useState(null);
  const [dimensionesFoto, setDimensionesFoto] = useState({
    width: 0,
    height: 0,
  });
  const [estadoBoton, setEstadoBoton] = useState(false);
  const [alerta, setAlerta] = useState("");

  function capturarInput(valor, nombre) {
    setDatosForm({ ...datosForm, [nombre]: valor });
  }

  async function capturarFile() {
    setAlerta("");

    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (!resultado.canceled) {
        const fotoComprimida = await comprimirFoto(resultado.assets[0]);

        setFotoComprimida(fotoComprimida);
        setDimensionesFoto({
          width: fotoComprimida.width,
          height: fotoComprimida.height,
        });
        scrollTop();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function comprimirFoto(foto) {
    try {
      const resultado = await manipulateAsync(foto.uri, [], {
        compress: 0.5,
        format: SaveFormat.WEBP,
      });

      return resultado;
    } catch (error) {
      console.log(error);
    }
  }

  async function subirPublicacion() {
    setEstadoBoton(true);

    try {
      const nombreFoto = generarNombreFoto();

      const formData = new FormData();

      formData.append("titulo", datosForm.titulo);
      formData.append("descripcion", datosForm.descripcion);
      formData.append("categoria", seleccionarCategoria);
      formData.append("file", {
        uri: fotoComprimida.uri,
        name: `${nombreFoto}.webp`,
        type: "image/webp",
      });

      const respuesta = await axios.post(
        `${URL_API}/api/v1/publicaciones`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${usuarioAuth.token}`,
          },
          withCredentials: true,
        }
      );

      if (respuesta.status === 201) {
        await getPublicaciones();

        router.dismissAll();
        router.replace("/");
      }
    } catch (error) {
      console.log(error.response.data);
      setAlerta(error.response.data.mensaje);
    } finally {
      setEstadoBoton(false);
      scrollBottom();
    }
  }

  function scrollTop() {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      contentContainerStyle={{
        width: "100%",
        minHeight: "100%",
        paddingBottom: 15,
      }}
    >
      <View style={estilo.contenedor}>
        <View style={estilo.formulario}>
          <View style={estilo.input_flex}>
            <Pressable
              style={
                dimensionesFoto.width > 0
                  ? [
                      estilo.foto,
                      {
                        aspectRatio:
                          dimensionesFoto.width / dimensionesFoto.height,
                      },
                    ]
                  : estilo.foto
              }
              onPress={capturarFile}
            >
              <Image
                style={estilo.img}
                source={
                  fotoComprimida
                    ? {
                        uri: fotoComprimida.uri,
                      }
                    : require("../../assets/img/no-img.png")
                }
              />

              {!fotoComprimida && (
                <View style={estilo.foto_icono}>
                  <MaterialCommunityIcons
                    name="image-plus"
                    size={64}
                    color={colorTema.color_4}
                  />
                </View>
              )}
            </Pressable>
          </View>

          <View style={estilo.input_flex}>
            <Text style={estilo.input_titulo}>Titulo</Text>
            <TextInput
              style={estilo.input}
              placeholderTextColor={colorTema.color_4}
              placeholder="Ej: Mi paseo favorito"
              keyboardType="default"
              name="titulo"
              value={datosForm.titulo}
              onChangeText={(value) => capturarInput(value, "titulo")}
              onFocus={() => setAlerta("")}
            />
          </View>

          <View style={estilo.input_flex}>
            <Text style={estilo.input_titulo}>Categoria</Text>
            <View style={estilo.select}>
              <Picker
                selectedValue={seleccionarCategoria}
                onValueChange={(itemValue, itemIndex) =>
                  setSeleccionarCategoria(itemValue)
                }
              >
                <Picker.Item
                  style={estilo.option}
                  fontFamily="Fuente-400"
                  color={colorTema.color_4}
                  label="Seleccionar Categoria"
                  value="Otros"
                />

                {listaCategorias
                  .sort((a, b) => a.localeCompare(b))
                  .map((e, i) => (
                    <Picker.Item
                      key={i}
                      style={{
                        fontSize: 14,
                      }}
                      fontFamily="Fuente-400"
                      color={colorTema.color_7}
                      label={e}
                      value={e}
                    />
                  ))}
              </Picker>
            </View>
          </View>

          <View style={estilo.input_flex}>
            <Text style={estilo.input_titulo}>Descripción</Text>
            <TextInput
              style={estilo.text_area}
              placeholderTextColor={colorTema.color_4}
              placeholder="Ej: Me gusta viajar y disfrutar de la vida..."
              keyboardType="default"
              name="descripcion"
              multiline={true}
              numberOfLines={10}
              textAlignVertical="top"
              value={datosForm.descripcion}
              onChangeText={(value) => capturarInput(value, "descripcion")}
              onFocus={() => setAlerta("")}
            />
          </View>

          <View style={estilo.boton_subir}>
            {alerta && <Text style={estilo.texto_alerta}>{alerta}</Text>}

            {fotoComprimida ? (
              <Pressable
                style={estilo.boton}
                onPress={subirPublicacion}
                disabled={estadoBoton}
              >
                {estadoBoton ? (
                  <ActivityIndicator size="small" color={colors.blanco} />
                ) : (
                  <Text style={estilo.boton_texto}>Publicar</Text>
                )}
              </Pressable>
            ) : (
              <Pressable
                style={estilo.boton}
                onPress={() => alert("Necesitas subir una foto")}
              >
                <Text style={estilo.boton_texto}>Publicar</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const estilo = StyleSheet.create({
  contenedor: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // formulario
  formulario: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 15,
  },
  input_flex: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 10,
  },
  input_titulo: {
    fontSize: 12,
    fontFamily: "Fuente-600",
    color: colorTema.color_9,
  },
  input: {
    borderWidth: 1,
    borderColor: colorTema.color_3,
    backgroundColor: colorTema.color_0,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "Fuente-400",
    color: colorTema.color_7,
  },
  text_area: {
    borderWidth: 1,
    borderColor: colorTema.color_3,
    backgroundColor: colorTema.color_0,
    height: 200,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "Fuente-400",
    color: colorTema.color_7,
  },
  select: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colorTema.color_3,
    backgroundColor: colorTema.color_0,
  },
  option: {
    fontSize: 14,
  },
  // foto
  foto: {
    position: "relative",

    width: "100%",
    aspectRatio: 4 / 4,
    borderRadius: 10,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  foto_icono: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    borderWidth: 1,
    borderColor: colorTema.color_3,

    alignItems: "center",
    justifyContent: "center",
  },
  // boton
  boton_subir: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 6,
  },
  boton: {
    backgroundColor: colorTema.color_9,
    height: 46,
    borderRadius: 8,

    alignItems: "center",
    justifyContent: "center",
  },
  boton_texto: {
    fontSize: 14,
    fontFamily: "Fuente-500",
    color: colorTema.color_0,
  },
  texto_alerta: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Fuente-400",
    color: colors.color_rojo,
  },
});

export default Publicar;
