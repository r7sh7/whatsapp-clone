import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import Chat from "./Chat";
import ConversationsModal from "./ConversationsModal";
import ContactsModal from "./ContactsModal";
import { auth } from "../config/fbconfig";
import Contact from "./Contact";
import { useHistory } from "react-router";
import { useAuthState } from "react-firebase-hooks/auth";
import ConfirmationModal from "./ConfirmationModal";

const Sidebar = ({ id, chats, contacts, handleProfileClick }) => {
  const [button, setButton] = useState("Chats");
  const [showModal, setShowModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [filteredChats, setFilteredChats] = useState(chats);
  const [user] = useAuthState(auth);
  const history = useHistory();

  const handleModalClick = (e) => {
    e.preventDefault();
    setShowModal(!showModal);
    setLogoutModal(false);
  };

  const handleLogoutClick = () => {
    setShowModal(true);
    setLogoutModal(true);
  };

  const handleLogout = () => {
    history.push("/");
    auth.signOut();
  };

  useEffect(() => {
    if (search === "") {
      setFilteredContacts(contacts);
      setFilteredChats(chats);
    } else {
      setFilteredContacts(
        contacts.filter((user) =>
          user.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [chats, contacts, search]);

  return (
    <Container>
      <Top>
        <Header>
          {user?.photoURL ? (
            <UseAvatar src={user.photoURL} onClick={handleProfileClick} />
          ) : (
            <UseAvatar onClick={handleProfileClick}>
              {user?.displayName[0]}
            </UseAvatar>
          )}
          <HeaderIcons>
            <Tooltip title="Log Out" placement="left">
              <IconButton onClick={handleLogoutClick}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </HeaderIcons>
        </Header>
        <Search>
          <SearchBar>
            <SearchIcon />
            <form>
              <input
                type="text"
                placeholder={`Search for a contact`}
                onClick={() => setButton("Contacts")}
                onChange={(e) => setSearch(e.target.value)}
                onSubmit={(e) => e.preventDefault()}
              />
            </form>
          </SearchBar>
        </Search>
        <TabWrapper>
          <button
            className={button === "Chats" ? "active" : ""}
            onClick={() => setButton("Chats")}
          >
            Chats
          </button>
          <button
            className={button === "Contacts" ? "active" : ""}
            onClick={() => setButton("Contacts")}
          >
            Contacts
          </button>
        </TabWrapper>
      </Top>
      <ChatsContainer>
        {button === "Chats" ? (
          chats.length === 0 ? (
            <ContactsContainer>You have no chats</ContactsContainer>
          ) : (
            filteredChats.map((chat) => {
              return (
                <Chat
                  key={chat.id}
                  id={chat.id}
                  users={chat.data().users}
                  active={id === chat.id ? true : false}
                  contacts={contacts}
                />
              );
            })
          )
        ) : contacts.length === 0 || filteredContacts.length === 0 ? (
          <ContactsContainer>You have no contacts</ContactsContainer>
        ) : (
          filteredContacts?.map((contact) => (
            <Contact
              contact={contact}
              key={contact.pno}
              searchPhrase={search}
            />
          ))
        )}
      </ChatsContainer>
      <CreateButton onClick={handleModalClick}>
        {/* {button === "Chats" ? "Create a Group Chat" : "Add a new Contact"} */}
        Add a new Contact
      </CreateButton>
      <Modal status={showModal}>
        {logoutModal === true ? (
          <ConfirmationModal
            closeModal={handleModalClick}
            action={handleLogout}
            actionName="Logout"
          />
        ) : (
          // button === "Chats" ? (
          //   showModal && <ConversationsModal closeModal={handleModalClick} />
          // ) :
          showModal && (
            <ContactsModal
              closeModal={handleModalClick}
              recipientName=""
              recipientNumber="+91"
              contacts={contacts.map((contact) => contact.pno)}
            />
          )
        )}
      </Modal>
    </Container>
  );
};

export default Sidebar;

const Container = styled.div`
  flex: 0.3;
  height: 100vh;
  /* max-width: 400px; */
  min-width: 300px;
  border-right: 1px solid #e2e2e2;
  overflow-y: hidden;
`;

const Top = styled.div`
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
  border-bottom: 1px solid whitesmoke;
  position: relative;
`;

const UseAvatar = styled(Avatar)`
  cursor: pointer;
`;

const HeaderIcons = styled.div`
  color: #424242;
`;

const Search = styled.div`
  background-color: whitesmoke;
  padding: 0.4rem 1rem;
  border-bottom: 1px solid whitesmoke;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  padding: 0.4rem 1rem;
  border: 1px solid whitesmoke;
  border-radius: 1.5rem;

  > form > input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 1rem;
    margin-left: 1rem;
  }
`;

const TabWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  > button {
    width: 50%;
    padding: 1rem;
    font-size: 1rem;
    border: none;
    color: gray;

    &.active {
      color: black;
      font-size: 1.2rem;
      border-bottom: 3px solid #0a0a0a;
    }
  }
`;

const ChatsContainer = styled.div`
  height: 100vh;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: none;
  }

  --ms-overflow-style: none;
  scrollbar-width: none;
`;

const CreateButton = styled.button`
  width: 100%;
  position: sticky;
  bottom: 0;
  padding: 1.5rem;
  font-size: 1.2rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
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

const ContactsContainer = styled.div`
  display: grid;
  place-items: center;
  height: 100%;
`;
