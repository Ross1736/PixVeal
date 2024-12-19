import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../src/utils/colors";
import ContextProviders from "../src/context/Context";
import { Menu } from "../src/imports/importComponents";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

function LayoutApp() {
  const [fuenteCarga, error] = useFonts({
    "Fuente-100": require("../assets/fonts/Inter_18pt-Thin.ttf"),
    "Fuente-200": require("../assets/fonts/Inter_18pt-ExtraLight.ttf"),
    "Fuente-300": require("../assets/fonts/Inter_18pt-Light.ttf"),
    "Fuente-400": require("../assets/fonts/Inter_18pt-Regular.ttf"),
    "Fuente-500": require("../assets/fonts/Inter_18pt-Medium.ttf"),
    "Fuente-600": require("../assets/fonts/Inter_18pt-SemiBold.ttf"),
    "Fuente-700": require("../assets/fonts/Inter_18pt-Bold.ttf"),
    "Fuente-800": require("../assets/fonts/Inter_18pt-ExtraBold.ttf"),
    "Fuente-900": require("../assets/fonts/Inter_18pt-Black.ttf"),
  });

  useEffect(() => {
    if (fuenteCarga || error) {
      SplashScreen.hideAsync();
    }
  }, [fuenteCarga, error]);

  if (!fuenteCarga && !error) {
    return null;
  }

  return (
    <ContextProviders>
      <SafeAreaProvider>
        <Menu />

        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            statusBarStyle: "dark",
            statusBarHidden: false,
            statusBarTranslucent: false,
            statusBarBackgroundColor: colors.blanco,
            navigationBarColor: colors.blanco,
            contentStyle: {
              flex: 1,

              backgroundColor: colors.blanco,
            },
          }}
        >
          <Stack.Screen name="index" redirect={false} />

          {/* publicaciones */}
          <Stack.Screen name="publicaciones/publicar" redirect={false} />
          <Stack.Screen
            name="publicaciones/publicacion"
            redirect={false}
            options={{ statusBarAnimation: "fade" }}
          />

          {/* usuario */}
          <Stack.Screen name="usuario/ingresar" redirect={false} />
          <Stack.Screen name="usuario/registrarse" redirect={false} />
          <Stack.Screen name="usuario/usuario" redirect={false} />
          <Stack.Screen name="usuario/publicaciones" redirect={false} />
          <Stack.Screen name="usuario/comentarios" redirect={false} />
          <Stack.Screen name="usuario/seguidores" redirect={false} />
          <Stack.Screen name="usuario/seguidos" redirect={false} />

          {/* menu */}
          <Stack.Screen name="menu/principal" redirect={false} />

          {/* informacion */}
          <Stack.Screen name="informacion/politicas" redirect={false} />
        </Stack>
      </SafeAreaProvider>
    </ContextProviders>
  );
}

export default LayoutApp;
