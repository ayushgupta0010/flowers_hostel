import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, ListItem, SearchBar } from "react-native-elements";
import { collection, onSnapshot } from "firebase/firestore";

import { backgroundColor, userPhoto } from "../utils/defaults";
import { db } from "../utils/firebase";
import Loading from "../components/Loading";

const getSearchedStudents = (studentsList, search) =>
  studentsList.filter((student) =>
    Object.values(student).some((s) =>
      ("" + s).toLowerCase().includes(search.toLowerCase())
    )
  );

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    onSnapshot(collection(db, "students"), (snapshot) => {
      setStudents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <ScrollView
      style={{ backgroundColor, flex: 1, paddingTop: StatusBar.currentHeight }}>
      <View style={{ flex: 1, alignItems: "center", marginTop: 10 }}>
        <Image
          source={require("../assets/banner.png")}
          resizeMode='stretch'
          style={{ width: "90%", height: 50 }}
        />
      </View>
      <View style={{ backgroundColor, flex: 1, padding: 20 }}>
        <SearchBar
          placeholder='Search student'
          value={search}
          onChangeText={(text) => setSearch(text)}
          onClear={() => setSearch("")}
          containerStyle={{
            marginBottom: 10,
            padding: 0,
            borderRadius: 25,
            borderWidth: 0,
          }}
          inputContainerStyle={{ borderRadius: 25, borderWidth: 0 }}
        />
        <View style={{ marginVertical: 10 }}>
          <Button
            title='Add student'
            color='darkslategrey'
            onPress={() => navigation.push("AddStudent")}
          />
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 10,
          }}>
          <Text style={{ color: "lightgray" }}>
            Total students: {students.length}
          </Text>
        </View>

        {students.length !== 0 ? (
          getSearchedStudents(students, search).map((student) => (
            <View key={student.id} style={{ marginBottom: 10 }}>
              <TouchableOpacity
                onPress={() => navigation.push("Profile", { id: student.id })}>
                <ListItem
                  containerStyle={{
                    backgroundColor: "#121212",
                    borderRadius: 10,
                  }}>
                  <Avatar
                    rounded
                    source={{ uri: student.photo ? student.photo : userPhoto }}
                    size='large'
                  />
                  <ListItem.Content>
                    <ListItem.Title style={{ color: "slategray" }}>
                      {student.name}
                    </ListItem.Title>
                    <ListItem.Subtitle
                      style={{ color: "darkgrey", fontSize: 12 }}>
                      Class {student.classSection}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", flexDirection: "row" }}>
            <Text style={{ color: "lightgray" }}>No students found</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
