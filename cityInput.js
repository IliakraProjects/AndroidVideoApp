import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from "react-native-responsive-dimensions";
import { useHeaderHeight } from "@react-navigation/stack";

import { cities } from "../adresses.js";

export default function CityInput() {
  const [citySelected, setCitySelected] = useState(null);
  const [cityList, setCityList] = useState(cities);

  const navigation = useNavigation();

  const goBack = async (props) => {
    navigation.navigate("Ввод данных", props);
  };

  const onCitySelected = async (item) => {
    setCitySelected(item.id);
    goBack({ selectedCity: item });
  };

  const changeCity = (text) => {
    let str = text.length;
    let filteredCities = cities.filter(function (item) {
      return item.city.toLowerCase().indexOf(text.toLowerCase()) >= 0;
    });
    setCityList(filteredCities);
  };

  const Item = ({ item, onPress, style }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: "100%",
          padding: buttonReadyPadding,
        },
        style,
      ]}
    >
      <Text
        style={[
          {
            width: "100%",
          },
          style,
        ]}
      >
        {item.city}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === citySelected ? "red" : "white";
    const color = item.id === citySelected ? "white" : "black";

    return (
      <Item
        item={item}
        onPress={() => onCitySelected(item)}
        style={{ backgroundColor, color }}
      />
    );
  };

  const headerHeight = useHeaderHeight();

  let imageScale = Math.min(
    responsiveScreenWidth(95) / 1280,
    (responsiveScreenHeight(95) - headerHeight) / 720
  );

  let containerWidth = 1280 * imageScale;
  let containerHeight = 720 * imageScale;

  let scale = 0.8;

  let labelFontSize = responsiveScreenFontSize(1.5 * scale);

  let inputPadding = responsiveScreenFontSize(0.5 * scale);

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
        top: "10%",
        width: containerWidth,
        height: "80%",
        left: "50%",
        transform: [{ translateX: -(containerWidth / 2) }],
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
        Введите название города
      </Text>
      <TextInput
        placeholder="Начинайте вводить название города"
        style={{
          width: "100%",
          backgroundColor: "white",
          borderColor: "grey",
          borderWidth: 1,
          padding: inputPadding,
        }}
        onChangeText={(text) => changeCity(text)}
        disableFullscreenUI={true}
      />

      <View
        style={{
          backgroundColor: "white",
          borderColor: "grey",
          borderWidth: 1,
          borderTopWidth: 0,
          width: "100%",
          height: "80%",
          padding: inputPadding,
        }}
      >
        <FlatList
          style={{
            width: "100%",
            height: "100%",
          }}
          data={cityList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={citySelected}
        ></FlatList>
      </View>
    </View>
  );
}
