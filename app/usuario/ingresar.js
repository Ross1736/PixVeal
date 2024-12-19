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
import { Ionicons } from "@expo/vector-icons";

const URL_API = process.env.EXPO_PUBLIC_API_URL;

function Ingresar() {
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
  });
  const [validarForm, setValidarForm] = useState({
    correo: false,
    contraseña: false,
  });
  const [estadoBoton, setEstadoBoton] = useState(false);
  const [alerta, setAlerta] = useState("");
  const [estadoInputContraseña, setEstadoInputContraseña] = useState(false);

  function capturarInput(valor, nombre) {
    let isValid = true;

    if (nombre === "correo") {
      const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      isValid = correoRegex.test(valor);
    }

    setDatosForm({ ...datosForm, [nombre]: valor });
    setValidarForm({ ...validarForm, [nombre]: isValid });
  }

  async function iniciarSesion() {
    setEstadoBoton(true);

    try {
      const respuesta = await axios.post(`${URL_API}/api/v1/auth/ingresar`, {
        email: datosForm.correo,
        password: datosForm.contraseña,
      });

      if (respuesta.status === 200) {
        await getDatosUsuario(respuesta.data.user_id);
        await agregarUsuario(respuesta.data);
        router.back();
      }
    } catch (error) {
      console.log(error.response.data);
      setAlerta(error.response.data.mensaje);

      if (error.response.status === 401) {
        setDatosForm({
          ...datosForm,
          contraseña: "",
        });
      } else {
        setDatosForm({
          correo: "",
          contraseña: "",
        });
      }
    } finally {
      setEstadoBoton(false);
    }
  }

  function ir() {
    router.push("/usuario/registrarse");
  }

  function errorValidarForm() {
    if (!validarForm.correo && !validarForm.contraseña) {
      setAlerta("Necesitas ingresar tu correo y contraseña");
    } else if (!validarForm.correo) {
      setAlerta("Necesitas ingresar tu correo");
    } else if (!validarForm.contraseña) {
      setAlerta("Necesitas ingresar tu contraseña");
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
        <View style={estilo.titulos}>
          <Text style={estilo.titulos_principal}>Accede a tu cuenta</Text>
          <Text style={estilo.titulos_descricion}>
            Inicia sesión para descubrir y compartir contenido increíble
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
          </View>
        </View>

        <View style={estilo.botones}>
          {alerta && <Text style={estilo.texto_alerta}>{alerta}</Text>}

          {validarForm.correo && validarForm.contraseña ? (
            <Pressable
              style={estilo.boton_ingresar}
              onPress={() => iniciarSesion()}
              disabled={estadoBoton}
            >
              {estadoBoton ? (
                <ActivityIndicator color={colors.blanco} size="small" />
              ) : (
                <Text style={estilo.boton_ingresar_texto}>Ingresar</Text>
              )}
            </Pressable>
          ) : (
            <Pressable style={estilo.boton_ingresar} onPress={errorValidarForm}>
              <Text style={estilo.boton_ingresar_texto}>Ingresar</Text>
            </Pressable>
          )}
        </View>

        <Text style={estilo.texto_navegar}>
          ¿Aún no tienes una cuenta?{" "}
          <Text style={estilo.texto_navegar_boton} onPress={ir}>
            Regístrate
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

export default Ingresar;
