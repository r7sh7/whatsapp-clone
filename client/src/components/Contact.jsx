import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useHistory } from "react-router";
import styled from "styled-components";
import { auth, db } from "../config/fbconfig";

const Contact = ({ contact }) => {
  const [name, setName] = useState("");
  const [dp, setDp] = useState("");
  const [user] = useAuthState(auth);

  const history = useHistory();

  useEffect(() => {
    db.collectionGroup("users")
      .where("pno", "==", contact?.pno)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const { name, photoURL } = doc.data();
          setName(contact.name ? contact.name : name);
          setDp(photoURL);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [contact]);

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user?.phoneNumber);
  const [chatsSnapshot] = useCollection(userChatRef);
  const chatAlreadyExists = (number) =>
    !!chatsSnapshot?.docs.find(
      (chat) => chat.data().users.find((pno) => pno === number)?.length > 0
    );
  const handleContactClick = () => {
    if (!chatAlreadyExists(contact.pno)) {
      db.collection("chats")
        .add({
          users: [user.phoneNumber, contact.pno],
        })
        .then((res) => history.push(`/chats/${res.id}`))
        .catch((err) => console.log(err));
    } else {
      console.log("chat exists");
    }
  };

  return (
    <Container onClick={handleContactClick}>
      <UseAvatar sx={{ height: "3.2rem", width: "3.2rem" }} src={dp} />
      <ChatDetails>
        <MessageDetails>{name}</MessageDetails>
      </ChatDetails>
    </Container>
  );
};

export default Contact;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  :hover {
    background-color: #e2e2e2;
  }
`;

const UseAvatar = styled(Avatar)`
  margin: 0.8rem;
  margin-right: 0;
`;

const ChatDetails = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  margin: 0 0.8rem;
  padding-left: 0;
  border-bottom: 1px solid #e2e2e2;
`;

const MessageDetails = styled.div`
  > h4 {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
    margin-bottom: 0.2rem;
  }
  > p {
    font-size: 0.88rem;
    font-weight: 500;
    margin: 0;
  }
`;
