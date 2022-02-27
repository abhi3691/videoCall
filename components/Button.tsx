/** @format */

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
interface Props {
  onPress?: any;
  iconName: any;
  backgroundColor: any;
  style?: any;
}
export default function Button(props: Props) {
  return (
    <View>
      <TouchableOpacity
        onPress={props.onPress}
        style={[
          { backgroundColor: props.backgroundColor },
          props.style,
          styles.Button,
        ]}>
        <Icon name={props.iconName} color='white' size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  Button: {
    width: 60,
    height: 60,
    padding: 10,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
});
