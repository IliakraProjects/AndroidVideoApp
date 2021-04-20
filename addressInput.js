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

import { adresses, farmacies } from "../adresses.js";

export default function AddressInput(props) {
  const [cityId, setCityId] = useState(null);
  const [addressList, setAddressList] = useState(null);
  const [addressSelected, setAddressSelected] = useState(null);

  if (props.route.params) {
    if (props.route.params.selectedCity) {
      let id = props.route.params.selectedCity.id;
      setCityId(id);
      setAddressList(adresses[id]);
      props.route.params.selectedCity = null;
    }
  }

  const navigation = useNavigation();

  const goBack = async (props) => {
    navigation.navigate("Ввод данных", props);
  };

  const onAddressSelected = async (item) => {
    let itemIndex = adresses[cityId].indexOf(item);
    item = `${item}, ${farmacies[cityId][itemIndex]}`;
    setAddressSelected(item);
    goBack({ selectedAddress: item });
  };

  const changeAddress = (text) => {
    let str = text.length;
    let filteredAddresses = [];
    if (adresses[cityId]) {
      filteredAddresses = adresses[cityId].filter(function (item) {
        return item.toLowerCase().indexOf(text.toLowerCase()) >= 0;
      });
    }
    setAddressList(filteredAddresses);
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
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = item === addressSelected ? "red" : "white";
    const color = item === addressSelected ? "white" : "black";

    return (
      <Item
        item={item}
        onPress={() => onAddressSelected(item)}
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
        Введите адрес аптеки
      </Text>
      <TextInput
        placeholder="Начинайте вводить название улицы"
        style={{
          width: "100%",
          backgroundColor: "white",
          borderColor: "grey",
          borderWidth: 1,
          padding: inputPadding,
        }}
        onChangeText={(text) => changeAddress(text)}
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
          data={addressList}
          renderItem={renderItem}
          keyExtractor={(item, index) => {
            return String(index);
          }}
          extraData={addressSelected}
        ></FlatList>
      </View>
    </View>
  );
}
