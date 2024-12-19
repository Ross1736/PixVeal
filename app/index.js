import {
  Dimensions,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useContext, useState } from "react";
import FetchContext from "../src/context/FetchContext";
import { Tarjeta } from "../src/imports/importComponents";
import { FlashList } from "@shopify/flash-list";
import { colors, colorTema } from "../src/utils/colors";
import IndexCargando from "../src/components/cargando/IndexCargando";
import TarjetaIndexCargando from "../src/components/cargando/TarjetaIndexCargando";
import Banner from "../src/ads/Banner";

const { width, height } = Dimensions.get("window");

function Index() {
  const {
    publicaciones,
    paginacion,
    //
    actualizando,
    getPublicaciones,
  } = useContext(FetchContext);

  // APP
  const [verMas, setVerMas] = useState(10);
  const [cargaPublicaciones, setCargaPublicaciones] = useState(false);

  async function cambiarPagina() {
    await getPublicaciones(paginacion.page + 1);
    setVerMas(4);
    return;
  }

  if (publicaciones.length == 0) {
    return <IndexCargando />;
  }

  return (
    <View style={estilo.contenedor}>
      <FlashList
        refreshControl={
          <RefreshControl
            colors={[colors.color_primario]}
            refreshing={actualizando}
            onRefresh={async () => {
              await getPublicaciones(1);
              setVerMas(4);
              return;
            }}
          />
        }
        data={publicaciones.slice(0, verMas)}
        numColumns={1}
        renderItem={({ item, index }) => <Tarjeta item={item} index={index} />}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
        estimatedItemSize={width}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={estilo.footer}>
            <Banner />

            {cargaPublicaciones && <TarjetaIndexCargando />}

            {!cargaPublicaciones &&
              paginacion.page < paginacion.total_pages && (
                <Pressable style={estilo.boton_ver_mas} onPress={cambiarPagina}>
                  <Text style={estilo.boton_ver_mas_texto}>Ver Más</Text>
                </Pressable>
              )}
          </View>
        }
        // paginación
        onEndReached={() => {
          if (publicaciones.length >= verMas && !cargaPublicaciones) {
            setCargaPublicaciones(true);

            setTimeout(() => {
              setCargaPublicaciones(false);
              setVerMas((prevVerMas) => prevVerMas + 10);
            }, 4000);
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const estilo = StyleSheet.create({
  contenedor: {
    flex: 1,

    backgroundColor: colors.blanco,

    gap: 0,
  },
  footer: {
    marginTop: 30,

    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 30,
  },
  boton_ver_mas: {
    alignSelf: "center",

    width: 200,
    height: 44,
    marginBottom: 30,
    borderRadius: 6,
    backgroundColor: colorTema.color_9,

    alignItems: "center",
    justifyContent: "center",
  },
  boton_ver_mas_texto: {
    fontSize: 14,
    fontFamily: "Fuente-600",
    color: colors.blanco,
  },
});

export default Index;
