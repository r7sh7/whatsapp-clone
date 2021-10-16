import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router";
import styled from "styled-components";
import Conversations from "../../components/Conversations.jsx";
import Main from "../../components/Main.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import { auth, db } from "../../config/fbconfig.js";

const HomeScreen = () => {
  const { id } = useParams();
  const [contacts, setContacts] = useState([]);
  const [chats, setChats] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    db.collection("users")
      .doc(user.uid)
      .onSnapshot((doc) => {
        setContacts(doc.data().contacts);
      });
  }, [user]);

  useEffect(() => {
    db.collection("chats")
      .where("users", "array-contains", user?.phoneNumber)
      .onSnapshot((querySnapshot) => {
        setChats(querySnapshot.docs);
      });
  }, [user?.phoneNumber]);

  return (
    <Container>
      <Sidebar id={id} chats={chats} contacts={contacts} />
      {id ? (
        <Conversations id={id} chats={chats} contacts={contacts} />
      ) : (
        <Main />
      )}
    </Container>
  );
};

export default HomeScreen;

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow-y: hidden;
`;
