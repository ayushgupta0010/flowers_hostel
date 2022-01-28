import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Linking,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Card, Icon, Input, SpeedDial } from "react-native-elements";
import { deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import {
  backgroundColor,
  cardBackgroundColor,
  userPhoto,
} from "../utils/defaults";
import { db, storage } from "../utils/firebase";
import Loading from "../components/Loading";

const Call = ({ phoneNo }) => (
  <TouchableOpacity onPress={() => Linking.openURL(`tel:+91${phoneNo}`)}>
    <Icon type='simplelineicon' name='phone' color='teal' />
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation, route }) => {
  const [defaultProfile, setDefaultProfile] = useState({});
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);

  const handleChange = (key, value) => {
    setProfile((original) => ({ ...original, [key]: value }));
  };

  const handleFeesChange = (installment, key, value) => {
    setProfile((original) => ({
      ...original,
      fees: {
        ...original.fees,
        [installment]: { ...original.fees[installment], [key]: value },
      },
    }));
  };

  const handleSubmit = () => {
    updateDoc(doc(db, "students", route.params.id), profile)
      .then(() => {
        setDefaultProfile(profile);
        setProfile(profile);
      })
      .catch((err) => Alert.alert("An unknown error occurred"));
    setEditMode(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete student",
      "Are you sure that you want to delete this student?",
      [
        {
          text: "Delete",
          onPress: () => {
            if (profile.photo) {
              deleteObject(ref(storage, profile.photo))
                .then(() => console.log("Photo deleted"))
                .catch((err) => Alert.alert("An unknown error occurred"));
            }
            deleteDoc(doc(db, "students", route.params.id))
              .then(() => navigation.push("Home"))
              .catch((err) => Alert.alert("An unknown error occurred"));
          },
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel delete"),
          style: "cancel",
        },
      ]
    );
  };

  const uploadImage = async (fileUri) => {
    let response = await fetch(fileUri);
    let file = await response.blob();

    let extension = fileUri.substring(fileUri.lastIndexOf(".") + 1);
    let path = `${route.params.id}.${extension}`;

    let storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    getDownloadURL(storageRef).then((url) => {
      updateDoc(doc(db, "students", route.params.id), { photo: url });
    });

    setLoading(false);
    setEditMode(false);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "students", route.params.id),
      (doc) => {
        let data = doc.data();
        if (!data) return;
        setDefaultProfile(data);
        setProfile(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <Loading />;

  return (
    <ScrollView
      style={{ backgroundColor, flex: 1, paddingTop: StatusBar.currentHeight }}>
      <View style={{ backgroundColor, flex: 1 }}>
        <Card
          containerStyle={{
            backgroundColor: cardBackgroundColor,
            borderWidth: 0,
            margin: 0,
          }}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity
              onPress={() => {
                if (!editMode) return;

                ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  quality: 1,
                })
                  .then((res) => {
                    setLoading(true);
                    uploadImage(res.uri);
                  })
                  .catch((err) => Alert.alert("An unknown error occurred"));
              }}>
              <Card.Image
                style={{ width: 200, height: 200 }}
                source={{ uri: profile.photo ? profile.photo : userPhoto }}
              />
            </TouchableOpacity>
          </View>
          <Card.Title style={{ color: "gray", marginTop: 10 }}>
            {profile.name}
          </Card.Title>
          <Card.Title style={{ color: "gray" }}>
            Class {profile.classSection}
          </Card.Title>

          <View style={{ marginTop: 30 }}>
            {editMode && (
              <>
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
              </>
            )}
            <Input
              style={{ color: "silver" }}
              label="Father's Name"
              value={profile.fatherName}
              editable={editMode}
              onChangeText={(v) => handleChange("fatherName", v)}
            />
            <Input
              style={{ color: "silver" }}
              label="Mother's Name"
              value={profile.motherName}
              editable={editMode}
              onChangeText={(v) => handleChange("motherName", v)}
            />
            <Input
              style={{ color: "silver" }}
              label="Father's Number"
              value={profile.fatherNo}
              editable={editMode}
              keyboardType='phone-pad'
              textContentType='telephoneNumber'
              onChangeText={(v) => handleChange("fatherNo", v)}
              rightIcon={!editMode && <Call phoneNo={profile.fatherNo} />}
            />
            <Input
              style={{ color: "silver" }}
              label="Mother's Number"
              value={profile.motherNo}
              editable={editMode}
              keyboardType='phone-pad'
              textContentType='telephoneNumber'
              onChangeText={(v) => handleChange("motherNo", v)}
              rightIcon={!editMode && <Call phoneNo={profile.motherNo} />}
            />
            <Input
              style={{ color: "silver" }}
              label='Other Number'
              value={profile.otherNo}
              editable={editMode}
              keyboardType='phone-pad'
              textContentType='telephoneNumber'
              onChangeText={(v) => handleChange("otherNo", v)}
              rightIcon={!editMode && <Call phoneNo={profile.otherNo} />}
            />
            <Input
              style={{ color: "silver" }}
              numberOfLines={2}
              label='Address'
              value={profile.address}
              multiline
              editable={editMode}
              onChangeText={(v) => handleChange("address", v)}
            />
          </View>

          <View style={{ marginLeft: 10, marginTop: 20 }}>
            <Text style={{ fontSize: 25, color: "gray" }}>Fees</Text>
            <Text
              style={{ fontSize: 20, color: "lightgray", marginVertical: 10 }}>
              Installment 1
            </Text>
            <Input
              style={{ color: "silver" }}
              label='Amount to be paid'
              value={profile.fees.installment1.amountToBePaid}
              editable={editMode}
              onChangeText={(v) =>
                handleFeesChange("installment1", "amountToBePaid", v)
              }
            />
            <Input
              style={{ color: "silver" }}
              label='Amount paid'
              value={profile.fees.installment1.amountPaid}
              editable={editMode}
              onChangeText={(v) =>
                handleFeesChange("installment1", "amountPaid", v)
              }
            />

            <Text
              style={{ fontSize: 20, color: "lightgray", marginVertical: 10 }}>
              Installment 2
            </Text>
            <Input
              style={{ color: "silver" }}
              label='Amount to be paid'
              value={profile.fees.installment2.amountToBePaid}
              editable={editMode}
              onChangeText={(v) =>
                handleFeesChange("installment2", "amountToBePaid", v)
              }
            />
            <Input
              style={{ color: "silver" }}
              label='Amount paid'
              value={profile.fees.installment2.amountPaid}
              editable={editMode}
              onChangeText={(v) =>
                handleFeesChange("installment2", "amountPaid", v)
              }
            />

            <Text
              style={{ fontSize: 20, color: "lightgray", marginVertical: 10 }}>
              Installment 3
            </Text>
            <Input
              style={{ color: "silver" }}
              label='Amount to be paid'
              value={profile.fees.installment3.amountToBePaid}
              editable={editMode}
              onChangeText={(v) =>
                handleFeesChange("installment3", "amountToBePaid", v)
              }
            />
            <Input
              style={{ color: "silver" }}
              label='Amount paid'
              value={profile.fees.installment3.amountPaid}
              editable={editMode}
              onChangeText={(v) =>
                handleFeesChange("installment3", "amountPaid", v)
              }
            />
          </View>

          {editMode && (
            <>
              <View style={{ marginTop: 10 }}>
                <Button
                  title='Save'
                  color='darkslategrey'
                  onPress={handleSubmit}
                />
              </View>
              <View style={{ marginTop: 10 }}>
                <Button
                  title='Cancel'
                  color='darkslategrey'
                  onPress={() => {
                    setProfile(defaultProfile);
                    setEditMode(false);
                  }}
                />
              </View>
            </>
          )}

          <SpeedDial
            isOpen={open}
            icon={{ name: "menu", color: "#fff" }}
            openIcon={{ name: "close", color: "#fff" }}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}>
            <SpeedDial.Action
              icon={{ name: "edit", color: "#fff" }}
              title='Edit'
              onPress={() => {
                setEditMode(true);
                setOpen(false);
              }}
            />
            <SpeedDial.Action
              icon={{ name: "delete", color: "#fff" }}
              title='Delete'
              onPress={() => {
                setOpen(false);
                handleDelete();
              }}
            />
          </SpeedDial>
        </Card>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
