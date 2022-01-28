import React, { useState } from "react";
import { Alert, Button, ScrollView, StatusBar, View } from "react-native";
import { Input } from "react-native-elements";
import { addDoc, collection } from "firebase/firestore";

import { backgroundColor } from "../utils/defaults";
import { db } from "../utils/firebase";

const AddStudentScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    name: "",
    classSection: "",
    fatherName: "",
    motherName: "",
    fatherNo: "",
    motherNo: "",
    otherNo: "",
    address: "",
    photo: "",
    fees: {
      installment1: {
        amountToBePaid: "",
        amountPaid: "",
      },
      installment2: {
        amountToBePaid: "",
        amountPaid: "",
      },
      installment3: {
        amountToBePaid: "",
        amountPaid: "",
      },
    },
  });

  const handleChange = (key, value) => {
    setProfile((original) => ({ ...original, [key]: value }));
  };

  const handleSubmit = () => {
    addDoc(collection(db, "students"), profile)
      .then((res) => navigation.push("Home"))
      .catch((err) => Alert.alert("An unknown error occurred"));
  };

  return (
    <ScrollView style={{ paddingTop: StatusBar.currentHeight, flex: 1 }}>
      <View style={{ backgroundColor, flex: 1, padding: 20 }}>
        <Input
          style={{ color: "silver" }}
          label='Name'
          value={profile.name}
          autoFocus={true}
          onChangeText={(v) => handleChange("name", v)}
        />
        <Input
          style={{ color: "silver" }}
          label='Class'
          value={profile.classSection}
          onChangeText={(v) => handleChange("classSection", v)}
        />
        <Input
          style={{ color: "silver" }}
          label="Father's Name"
          value={profile.fatherName}
          onChangeText={(v) => handleChange("fatherName", v)}
        />
        <Input
          style={{ color: "silver" }}
          label="Mother's Name"
          value={profile.motherName}
          onChangeText={(v) => handleChange("motherName", v)}
        />
        <Input
          style={{ color: "silver" }}
          label="Father's Number"
          value={profile.fatherNo}
          keyboardType='phone-pad'
          textContentType='telephoneNumber'
          onChangeText={(v) => handleChange("fatherNo", v)}
        />
        <Input
          style={{ color: "silver" }}
          label="Mother's Number"
          value={profile.motherNo}
          keyboardType='phone-pad'
          textContentType='telephoneNumber'
          onChangeText={(v) => handleChange("motherNo", v)}
        />
        <Input
          style={{ color: "silver" }}
          label='Other Number'
          value={profile.otherNo}
          keyboardType='phone-pad'
          textContentType='telephoneNumber'
          onChangeText={(v) => handleChange("otherNo", v)}
        />
        <Input
          style={{ color: "silver" }}
          numberOfLines={2}
          label='Address'
          value={profile.address}
          multiline
          onChangeText={(v) => handleChange("address", v)}
        />

        <View style={{ marginTop: 10, marginBottom: 30 }}>
          <Button title='Create' color='darkslategrey' onPress={handleSubmit} />
        </View>
      </View>
    </ScrollView>
  );
};

export default AddStudentScreen;
