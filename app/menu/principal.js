import { useContext, useEffect } from "react";
import {
  Button,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AuthContext from "../../src/context/AuthContext";
import { router } from "expo-router";
import { colors, colorTema } from "../../src/utils/colors";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "../../src/imports/importsIconos";

const LISTA_OPCIONES_CUENTA = [
  {
    icono: (
      <FontAwesome5
        name="user-alt"
        size={18}
        style={{ width: 24 }}
        color={colorTema.color_7}
      />
    ),
    texto: "Mi perfil",
    path: "/usuario/usuario",
  },
  {
    icono: (
      <FontAwesome5
        name="images"
        size={18}
        style={{ width: 24 }}
        color={colorTema.color_7}
      />
    ),
    texto: "Publicaciones",
    path: "/usuario/publicaciones",
  },
  {
    icono: (
      <MaterialCommunityIcons
        name="comment-processing-outline"
        size={18}
        color={colorTema.color_9}
        style={{ width: 24 }}
      />
    ),
    texto: "Comentarios",
    path: "/usuario/comentarios",
  },
  {
    icono: (
      <FontAwesome5
        name="user-check"
        size={18}
        style={{ width: 24 }}
        color={colorTema.color_7}
      />
    ),
    texto: "Seguidores",
    path: "/usuario/seguidores",
  },
  {
    icono: (
      <FontAwesome5
        name="users"
        size={18}
        style={{ width: 24 }}
        color={colorTema.color_7}
      />
    ),
    texto: "Seguidos",
    path: "/usuario/seguidos",
  },
  {
    icono: (
      <FontAwesome5
        name="cog"
        size={18}
        style={{ width: 24 }}
        color={colorTema.color_7}
      />
    ),
    texto: "Configuracion",
    path: "/usuario/usuario",
  },
];

function Principal() {
  const { usuarioAuth, cerrarSesion } = useContext(AuthContext);

  useEffect(() => {
    if (!usuarioAuth) {
      router.back();
    }
  }, []);

  function salir() {
    cerrarSesion();
    router.dismissAll();
    router.replace("/");
  }

  if (usuarioAuth) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        contentContainerStyle={{
          width: "100%",
          paddingBottom: 15,
        }}
      >
        <View style={estilo.contenedor}>
          <Text style={estilo.texto_seccion}>Cuenta</Text>

          <View style={estilo.opciones}>
            {LISTA_OPCIONES_CUENTA.map((e, i) => (
              <Pressable
                key={i}
                style={estilo.opciones_opcion}
                onPress={() => router.push(e.path)}
              >
                <View style={estilo.opciones_opcion_nombre}>
                  {e.icono}
                  <Text style={estilo.opciones_opcion_nombre_texto}>
                    {e.texto}
                  </Text>
                </View>

                <FontAwesome5
                  name="chevron-right"
                  size={16}
                  style={{ width: 16 }}
                  color={colorTema.color_7}
                />
              </Pressable>
            ))}
          </View>

          <Text style={estilo.texto_seccion}>Ayuda e información</Text>

          <View style={estilo.opciones}>
            <Pressable
              style={estilo.opciones_opcion}
              onPress={() => router.push("/informacion/politicas")}
            >
              <View style={estilo.opciones_opcion_nombre}>
                <MaterialIcons
                  name="text-snippet"
                  size={24}
                  color={colorTema.color_7}
                />
                <Text style={estilo.opciones_opcion_nombre_texto}>
                  Politicas de privacidad
                </Text>
              </View>

              <FontAwesome5
                name="chevron-right"
                size={16}
                style={{ width: 16 }}
                color={colorTema.color_7}
              />
            </Pressable>
          </View>

          <Text style={estilo.texto_seccion}>Opciones</Text>

          <View style={estilo.opciones}>
            <Pressable style={estilo.opciones_opcion} onPress={salir}>
              <View style={estilo.opciones_opcion_nombre}>
                <Ionicons name="exit" size={24} color={colorTema.color_7} />

                <Text style={estilo.opciones_opcion_nombre_texto}>
                  Cerrar sesión
                </Text>
              </View>

              <FontAwesome5
                name="chevron-right"
                size={16}
                style={{ width: 16 }}
                color={colorTema.color_7}
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const estilo = StyleSheet.create({
  contenedor: {
    flex: 1,

    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 15,
  },
  texto_seccion: {
    marginTop: 20,

    fontSize: 14,
    fontFamily: "Fuente-600",
    color: colorTema.color_5,
  },
  // opciones
  opciones: {
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 30,
  },
  opciones_opcion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  opciones_opcion_nombre: {
    flexGrow: 1,
    flexShrink: 1,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  opciones_opcion_nombre_texto: {
    fontSize: 14,
    fontFamily: "Fuente-400",
    color: colorTema.color_9,
  },
});

export default Principal;
