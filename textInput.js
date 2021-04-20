import { StyleSheet, TextInput, Platform, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Picker,
  ScrollView,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import CameraScreen from "./camera.js";
import AsyncStorage from "@react-native-community/async-storage";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import { preventAutoHide } from "expo/build/launch/SplashScreen";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from "react-native-responsive-dimensions";
import { cities, adresses, farmaciesList } from "../adresses.js";

export default function InputText(props) {
  let navigation = props.navigation;

  const [nameValue, onChangeName] = useState("");
  const [birthDateValue, onChangeBirth] = useState("");
  const [regAddress, onChangeRegAddress] = useState("");
  const [city, setCity] = useState("");
  const [farmAddress, setFarmAddress] = useState("");
  const [signStatus, setSignStatus] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  const [date, setDate] = useState(null);
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);

  useEffect(() => {
    (async () => {
      const camera = await Permissions.askAsync(Permissions.CAMERA);
      const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      const files = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      const hasPermission =
        camera.status === "granted" &&
        audio.status === "granted" &&
        files.status === "granted";
      setHasPermission({ hasPermission });
    })();
  }, []);

  const signButtonHandler = async () => {
    if (
      nameValue !== "" &&
      dateSelected &&
      regAddress !== "" &&
      farmAddress !== null
    ) {
      await AsyncStorage.setItem("city", city.city);
      await AsyncStorage.setItem("name", nameValue);
      await AsyncStorage.setItem("farmacyAdress", farmAddress);
      await AsyncStorage.setItem("adress", regAddress);
    }
    setSignStatus(true);
    navigation.navigate("Подпись");
  };

  const buttonHandler = async () => {
    if (
      nameValue !== "" &&
      dateSelected &&
      regAddress !== "" &&
      farmAddress !== null
    ) {
      navigation.navigate("Запись видео");
    }
  };

  const onChange = async (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.Android === "android");
    setDate(currentDate);
    setDateSelected(true);
    let birth = new Date(currentDate);
    let datebirth = `${birth.getDate()}/${
      birth.getMonth() + 1
    }/${birth.getFullYear()}`;
    await AsyncStorage.setItem("birthDate", datebirth);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showCityInput = () => {
    navigation.navigate("Ввод города");
  };

  const showAddressInput = () => {
    if (city) {
      navigation.navigate("Ввод адреса", { selectedCity: city });
    } else {
      Alert.alert("", "Сначала выберите город", [
        {
          text: "Закрыть",
          onPress: () => null,
          style: "cancel",
        },
      ]);
    }
  };

  const zeroPad = (num, places) => String(num).padStart(places, "0");

  if (props.route.params) {
    if (props.route.params.clear) {
      props.route.params.clear = false;
      onChangeName("");
      setDateSelected(false);
      setDate(null);
      onChangeRegAddress("");
      setSignStatus(false);
      setCity("");
      setFarmAddress("");
    }

    if (props.route.params.selectedCity) {
      setCity(props.route.params.selectedCity);
      setFarmAddress(null);
      props.route.params.selectedCity = null;
    }

    if (props.route.params.selectedAddress) {
      setFarmAddress(props.route.params.selectedAddress);
      props.route.params.selectedAddress = null;
    }
  }

  let scale = 0.8;

  let headerFontSize = responsiveScreenFontSize(2 * scale);
  let headerMargin = responsiveScreenFontSize(0.8 * scale);

  let blockMargin = Math.round(responsiveScreenFontSize(0.8 * scale));

  let labelFontSize = responsiveScreenFontSize(1.5 * scale);

  let inputFontSize = responsiveScreenFontSize(1.5 * scale);
  let inputPadding = responsiveScreenFontSize(0.5 * scale);

  let buttonFontSize = responsiveScreenFontSize(1.5 * scale);
  let buttonPadding = responsiveScreenFontSize(1 * scale);

  let subscrHeight = responsiveScreenFontSize(5 * scale);

  let containerWidth = responsiveScreenWidth(78);
  let containerHeight = containerWidth * 0.65;

  let signButtonWidth = responsiveScreenWidth(20);
  let readyButtonWidth = responsiveScreenWidth(25);

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
          width: containerWidth,
        }}
      >
        <Text
          style={{
            fontSize: headerFontSize,
            fontWeight: "bold",
            color: "grey",
            textAlign: "center",
            textTransform: "uppercase",
            margin: headerMargin,
          }}
        >
          Ввeдите данные фармацевта
        </Text>

        <View
          style={{
            margin: blockMargin,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              position: "relative",
              width: "30%",
            }}
          >
            <Text
              style={{
                fontSize: labelFontSize,
                fontWeight: "bold",
                color: "grey",
                textTransform: "uppercase",
              }}
            >
              Введите город
            </Text>
            <TextInput
              style={{
                borderColor: "grey",
                borderWidth: 1,
                padding: inputPadding,
              }}
              caretHidden={true}
              value={city ? city.city : ""}
              placeholder="Нажмите для ввода"
              disableFullscreenUI={true}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              onPress={showCityInput}
            ></TouchableOpacity>
          </View>

          <View
            style={{
              position: "relative",
              width: "60%",
            }}
          >
            <Text
              style={{
                fontSize: labelFontSize,
                fontWeight: "bold",
                color: "grey",
                textTransform: "uppercase",
              }}
            >
              Введите адрес
            </Text>
            <TextInput
              style={{
                borderColor: "grey",
                borderWidth: 1,
                padding: inputPadding,
              }}
              caretHidden={true}
              value={farmAddress == null ? "" : farmAddress}
              placeholder="Нажмите для ввода"
              disableFullscreenUI={true}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              onPress={showAddressInput}
            ></TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            margin: blockMargin,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              width: "60%",
            }}
          >
            <Text
              style={{
                fontSize: labelFontSize,
                fontWeight: "bold",
                color: "grey",
                textTransform: "uppercase",
              }}
            >
              Введите фамилию, имя, отчество фармацевта
            </Text>
            <TextInput
              placeholder="Иванов Иван Иванович"
              style={{
                backgroundColor: "white",
                borderColor: "grey",
                borderWidth: 1,
                padding: inputPadding,
              }}
              onChangeText={(text) => onChangeName(text)}
              value={nameValue}
              disableFullscreenUI={true}
            />
          </View>

          <View
            style={{
              position: "relative",
              width: "30%",
            }}
          >
            <Text
              style={{
                fontSize: labelFontSize,
                fontWeight: "bold",
                color: "grey",
                textTransform: "uppercase",
              }}
            >
              Укажите дату рождения
            </Text>
            <TextInput
              style={{
                backgroundColor: "white",
                borderColor: "grey",
                borderWidth: 1,
                padding: inputPadding,
              }}
              placeholder="00.00.0000"
              disableFullscreenUI={true}
              caretHidden={true}
              value={
                date == null
                  ? ""
                  : `${zeroPad(date.getDate(), 2)}.${zeroPad(
                      date.getMonth() + 1,
                      2
                    )}.${date.getFullYear()}`
              }
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              onPress={showDatepicker}
            >
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date == null ? new Date() : date}
                  mode={mode}
                  is24Hour={true}
                  display="spinner"
                  onChange={onChange}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            margin: blockMargin,
          }}
        >
          <Text
            style={{
              fontSize: labelFontSize,
              fontWeight: "bold",
              color: "grey",
              textTransform: "uppercase",
            }}
          >
            Введите адрес регистрации (по паспорту)
          </Text>
          <TextInput
            placeholder=""
            style={{
              backgroundColor: "white",
              borderColor: "grey",
              borderWidth: 1,
              padding: inputPadding,
            }}
            onChangeText={(text) => onChangeRegAddress(text)}
            value={regAddress}
            disableFullscreenUI={true}
          />
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: signButtonWidth,
              margin: blockMargin,
            }}
          >
            <TouchableOpacity onPress={signButtonHandler}>
              <Text
                style={{
                  fontSize: buttonFontSize,
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "grey",
                  textAlign: "center",
                  textTransform: "uppercase",
                  padding: buttonPadding,
                }}
              >
                Согласие
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: readyButtonWidth,
              margin: blockMargin,
            }}
          >
            <TouchableOpacity
              onPress={buttonHandler}
              disabled={
                !(
                  nameValue !== "" &&
                  dateSelected &&
                  regAddress !== "" &&
                  farmAddress !== null &&
                  signStatus
                )
              }
            >
              <Text
                style={{
                  fontSize: buttonFontSize,
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "red",
                  textAlign: "center",
                  textTransform: "uppercase",
                  padding: buttonPadding,
                  opacity:
                    nameValue !== "" &&
                    dateSelected &&
                    regAddress !== "" &&
                    farmAddress !== null &&
                    signStatus
                      ? 1
                      : 0.5,
                }}
              >
                Далее
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
