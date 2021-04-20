import * as Permissions from "expo-permissions";
import { StyleSheet, TextInput, Button, Alert } from "react-native";
import { CameraRoll } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, Image, BackHandler } from "react-native";
import { Camera } from "expo-camera";
import { Audio, Video } from "expo-av";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import moment from "moment";
import AsyncStorage from "@react-native-community/async-storage";
import VideoPlayer from "expo-video-player";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
import { Dimensions } from "react-native";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from "react-native-responsive-dimensions";
import * as Print from "expo-print";
import { useHeaderHeight } from "@react-navigation/stack";
import * as Linking from "expo-linking";
import { useKeepAwake } from "expo-keep-awake";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";

import { agreement } from "../agreement.js";

var timerId;

var globRecording;

export default function CameraScreen(props) {
  useEffect(() => {
    const backAction = () => {
      if (globRecording) {
        Alert.alert("Информация", "В данный момент вернуться нельзя", [
          {
            text: "Закрыть",
            onPress: () => null,
            style: "cancel",
          },
        ]);
        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const [cameraRef, setCameraRef] = useState(null);
  const [recording, setRecording] = useState(false);
  const [counter, setCounter] = useState({
    eventDate: moment.duration().add({ minutes: 0, seconds: 30 }),
    mins: 0,
    secs: 30,
  });
  const [video, setVideo] = useState(null);
  const navigation = useNavigation();
  let { eventDate, mins, secs } = counter;
  const zeroPad = (num, places) => String(num).padStart(places, "0");

  if (props.route.params) {
    if (props.route.params.video) {
      setVideo(props.route.params.video);
    }
  }

  const goToViewVideo = async () => {
    navigation.navigate("Просмотр видео", { video: video });
  };

  function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const saveFile = async () => {
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
    const html = agreement
      .replace(/{signDate}/g, date.getDate())
      .replace(/{signMonth}/g, months[date.getMonth()])
      .replace(/{signYear}/g, date.getFullYear())
      .replace(/{name}/g, name)
      .replace(/{birth}/g, birth)
      .replace(/{adress}/g, adress)
      .replace(/{city}/g, city)
      .replace(/{farmacyAdress}/g, farmacyAdress)
      .replace(/{sign}/g, `<img src=${sign} width="15%" alt="подпись">`);

    try {
      let { uri } = await Print.printToFileAsync({ html });
      let pdfInfo = FileSystem.getInfoAsync(uri, {md5: true});
      let assetPdf = await MediaLibrary.createAssetAsync(uri);
      let fileName = assetPdf.filename;
      let hashPdf = pdfInfo._55.md5;
      //let album = await MediaLibrary.createAlbumAsync(`VideoApp`, assetPdf.id);
      //await MediaLibrary.addAssetsToAlbumAsync([assetPdf.id], album, false); {
       // encoding: FileSystem.EncodingType.Base64,
      //}

      let csvJnjLine = `${name};${city},${farmacyAdress};${videoFile};${fileName};${hashPdf}`;
      let csvAdwLine = `${city},${farmacyAdress};${videoFile}`;

      let farmacyAdressBigSpaces = farmacyAdress.replace(/[;:'",./]/g, " ");
      let farmacyAdressReplaced = farmacyAdressBigSpaces.replace(/\s+/g, " ");
      let dateValue = `${date.getFullYear()}_${zeroPad(
        date.getMonth() + 1,
        2
      )}_${zeroPad(date.getDate(), 2)} ${zeroPad(date.getHours(), 2)}_${zeroPad(
        date.getMinutes(),
        2
      )}_${zeroPad(date.getSeconds(), 2)}`;
      let random = zeroPad(getRandomInRange(0, 9999), 4);
      let fileJnjUri =
        FileSystem.documentDirectory +
        `JNJ ${city} ${farmacyAdressReplaced} ${dateValue} ${random}.csv`;
      let fileAdwUri =
        FileSystem.documentDirectory +
        `ADW ${city} ${farmacyAdressReplaced} ${dateValue} ${random}.csv`;

      //let { exists, isDirectory } = await FileSystem.getInfoAsync(fileUri);
      //if (!exists) {
      await FileSystem.writeAsStringAsync(
        fileJnjUri,
        `\ufeff ФИО:;Аптека:; Видео:; Файл PDF:; Хэш-код файла PDF\n${csvJnjLine}`,
        {
          encoding: FileSystem.EncodingType.UTF8,
        }
      );
      await FileSystem.writeAsStringAsync(
        fileAdwUri,
        `\ufeff Адрес:; Видео:;\n${csvAdwLine}`,
        {
          encoding: FileSystem.EncodingType.UTF8,
        }
      );
      /*
      } else {
        let csvContent = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        await FileSystem.deleteAsync(fileUri);
        await FileSystem.writeAsStringAsync(
          fileUri,
          `${csvContent}\n${csvLine}`,
          {
            encoding: FileSystem.EncodingType.UTF8,
          }
        );
      }
      */
      let assetJnjCsv = await MediaLibrary.createAssetAsync(fileJnjUri);
      let assetAdwCsv = await MediaLibrary.createAssetAsync(fileAdwUri);

      let keys = [
        "name",
        "city",
        "farmacyAdress",
        "video",
        "sign",
        "birthDate",
        "adress",
      ];
      await AsyncStorage.multiRemove(keys);
      navigation.navigate("Завершение");
    } catch (e) {
      console.log(e);
    }
  };

  const takeAndSaveVideo = async () => {
    if (!recording) {
      setRecording(true);
      globRecording = true;
      timerId = setInterval(() => {
        if (secs < 1) {
          clearInterval(timerId);
          setRecording(false);
          globRecording = false;
          cameraRef.stopRecording();
          setCounter({
            eventDate: moment.duration().add({ minutes: 0, seconds: 30 }),
            mins: 0,
            secs: 30,
          });
        } else {
          eventDate = eventDate.subtract(1, "s");
          mins = eventDate.minutes();
          secs = eventDate.seconds();
          setCounter({
            mins,
            secs,
            eventDate,
          });
        }
      }, 1000);

      activateKeepAwake();

      try {
        const video = await cameraRef.recordAsync({
          quality: Camera.Constants.VideoQuality["1080p"],
        });
        const asset = await MediaLibrary.createAssetAsync(video.uri);
        setTimeout(() => {
          setVideo(video.uri);
          AsyncStorage.setItem("video", asset.filename);
        }, 500);
      } catch (e) {
        console.log(e);
      }

      deactivateKeepAwake();
    } else {
      cameraRef.stopRecording();
      clearInterval(timerId);
      setRecording(false);
      globRecording = false;
      setCounter({
        eventDate: moment.duration().add({ minutes: 0, seconds: 30 }),
        mins: 0,
        secs: 30,
      });
    }
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
  let recordButtonArrowSize = responsiveScreenFontSize(2.5 * scale);

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
      <Camera
        style={{
          position: "absolute",
          width: containerWidth,
          height: containerHeight,
          borderColor: "grey",
          borderWidth: 1,
        }}
        ratio="16:9"
        ref={(ref) => {
          setCameraRef(ref);
        }}
      >
        <Image
          style={{
            width: "100%",
            height: "100%",
          }}
          source={require("../images/siluet-transparent-new1.png")}
        />
      </Camera>

      <TouchableOpacity
        style={{
          position: "absolute",
          opacity: recording || !video ? 0.5 : 1,
          alignItems: "center",
          marginRight: recordMargin,
          left: recordMargin,
          top: recordMargin,
          alignSelf: "center",
        }}
        disabled={recording || !video}
        onPress={goToViewVideo}
      >
        <Text
          style={{
            fontSize: buttonReadyFontSize,
            fontWeight: "bold",
            color: "white",
            paddingBottom: counterFontSize * 0.03,
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          Воспроизвести
        </Text>
        <Ionicons name="md-play-circle" size={playIconSize} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          position: "absolute",
          right: recordMargin,
          top: recordMargin,
          opacity: recording || !video ? 0.5 : 1,
        }}
        disabled={recording || !video}
        onPress={saveFile}
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

      <TouchableOpacity
        style={{
          position: "absolute",
          right: recordMargin,
          bottom: recordMargin,
          alignSelf: "center",
        }}
        onPress={takeAndSaveVideo}
      >
        <Text
          style={{
            fontSize: buttonReadyFontSize,
            fontWeight: "bold",
            color: "white",
            paddingBottom: counterFontSize * 0.1,
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          {recording ? "Стоп" : "Для записи нажми"}
        </Text>
        <FontAwesome
          name="arrow-down"
          size={recordButtonArrowSize}
          color="white"
          style={{ alignSelf: "center" }}
        />
        <View
          style={{
            borderWidth: 2,
            borderRadius: recording
              ? recordButtonOutlineSize * 0.2
              : recordButtonOutlineSize,
            borderColor: "white",
            width: recordButtonOutlineSize,
            height: recordButtonOutlineSize,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <View
            style={{
              borderWidth: 2,
              borderRadius: recording
                ? recordButtonSize * 0.2
                : recordButtonSize,
              borderColor: "white",
              height: recordButtonSize,
              width: recordButtonSize,
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: counterFontSize,
                fontWeight: "bold",
                color: "red",
                paddingBottom: counterFontSize * 0.15,
                textTransform: "uppercase",
              }}
            >{`${counter.mins} : ${counter.secs}`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
