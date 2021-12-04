import { Avatar, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/fbconfig";
import getRecipientNumber from "../utils/getRecipientNumber";
import { useCollection } from "react-firebase-hooks/firestore";
import ContactsModal from "./ContactsModal";
import firebase from "firebase";
import Message from "./Message";
import moment from "moment";

const Conversations = ({ id, chats, contacts }) => {
  const [user] = useAuthState(auth);
  const [pno, setPno] = useState("");
  const [newContact, setNewContact] = useState(true);
  const [unknownContact, setUnknownContact] = useState(true);
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const endOfMessageRef = useRef(null);
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.phoneNumber,
    });

    setInput("");
    scrollToBottom();
  };

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot?.docs?.map((message) => {
        return (
          <Message
            key={message.id}
            message={{
              ...message.data(),
              timestamp: message?.data()?.timestamp?.toDate().getTime(),
            }}
          />
        );
      });
    }
  };

  const handleModalClick = (e) => {
    e.preventDefault();
    setShowModal(!showModal);
  };

  useEffect(() => {
    chats.forEach((chat) => {
      if (chat.id === id) {
        setPno(getRecipientNumber(chat.data().users, user));
      }
    });
  }, [chats, id, user]);

  const [recipientSnapshot] = useCollection(
    db.collection("users").where("pno", "==", pno)
  );
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  useEffect(() => {
    setNewContact(true);
    contacts?.forEach((contact) => {
      if (contact.pno === recipient?.pno) {
        setNewContact(false);
        setName(contact.name);
      }
    });
  }, [contacts, id, recipient?.pno]);

  useEffect(() => {
    if (!!!recipient?.contacts?.find(() => user.phoneNumber)) {
      setUnknownContact(false);
    } else {
      setUnknownContact(true);
    }
  }, [recipient?.contacts, user.phoneNumber]);

  return (
    <Container>
      <HeaderContainer>
        <Header>
          <HeaderLeft>
            {recipient?.photoURL ? (
              <UseAvatar src={recipient.photoURL} />
            ) : (
              <UseAvatar>{name[0] || recipient?.name[0]}</UseAvatar>
            )}

            {newContact ? (
              <HeaderInfo>
                <h4>
                  {recipient?.pno}
                  <span style={{ fontSize: "0.8rem" }}>
                    ~ {recipient?.name}
                  </span>
                </h4>
                <p>
                  Last Seen: {moment(recipient?.lastSeen.toDate()).fromNow()}
                </p>
              </HeaderInfo>
            ) : (
              <HeaderInfo>
                <h4>{name || recipient?.name}</h4>
                {unknownContact ? (
                  <p>
                    Last Seen: {moment(recipient?.lastSeen.toDate()).fromNow()}
                  </p>
                ) : (
                  <p>Last Seen: Not Available</p>
                )}
              </HeaderInfo>
            )}
          </HeaderLeft>
          <HeaderIcons>
            <IconButton>
              <AttachFileIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </HeaderIcons>
        </Header>
        <AddToContacts show={newContact} onClick={handleModalClick}>
          Add User To Contacts
        </AddToContacts>
      </HeaderContainer>
      <MessageConatiner>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessageConatiner>
      <InputContainer>
        <IconButton>
          <InsertEmoticonIcon fontSize="large" />
        </IconButton>
        <Input
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <IconButton>
          <MicIcon fontSize="large" />
        </IconButton>
      </InputContainer>
      <Modal status={showModal}>
        {showModal && (
          <ContactsModal
            closeModal={handleModalClick}
            recipientNumber={recipient?.pno}
            recipientName={recipient?.name}
          />
        )}
      </Modal>
    </Container>
  );
};

export default Conversations;

const Container = styled.div`
  flex: 1;
`;

const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 99;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ebebeb;
  padding: 0.6rem 1rem;
`;
const AddToContacts = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  text-align: center;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  cursor: pointer;

  :hover {
    background-color: rgba(0, 0, 0, 0.6);
    font-weight: 500;
  }
`;
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;
const UseAvatar = styled(Avatar)`
  cursor: pointer;
`;
const HeaderInfo = styled.div`
  margin-left: 1rem;

  > h4 {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
  }

  > p {
    font-size: 0.85rem;
    margin: 0;
  }
`;

const HeaderIcons = styled.div`
  color: #424242;
`;

const MessageConatiner = styled.div`
  padding: 2rem;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div``;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  position: sticky;
  bottom: 0;
  z-index: 99;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  background-color: #ebebeb;
  color: gray;
`;

const Input = styled.input`
  flex: 0.95;
  padding: 0.8rem;
  border-radius: 2.5rem;
  border: none;
  outline: none;
  font-size: 1rem;
`;

const Modal = styled.div`
  position: fixed;
  display: ${(props) => (props.status ? "grid" : "none")};
  place-items: center;
  height: 100vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.6);
`;
