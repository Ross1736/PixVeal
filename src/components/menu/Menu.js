import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, usePathname } from "expo-router";
import { colorTema, colors } from "../../utils/colors";
import { AntDesign, FontAwesome6 } from "../../imports/importsIconos";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";

function Menu() {
  const { usuarioAuth, cargandoUsuario } = useContext(AuthContext);

  const pathname = usePathname();

  function irPublicar() {
    if (!usuarioAuth) {
      router.push("/usuario/ingresar");
      return;
    }

    router.push("/publicaciones/publicar");
  }

  if (pathname === "/usuario/ingresar" || pathname === "/usuario/registrarse") {
    return null;
  }

  return (
    <View style={estilo.contenedor}>
      <Pressable
        onPress={() => {
          router.dismissAll();
          router.push("/");
        }}
      >
        <Text style={estilo.titulo_menu}>
          Pix<Text style={estilo.titulo_menu_color}>Veal</Text>
        </Text>
      </Pressable>

      {!cargandoUsuario &&
        (usuarioAuth ? (
          <View style={estilo.botones_usuario}>
            <AntDesign
              name="pluscircle"
              size={24}
              color={colorTema.color_9}
              onPress={irPublicar}
            />

            <FontAwesome6
              name="bars-staggered"
              size={24}
              color={colorTema.color_9}
              onPress={() => router.push("/menu/principal")}
            />
          </View>
        ) : (
          <FontAwesome6
            name="bars-staggered"
            size={24}
            color={colorTema.color_9}
            onPress={() => router.push("/usuario/ingresar")}
          />
        ))}
    </View>
  );
}

const estilo = StyleSheet.create({
  contenedor: {
    width: "100%",
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: colors.blanco,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  titulo_menu: {
    fontFamily: "Fuente-800",
    fontSize: 20,
    color: colors.color_primario,
  },
  titulo_menu_color: {
    color: colorTema.color_9,
  },
  // botones
  botones_usuario: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 15,
  },
});

export default Menu;
