import React from "react";
import { ActivityIndicator } from "react-native";
import { backgroundColor } from "../utils/defaults";

const Loading = () => (
  <ActivityIndicator
    size='large'
    animating={true}
    color='dodgerblue'
    style={{ flex: 1, justifyContent: "center", backgroundColor }}
  />
);

export default Loading;
