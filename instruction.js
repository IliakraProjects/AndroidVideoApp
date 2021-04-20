import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from "react-native-responsive-dimensions";

export default function InstructionScreen() {
  const navigation = useNavigation();

  let textContainerWidth = responsiveScreenWidth(78);
  let scale = 0.8;
  let signButtonWidth = responsiveScreenWidth(20);
  let blockMargin = Math.round(responsiveScreenFontSize(0.8 * scale));
  let readyButtonWidth = responsiveScreenWidth(25);
  let buttonFontSize = responsiveScreenFontSize(1.5 * scale);
  let buttonPadding = responsiveScreenFontSize(1 * scale);

  const finishButtonHandler = () => {
    navigation.navigate("Ввод данных", { clear: true });
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: textContainerWidth,
        }}
      >
        <Text
          style={{
            textAlign: "center",
          }}
        >
          Спасибо за участие!
        </Text>
        <Text
          style={{
            textAlign: "center",
          }}
        >
          Ознакомьтесь с подробными инструкциями по отправке полученных файлов и
          отправьте нам записанные материалы
        </Text>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "5%",
        }}
      >
        <View
          style={{
            width: readyButtonWidth,
            margin: blockMargin,
          }}
        >
          <TouchableOpacity onPress={finishButtonHandler}>
            <Text
              style={{
                fontSize: buttonFontSize,
                fontWeight: "bold",
                color: "white",
                backgroundColor: "red",
                textAlign: "center",
                textTransform: "uppercase",
                padding: buttonPadding,
              }}
            >
              Закончить
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
