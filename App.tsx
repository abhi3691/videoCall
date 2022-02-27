/** @format */

import { StatusBar } from "expo-status-bar";
import React, { useState, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "./components/Button";
import GettingCall from "./components/GettingCall";
import Video from "./components/video";
import {
  EventOnAddStream,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
} from "react-native-webrtc";
import Utils from "./utilits";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
const configuration = { iceServers: [{ url: "stun:stun.l.google.com:19302" }] };
export default function App() {
  const [localStream, setLocalStream] = useState<MediaStream | null>();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
  const [gettingCall, setGettingCall] = useState(false);
  const pc = useRef<RTCPeerConnection>();
  const connecting = useRef(false);

  const setUpWebrtc = async () => {
    pc.current = new RTCPeerConnection(configuration);

    //Get the audio and video stream for the call

    const stream = await Utils.getStream();
    if (stream) {
      setLocalStream(stream);
      pc.current.addStream(stream);
    }

    pc.current.onaddstream = (event: EventOnAddStream) => {
      setRemoteStream(event.stream);
    };
    //Get the remote stream once it is available
  };
  const create = async () => {
    console.log("Calling");
    connecting.current = true;

    // setUp webrtc

    await setUpWebrtc();
    //Document for the call

    const cRef = firestore().collection("meet").doc("chatId");

    //Exchange the ICE candidates between the caller and callee

    collectIceCandidates(cRef, "caller", "callee");
    if (pc.current) {
    }
  };
  const join = async () => {};
  const hangup = async () => {};

  //Helper function
  const collectIceCandidates = async (
    cRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
    localName: string,
    remoteName: string
  ) => {
    const candidateCollection = cRef.collection(localName);
    if (pc.current) {
      //on the ICE candidates and it to firestore
      pc.current.onicecandidate = (event) => {
        candidateCollection.add(event.candidate);
      };
    }
  };
  //Get the ICE candidates added to firestore and update the local PC

  cRef.collection(remoteName).onSnapshot((snapshot) => {
    snapshot.docChange().forEach((change: any) => {
      if (change.type == "added") {
        const candidate = new RTCIceCandidate(change.doc.date());
        pc.current?.addIceCandidate(candidate);
      }
    });
  });
  //Display the gettingCall component
  if (gettingCall) {
    return <GettingCall hangup={hangup} join={join} />;
  }

  // Display local Stream
  //Display both local and remote stream  once call is connected
  if (localStream) {
    return (
      <Video
        hangup={hangup}
        localStream={localStream}
        remoteStream={remoteStream}
      />
    );
  }
  //Displays the call button
  return (
    <View style={styles.container}>
      <Button iconName='video' backgroundColor='grey' onPress={create} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
