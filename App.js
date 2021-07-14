import React, { useEffect, useState } from "react";
import { AdMobInterstitial } from "expo-ads-admob";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  Platform,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Task from "./components/Task";

export default function App() {
  // test ad: ca-app-pub-3940256099942544/1033173712

  // Display an interstitial
  const interstitialAd = async () => {
    await AdMobInterstitial.setAdUnitID(
      "ca-app-pub-3940256099942544/1033173712"
    );
    try {
      await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
      await AdMobInterstitial.showAdAsync();
      //console.log("Hi");
    } catch (error) {
      console.log(e);
    }
  };
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);

  useEffect(() => {
    interstitialAd();
    getData();
  }, []);

  // useeffect for setting local taskItems
  useEffect(() => {
    storeData(taskItems);
  }, [taskItems]);

  // async storage
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("taskItems", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  //async reading
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("taskItems");
      if (jsonValue != null) {
        val = JSON.parse(jsonValue);
        setTaskItems([...val]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, task]);
    setTask("");
  };

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
  };

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = new Date().getDay();
  const date = new Date().getDate();
  const m = new Date().getMonth();
  const day = days[d];
  const month = months[m];

  return (
    <View style={styles.container}>
      {/* Added this scroll view to enable scrolling when list gets longer than the page */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Your Task */}
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>
            Task List for {date}th {month}, {day}
          </Text>
          <View style={styles.items}>
            {/* This is where the tasks will go! */}
            {taskItems.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => completeTask(index)}
                >
                  <Task text={item} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Write a task */}
      {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder={"Write a task"}
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <AntDesign name="plus" />
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEE9FD",
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,
    shadowColor: "black",
    shadowOffset: {
      width: 0.75,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  addWrapper: {
    width: 51,
    height: 51,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C0C0C0",
    borderWidth: 1,
    shadowColor: "black",
    shadowOffset: {
      width: 0.75,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  taskStyle: {
    shadowColor: "black",
    shadowOffset: {
      width: 0.75,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  addText: {},
});
