import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { auth, db } from "../config/fbconfig";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientNumber from "../utils/getRecipientNumber";
import { useCollection } from "react-firebase-hooks/firestore";
import { useHistory } from "react-router";
import moment from "moment";

const Chat = ({ id, users, active, contacts }) => {
  const [newContact, setNewContact] = useState(true);
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [newMessages, setNewMessages] = useState(0);
  const [latestMessage, setLatestMessage] = useState();
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("pno", "==", getRecipientNumber(users, user))
  );
  let Messages = useCollection(
    db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  // Messages[0]?.docs.forEach((doc) => console.log(doc.data()));
  // console.log(latestMessage[0]?.empty);
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  useEffect(() => {
    contacts?.forEach((contact) => {
      if (contact.pno === recipient?.pno) {
        setNewContact(false);
        setName(contact.name);
      }
    });
  }, [contacts, recipient?.pno]);

  useEffect(() => {
    Messages[0]?.docs.forEach((doc) => {
      if (doc.data().user !== user.phoneNumber && !doc.data().seen) {
        setNewMessages((prevValue) => prevValue + 1);
      } else {
        setNewMessages(0);
      }
    });
    setLatestMessage(Messages[0]?.docs?.slice(-1)[0]?.data());
  }, [Messages, user.phoneNumber]);

  const history = useHistory();
  const chatClickHandler = () => {
    history.push(`/chats/${id}`);
    Messages[0]?.docs.forEach((doc) => {
      if (doc.data().user !== user.phoneNumber && !doc.data().seen) {
        setNewMessages((prevValue) => prevValue + 1);
      } else {
        setNewMessages(0);
      }
    });
  };

  // console.log(latestMessage);
  return latestMessage === undefined ? (
    <></>
  ) : (
    <Container onClick={chatClickHandler} active={active}>
      {recipient?.photoURL ? (
        <UseAvatar
          sx={{ height: "3.2rem", width: "3.2rem" }}
          src={recipient.photoURL}
        />
      ) : (
        <UseAvatar sx={{ height: "3.2rem", width: "3.2rem" }}>
          {name[0] || recipient?.name[0]}
        </UseAvatar>
      )}
      <ChatDetails>
        <MessageDetails newMessage={newMessages}>
          {newContact ? (
            <h4>
              {recipient?.pno}
              <span style={{ fontSize: "0.8rem" }}>~ {recipient?.name}</span>
            </h4>
          ) : (
            <h4>{name || recipient?.name}</h4>
          )}
          <p>{latestMessage?.message}</p>
        </MessageDetails>
        <MessageStats>
          <Time newMessage={newMessages}>
            {/* {console.log(latestMessage?.timestamp?.toDate().getTime())} */}
            {moment(latestMessage?.timestamp?.toDate()).fromNow() ===
            "24 hours ago"
              ? moment(latestMessage?.timestamp?.toDate()).format("dddd")
              : moment(latestMessage?.timestamp?.toDate().getTime()).format(
                  "LT"
                )}
          </Time>
          {newMessages !== 0 && <Number>{newMessages}</Number>}
        </MessageStats>
      </ChatDetails>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#d1d1d1c0" : "white")};
  :hover {
    background-color: ${(props) => (props.active ? "#e2e2e2c0" : "#d6d6d663")};
  }
`;

const UseAvatar = styled(Avatar)`
  margin-left: 0.8rem;
`;

const ChatDetails = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  padding: 0.8rem;
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
    color: ${(props) => (props.newMessage !== 0 ? "black" : "#2e2e2e")};
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  > p {
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
    color: ${(props) => (props.newMessage !== 0 ? "black" : "#646464")};
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
`;

const MessageStats = styled.div`
  display: flex;
  flex-direction: column;
`;

const Time = styled.span`
  margin: 0.2rem 0;
  flex-wrap: nowrap;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 400;
  color: ${(props) => (props.newMessage !== 0 ? "black" : "#646464")};
`;
const Number = styled.span`
  margin-left: auto;
  background-color: #3cbc28;
  text-align: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  border-radius: 50%;
  height: 0.9rem;
  min-width: 1rem;
  padding: 0.2rem;
`;
