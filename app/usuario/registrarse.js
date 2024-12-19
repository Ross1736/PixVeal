import { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { colors, colorTema } from "../../src/utils/colors";
import AuthContext from "../../src/context/AuthContext";
import axios from "axios";
import { validarContraseña } from "../../src/utils/funciones";
import Ionicons from "@expo/vector-icons/Ionicons";

const URL_API = process.env.EXPO_PUBLIC_API_URL;

function Registrarse() {
  const { usuarioAuth, agregarUsuario, getDatosUsuario } =
    useContext(AuthContext);

  useEffect(() => {
    if (usuarioAuth) {
      router.replace("/usuario/usuario");
    }
  }, []);

  // APP
  const [datosForm, setDatosForm] = useState({
    correo: "",
    contraseña: "",
    confirmar_contraseña: "",
  });
  const [validarForm, setValidarForm] = useState({
    correo: false,
    contraseña: false,
    confirmar_contraseña: false,
  });
  const [estadoValidar, setEstadoValidar] = useState(false);
  const [estadoBoton, setEstadoBoton] = useState(false);
  const [feedInput, setFeedInput] = useState("");
  const [alerta, setAlerta] = useState("");
  const [estadoInputContraseña, setEstadoInputContraseña] = useState(false);
  const [estadoInputConfirmarContraseña, setEstadoInputConfirmarContraseña] =
    useState(false);

  function capturarInput(valor, nombre) {
    let isValid = true;

    if (nombre === "correo") {
      const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      isValid = correoRegex.test(valor);
    } else if (nombre === "contraseña") {
      const errores = validarContraseña(valor);

      setFeedInput(valor.length > 0 ? errores.join(", ") : "");
    } else if (nombre === "confirmar_contraseña") {
      isValid = valor === datosForm.contraseña;
    }

    setDatosForm({ ...datosForm, [nombre]: valor });
    setValidarForm({ ...validarForm, [nombre]: isValid });
  }

  async function registrar() {
    setEstadoBoton(true);

    try {
      const respuesta = await axios.post(`${URL_API}/api/v1/auth/registrar`, {
        email: datosForm.correo,
        password: datosForm.confirmar_contraseña,
      });

      if (respuesta.status === 201) {
        const respuestaIngreso = await axios.post(
          `${URL_API}/api/v1/auth/ingresar`,
          {
            email: datosForm.correo,
            password: datosForm.confirmar_contraseña,
          }
        );

        if (respuestaIngreso.status === 200) {
          await getDatosUsuario(respuestaIngreso.data.user_id);
          await agregarUsuario(respuestaIngreso.data);
          router.dismissAll();
          router.push("/");
        }
      }
    } catch (error) {
      setAlerta(error.response.data.mensaje);

      if (error.response.status === 400) {
        setDatosForm({
          ...datosForm,
          contraseña: "",
          confirmar_contraseña: "",
        });
      } else {
        setDatosForm({
          correo: "",
          contraseña: "",
          confirmar_contraseña: "",
        });
      }
    } finally {
      setEstadoBoton(false);
    }
  }

  function ir() {
    router.dismiss();
    router.replace("/usuario/ingresar");
  }

  function errorValidarForm() {
    if (validarForm.contraseña !== validarForm.confirmar_contraseña) {
      setAlerta("Las contraseñas no coinciden");
    } else {
      setAlerta("Necesitas completar todos los campos");
    }

    setDatosForm({
      ...datosForm,
      contraseña: "",
      confirmar_contraseña: "",
    });
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
        <View style={estilo.titulos}>
          <Text style={estilo.titulos_principal}>Crea tu cuenta gratis</Text>
          <Text style={estilo.titulos_descricion}>
            Únete ahora y empieza a descubrir, conectar y compartir momentos
            únicos
          </Text>
        </View>

        <View style={estilo.formulario}>
          <View style={estilo.formulario_input}>
            <Text style={estilo.formulario_input_titulo}>
              Ingresa tu correo
            </Text>

            <TextInput
              style={estilo.input}
              placeholderTextColor={colorTema.color_4}
              placeholder="Ej: user1@gmail.com"
              keyboardType="email-address"
              name="correo"
              value={datosForm.correo}
              onChangeText={(value) => capturarInput(value, "correo")}
              onPressIn={() => setAlerta("")}
              onFocus={() => setAlerta("")}
            />
          </View>

          <View style={estilo.formulario_input}>
            <Text style={estilo.formulario_input_titulo}>
              Ingresa tu contraseña
            </Text>

            <View style={estilo.input_contenedor}>
              <TextInput
                style={estilo.input}
                placeholderTextColor={colorTema.color_4}
                placeholder="Ej: Asd@123"
                keyboardType="default"
                name="contraseña"
                secureTextEntry={!estadoInputContraseña}
                value={datosForm.contraseña}
                onChangeText={(value) => capturarInput(value, "contraseña")}
                onFocus={() => setAlerta("")}
              />

              {estadoInputContraseña ? (
                <Ionicons
                  style={estilo.boton_ojo}
                  name="eye-off"
                  size={22}
                  color={colorTema.color_9}
                  onPress={() =>
                    setEstadoInputContraseña(!estadoInputContraseña)
                  }
                />
              ) : (
                <Ionicons
                  style={estilo.boton_ojo}
                  name="eye"
                  size={22}
                  color={colorTema.color_9}
                  onPress={() =>
                    setEstadoInputContraseña(!estadoInputContraseña)
                  }
                />
              )}
            </View>

            {feedInput && (
              <Text style={estilo.texto_alerta_input}>{feedInput}</Text>
            )}
          </View>

          <View style={estilo.formulario_input}>
            <Text style={estilo.formulario_input_titulo}>
              Confirma tu contraseña
            </Text>

            <View style={estilo.input_contenedor}>
              <TextInput
                style={estilo.input}
                placeholderTextColor={colorTema.color_4}
                placeholder="Ej: Asd@123"
                keyboardType="default"
                name="confirmar_contraseña"
                secureTextEntry={!estadoInputConfirmarContraseña}
                value={datosForm.confirmar_contraseña}
                onChangeText={(value) =>
                  capturarInput(value, "confirmar_contraseña")
                }
                onFocus={() => setAlerta("")}
              />
              {estadoInputConfirmarContraseña ? (
                <Ionicons
                  style={estilo.boton_ojo}
                  name="eye-off"
                  size={22}
                  color={colorTema.color_9}
                  onPress={() =>
                    setEstadoInputConfirmarContraseña(
                      !estadoInputConfirmarContraseña
                    )
                  }
                />
              ) : (
                <Ionicons
                  style={estilo.boton_ojo}
                  name="eye"
                  size={22}
                  color={colorTema.color_9}
                  onPress={() =>
                    setEstadoInputConfirmarContraseña(
                      !estadoInputConfirmarContraseña
                    )
                  }
                />
              )}
            </View>

            {datosForm.confirmar_contraseña.length > 0 &&
              !validarForm.confirmar_contraseña && (
                <Text style={estilo.texto_alerta_input}>
                  Contraseña no coincide
                </Text>
              )}
          </View>
        </View>

        <View style={estilo.botones}>
          {alerta && <Text style={estilo.texto_alerta}>{alerta}</Text>}

          {validarForm.correo &&
          validarForm.contraseña &&
          validarForm.confirmar_contraseña ? (
            <Pressable
              style={estilo.boton_ingresar}
              onPress={() => registrar()}
              disabled={estadoBoton}
            >
              {estadoBoton ? (
                <ActivityIndicator color={colors.blanco} size="small" />
              ) : (
                <Text style={estilo.boton_ingresar_texto}>Registrarse</Text>
              )}
            </Pressable>
          ) : (
            <Pressable style={estilo.boton_ingresar} onPress={errorValidarForm}>
              <Text style={estilo.boton_ingresar_texto}>Registrarse</Text>
            </Pressable>
          )}
        </View>

        <Text style={estilo.texto_navegar}>
          ¿Ya tienes una cuenta?{" "}
          <Text style={estilo.texto_navegar_boton} onPress={ir}>
            Inicia sesión
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const estilo = StyleSheet.create({
  contenedor: {
    flex: 1,

    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 20,

    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 20,
  },
  // titulos
  titulos: {
    marginBottom: 20,

    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 10,
  },
  titulos_principal: {
    fontSize: 26,
    fontFamily: "Fuente-700",
    color: colorTema.color_9,
  },
  titulos_descricion: {
    fontSize: 14,
    fontFamily: "Fuente-400",
    color: colorTema.color_7,
  },
  // formulario
  formulario: {
    width: "100%",

    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 15,
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
  input_contenedor: {
    position: "relative",

    borderWidth: 1,
    borderColor: "transparent",
  },
  input: {
    borderWidth: 1,
    borderColor: colorTema.color_3,
    backgroundColor: colorTema.color_0,
    paddingLeft: 14,
    paddingRight: 36,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "Fuente-400",
    color: colorTema.color_7,
  },
  boton_ojo: {
    position: "absolute",

    zIndex: 1,
    top: 12,
    right: 6,
  },
  texto_alerta_input: {
    textAlign: "right",
    fontSize: 12,
    fontFamily: "Fuente-400",
    color: colors.color_rojo,
  },
  // botones
  botones: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 6,
  },
  texto_alerta: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Fuente-400",
    color: colors.color_rojo,
  },
  boton_ingresar: {
    backgroundColor: colorTema.color_9,
    height: 46,
    borderRadius: 8,

    alignItems: "center",
    justifyContent: "center",
  },
  boton_ingresar_texto: {
    fontSize: 14,
    fontFamily: "Fuente-500",
    color: colorTema.color_0,
  },
  // navegar
  texto_navegar: {
    textAlign: "center",
    fontFamily: "Fuente-400",
    color: colorTema.color_7,
  },
  texto_navegar_boton: {
    textAlign: "center",
    fontFamily: "Fuente-600",
    color: colors.color_primario,
  },
});

export default Registrarse;
