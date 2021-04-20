import React, { useState } from "react";

import * as MediaLibrary from "expo-media-library";

import {
  View,
  Image,
  StyleSheet,
  AsyncStorage,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from "react-native-responsive-dimensions";
import { useHeaderHeight } from "@react-navigation/stack";
import * as ExpoPixi from "expo-pixi";
import { GLView } from "expo-gl";
import Constants from "expo-constants";

import { agreement } from "../agreement.js";

export default function Sign(props) {
  const navigation = useNavigation();

  const [signReady, setSignReady] = useState(false);

  let sketch;

  const makeAgreementHtml = async () => {
    let name = await AsyncStorage.getItem("name");
    let birth = await AsyncStorage.getItem("birthDate");
    let city = await AsyncStorage.getItem("city");
    let farmacyAdress = await AsyncStorage.getItem("farmacyAdress");
    let videoFile = await AsyncStorage.getItem("video");
    let sign = await AsyncStorage.getItem("sign");
    let adress = await AsyncStorage.getItem("adress");
    var months = [
      "Января",
      "Февраля",
      "Марта",
      "Апреля",
      "Мая",
      "Июня",
      "Июля",
      "Августа",
      "Сентября",
      "Октября",
      "Ноября",
      "Декабря",
    ];
    let date = new Date();

    let html = agreement
      .replace(/{signDate}/g, date.getDate())
      .replace(/{signMonth}/g, months[date.getMonth()])
      .replace(/{signYear}/g, date.getFullYear())
      .replace(/{name}/g, name)
      .replace(/{birth}/g, birth)
      .replace(/{adress}/g, adress)
      .replace(/{city}/g, city)
      .replace(/{farmacyAdress}/g, farmacyAdress)
      .replace(/{sign}/g, "");

    setAgreementHtml(html);
  };

  const [agreementHtml, setAgreementHtml] = useState("");

  makeAgreementHtml();

  const goBack = async () => {
    let gUri;
    try {
      const { uri, localUri, width, height } = await sketch.takeSnapshotAsync();
      console.log(uri, localUri, width, height);
      gUri = uri;
    } catch (e) {
      return;
    }
    await AsyncStorage.setItem("sign", gUri);
    navigation.navigate("Ввод данных"); // props;
  };

  const onChangeAsync = async () => {
    setSignReady(true);
  };

  const onReady = () => {};

  const headerHeight = useHeaderHeight();
  let imageScale = Math.min(
    responsiveScreenWidth(95) / 1280,
    (responsiveScreenHeight(95) - headerHeight) / 720
  );
  let containerWidth = 1280 * imageScale;
  let containerHeight = 720 * imageScale;
  let scale = 0.8;
  let buttonReadyFontSize = responsiveScreenFontSize(1.5 * scale);
  let buttonReadyPadding = responsiveScreenFontSize(1 * scale);
  let recordButtonOutlineSize = responsiveScreenFontSize(12.5 * scale);
  let recordButtonSize = responsiveScreenFontSize(10.5 * scale);
  let recordMargin = responsiveScreenFontSize(1 * scale);
  let signatureAreaBorderWidth = responsiveScreenFontSize(0.5 * scale);

  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: containerWidth * 0.5,
          top: "3%",
          right: "3%",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: buttonReadyFontSize,
          }}
        >
          Место для подписи
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          top: "10%",
          right: "3%",
          width: containerWidth * 0.5,
          height: containerHeight * 0.8,
          borderWidth: signatureAreaBorderWidth,
          borderColor: "grey",
        }}
      >
        <ExpoPixi.Signature
          style={{
            width: "100%",
            height: "100%",
          }}
          ref={(ref) => (sketch = ref)}
          strokeColor={0}
          strokeWidth={5}
          strokeAlpha={1}
          onChange={onChangeAsync}
          onReady={onReady}
        />
      </View>
      <SafeAreaView
        style={{
          left: "3%",
          top: "3%",
          width: "50%",
          height: "90%",
        }}
      >
        <WebView
          style={{
            width: "100%",
            height: "100%",
          }}
          originWhitelist={["*"]}
          source={{ html: agreementHtml }}
        ></WebView>
      </SafeAreaView>

      <TouchableOpacity
        style={{
          position: "absolute",
          right: recordMargin,
          bottom: recordMargin,
          opacity: signReady ? 1 : 0.5,
        }}
        disabled={!signReady}
        onPress={goBack}
      >
        <Text
          style={{
            alignItems: "center",
            alignSelf: "center",
            fontSize: buttonReadyFontSize,
            fontWeight: "bold",
            color: "white",
            backgroundColor: "red",
            textAlign: "center",
            textTransform: "uppercase",
            padding: buttonReadyPadding,
          }}
        >
          Готово
        </Text>
      </TouchableOpacity>
    </View>
  );
}
