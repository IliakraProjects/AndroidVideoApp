import React, { useState } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import { Audio, Video } from "expo-av";
import VideoPlayer from "expo-video-player";
import { Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from "react-native-responsive-dimensions";
import { useHeaderHeight } from "@react-navigation/stack";

export default function Videoplay(props) {
  const navigation = useNavigation();

  video =
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  if (props.route.params) {
    if (props.route.params.video) {
      video = props.route.params.video;
    }
  }

  const goBack = async () => {
    navigation.navigate("Запись видео", props);
  };

  const headerHeight = useHeaderHeight();

  let imageScale = Math.min(
    responsiveScreenWidth(95) / 1280,
    (responsiveScreenHeight(95) - headerHeight) / 720
  );

  let containerWidth = 1280 * imageScale;
  let containerHeight = 720 * imageScale;

  let scale = 0.8;

  let recordMargin = responsiveScreenFontSize(1 * scale);

  let buttonReadyFontSize = responsiveScreenFontSize(1.5 * scale);
  let buttonReadyPadding = responsiveScreenFontSize(1 * scale);

  let counterFontSize = responsiveScreenFontSize(2.7 * scale);

  let recordButtonOutlineSize = responsiveScreenFontSize(12.5 * scale);
  let recordButtonSize = responsiveScreenFontSize(10.5 * scale);

  let playIconSize = responsiveScreenFontSize(10 * scale);

  return (
    <View
      style={{
        position: "relative",
        width: containerWidth,
        height: containerHeight,
        left: "50%",
        top: "50%",
        transform: [
          { translateX: -(containerWidth / 2) },
          { translateY: -(containerHeight / 2) },
        ],
      }}
    >
      <VideoPlayer
        style={{
          position: "absolute",
          borderColor: "grey",
          borderWidth: 1,
        }}
        videoProps={{
          shouldPlay: true,
          resizeMode: Video.RESIZE_MODE_CONTAIN,
          source: {
            uri: video,
          },
        }}
        showFullscreenButton={false}
        width={containerWidth}
        height={containerHeight}
      />

      <TouchableOpacity
        style={{
          position: "absolute",
          right: recordMargin,
          top: recordMargin,
        }}
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
          Назад
        </Text>
      </TouchableOpacity>
    </View>
  );
}
