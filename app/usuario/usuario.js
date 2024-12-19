import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AuthContext from "../../src/context/AuthContext";
import { colors, colorTema } from "../../src/utils/colors";
import FastImage from "react-native-fast-image";
import { Feather } from "../../src/imports/importsIconos";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import FetchContext from "../../src/context/FetchContext";

const URL_API = process.env.EXPO_PUBLIC_API_URL;
const URL_ENDPOINT = process.env.EXPO_PUBLIC_ENDPOINT;

const DATOS_INPUTS = [
  {
    label: "Correo electrónico",
    name: "email",
    placeholder: "Ingresa tu correo",
    keyboardType: "email-address",
  },
  {
    label: "Nombre de usuario",
    name: "nombre_usuario",
    placeholder: "Ingresa tu nombre de usuario",
    keyboardType: "default",
  },
  {
    label: "Edad",
    name: "edad",
    placeholder: "Ingresa tu edad",
    keyboardType: "phone-pad",
  },
  {
    label: "Teléfono",
    name: "telefono",
    placeholder: "Ingresa tu teléfono",
    keyboardType: "phone-pad",
  },
  {
    label: "País",
    name: "pais",
    placeholder: "Ingresa tu país",
    keyboardType: "default",
  },
];

function Usuario() {
  const { usuarioAuth, datosUsuarioLocal, setDatosUsuarioLocal } =
    useContext(AuthContext);
  const { eliminarUsuariosLocal } = useContext(FetchContext);

  const [datosForm, setDatosForm] = useState({
    email: datosUsuarioLocal?.email ?? "",
    nombre_usuario: datosUsuarioLocal.nombre_usuario ?? "",
    foto_perfil: datosUsuarioLocal.foto_perfil ?? "",
    edad: datosUsuarioLocal.edad ?? "",
    telefono: datosUsuarioLocal.telefono ?? "",
    pais: datosUsuarioLocal.pais ?? "",
    redes_sociales: datosUsuarioLocal.redes_sociales ?? [],
  });
  const [estadoBoton, setEstadoBoton] = useState(false);
  const [fotoComprimida, setFotoComprimida] = useState(null);
  const [actualizandoFoto, setActualizandoFoto] = useState(false);
  const [alerta, setAlerta] = useState("");
  const [alerta2, setAlerta2] = useState("");

  function capturarInput(valor, nombre) {
    if (nombre === "edad") {
      valor = valor.replace(/\D/g, "");
      valor = valor.slice(0, 3);
      valor = valor ? parseInt(valor, 10) : "";
    } else if (nombre === "telefono") {
      valor = valor.replace(/\D/g, "");
      valor = valor.slice(0, 15);
    }

    setDatosForm((prevState) => ({
      ...prevState,
      [nombre]: valor,
    }));
  }

  async function actualizarDatosUsuario() {
    setEstadoBoton(true);

    try {
      const respuesta = await axios.patch(
        `${URL_API}/api/v1/usuarios/usuario`,
        {
          nombre_usuario: datosForm.nombre_usuario,
          edad: datosForm.edad,
          telefono: datosForm.telefono,
          pais: datosForm.pais,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${usuarioAuth.token}`,
          },
          withCredentials: true,
        }
      );

      await eliminarUsuariosLocal();

      if (respuesta.data) {
        const datosActualizados = {
          ...datosUsuarioLocal,
          nombre_usuario: respuesta.data.nombre_usuario,
          edad: respuesta.data.edad,
          telefono: respuesta.data.telefono,
          pais: respuesta.data.pais,
        };

        setDatosUsuarioLocal(datosActualizados);
      }

      setAlerta2("Datos actualizados");
    } catch (error) {
      console.error(error.response.data);

      setAlerta(error.response.data.mensaje);
    } finally {
      setEstadoBoton(false);
      setTimeout(() => {
        setAlerta("");
        setAlerta2("");
      }, 5000);
    }
  }

  async function capturarFoto() {
    setAlerta("");

    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!resultado.canceled) {
        await comprimirFoto(resultado.assets[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (fotoComprimida) {
      const actualizarFotoPerfil = async () => {
        setActualizandoFoto(true);

        try {
          const formData = new FormData();

          formData.append("file", {
            uri: fotoComprimida.uri,
            name: `${datosUsuarioLocal.nombre_usuario}.webp` || "foto.webp",
            type: "image/webp",
          });
          formData.append(
            "foto_perfil",
            datosUsuarioLocal.foto_perfil ? datosUsuarioLocal.foto_perfil : ""
          );

          const respuesta = await axios.patch(
            `${URL_API}/api/v1/usuarios/usuario/foto-perfil`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${usuarioAuth.token}`,
              },
              withCredentials: true,
            }
          );

          await eliminarUsuariosLocal();

          if (respuesta.data) {
            const datosActualizados = {
              ...datosUsuarioLocal,
              foto_perfil: respuesta.data.foto_perfil,
            };

            setDatosUsuarioLocal(datosActualizados);
          }

          setAlerta2("Foto actualizada");
        } catch (error) {
          console.log(error.response.data);
          setAlerta(error.response.data.mensaje);
        } finally {
          setFotoComprimida(null);
          setActualizandoFoto(false);
          setTimeout(() => {
            setAlerta("");
            setAlerta2("");
          }, 5000);
        }
      };

      actualizarFotoPerfil();
    }
  }, [fotoComprimida]);

  async function comprimirFoto(foto) {
    try {
      const resultado = await manipulateAsync(foto.uri, [], {
        compress: 0.5,
        format: SaveFormat.WEBP,
      });
      const file = await FileSystem.getInfoAsync(resultado.uri);

      setFotoComprimida(file);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      contentContainerStyle={{
        width: "100%",
        minHeight: "100%",
        paddingBottom: 15,
      }}
    >
      <View style={estilo.contenedor}>
        <Pressable
          style={estilo.foto}
          onPress={capturarFoto}
          disabled={actualizandoFoto}
        >
          {actualizandoFoto ? (
            <View style={estilo.subiendo_foto}>
              <ActivityIndicator color={colorTema.color_4} size="large" />
            </View>
          ) : (
            <>
              <FastImage
                style={estilo.img}
                source={
                  datosUsuarioLocal.foto_perfil
                    ? {
                        uri: `${URL_ENDPOINT}${datosUsuarioLocal.foto_perfil}`,
                        priority: FastImage.priority.high,
                      }
                    : require("../../assets/img/no-user.png")
                }
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={estilo.boton_refrescar}>
                <Feather name="refresh-ccw" size={20} color={colors.blanco} />
              </View>
            </>
          )}

          {alerta && <Text style={estilo.texto_alerta}>{alerta}</Text>}
          {alerta2 && <Text style={estilo.texto_alerta2}>{alerta2}</Text>}
        </Pressable>

        <View style={estilo.formulario}>
          {DATOS_INPUTS.map((input) => (
            <View style={estilo.formulario_input} key={input.name}>
              <Text style={estilo.formulario_input_titulo}>{input.label}</Text>

              <TextInput
                style={estilo.input}
                placeholderTextColor={colorTema.color_4}
                placeholder={input.placeholder}
                keyboardType={input.keyboardType}
                name={input.name}
                value={datosForm[input.name]?.toString() || ""}
                onChangeText={(value) => capturarInput(value, input.name)}
              />
            </View>
          ))}

          <Pressable
            style={estilo.boton_actualizar}
            onPress={actualizarDatosUsuario}
            disabled={estadoBoton}
          >
            {estadoBoton ? (
              <ActivityIndicator color={colors.blanco} size="small" />
            ) : (
              <Text style={estilo.boton_actualizar_texto}>
                Actualizar Datos
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const estilo = StyleSheet.create({
  contenedor: {
    paddingHorizontal: 20,
    paddingTop: 20,

    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 30,
  },
  // foto
  foto: {
    position: "relative",

    alignSelf: "center",
    justifyContent: "flex-start",
    gap: 10,

    width: "40%",
    maxWidth: 140,
    aspectRatio: 4 / 4,
  },
  img: {
    zIndex: 1,

    width: "100%",
    height: "100%",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: colorTema.color_1,
  },
  subiendo_foto: {
    zIndex: 1,

    width: "100%",
    height: "100%",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: colorTema.color_1,

    alignItems: "center",
    justifyContent: "center",
  },
  boton_refrescar: {
    position: "absolute",
    zIndex: 9,
    bottom: 0,
    right: 0,

    padding: 8,
    borderRadius: "50%",
    backgroundColor: colors.color_primario,
  },
  // alerta
  texto_alerta: {
    fontSize: 12,
    fontFamily: "Fuente-400",
    color: colors.color_rojo,
  },
  texto_alerta2: {
    fontSize: 12,
    fontFamily: "Fuente-400",
    color: colors.color_verde,
  },
  // formulario
  formulario: {
    width: "100%",

    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 20,
  },
  formulario_input: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 6,
  },
  formulario_input_titulo: {
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
  // boton actualizar
  boton_actualizar: {
    backgroundColor: colorTema.color_9,
    height: 46,
    borderRadius: 8,

    alignItems: "center",
    justifyContent: "center",
  },
  boton_actualizar_texto: {
    fontSize: 14,
    fontFamily: "Fuente-500",
    color: colorTema.color_0,
  },
});

export default Usuario;
