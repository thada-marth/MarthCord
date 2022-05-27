import { DeleteIcon, SettingsIcon, UnlockIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Flex,
  IconButton,
  Text,
  Spacer,
} from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseconfig";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollection,
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import getOtherEmail from "../utils/getOtherEmail";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import getNickname from "../utils/getNickname";
import Checknickname from "../utils/Checknickname";

export default function Sidebar() {
  const [user] = useAuthState(auth);
  const [snapshot, loading, error] = useCollection(collection(db, "chat"));
  const [profile] = useCollectionData(collection(db, "users"));
  const chats = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const router = useRouter();

  const redirect = (id) => {
    router.push(`/chat/${id}`);
  };
  const redirectBack = (id) => {
    router.push(`/`);
  };

  const chatExistes = (email) =>
    chats?.find(
      (chat) => chat.users.includes(user.email) && chat.users.includes(email)
    );

  const newChat = async () => {
    const { value: email } = await Swal.fire({
      title: "Input email address",
      input: "email",
      inputLabel: "Your email address",
      inputPlaceholder: "Enter your email address",
      showCancelButton: true,
    });
    if (!email) {
      return;
    }
    if (email && !chatExistes(email) && email != user.email) {
      Swal.fire(`Start a Chat w/:`, `${email}`, "success");
      await addDoc(collection(db, "chat"), { users: [user.email, email] });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="">Why do I have this issue?</a>',
      });
    }
  };

  const reNickname = async () => {
    const { value: nickname } = await Swal.fire({
      title: "Enter you nickname",
      input: "text",
      inputLabel: "how we calling you?",
      inputPlaceholder: "MarthCord",
      showCancelButton: true,
    });
    if (!nickname) {
      return;
    }
    if (nickname) {
      await updateDoc(doc(db, "users", user.uid), {
        nickname: nickname,
      });
    }
  };

  const deleteChat = async (chat) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete chat with " + getOtherEmail(chat.users, user),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDoc(doc(db, "chat", chat.id));
        Swal.fire("Deleted!", "Your chat has been deleted.", "success");
        router.push(`/`);
      }
    });
  };

  const ChatList = () => {
    return chats
      ?.filter((chat) => chat.users.includes(user.email))
      .map((chat) => (
        <Flex
          key={Math.random()}
          p={3}
          align="center"
          _hover={{ bg: "gray.100", cursor: "pointer" }}
          onClick={() => redirect(chat.id)}
        >
          <Avatar src="" marginEnd="3" />
          <Flex direction="column">
            <Text fontSize="lg" color="blue.500">
              {getNickname(profile, getOtherEmail(chat.users, user))}
            </Text>
            <Text fontSize="sm">{getOtherEmail(chat.users, user)}</Text>
          </Flex>
          <Spacer />
          <DeleteIcon
            color="red.400"
            _hover={{ color: "red" }}
            onClick={() => deleteChat(chat)}
          />
        </Flex>
      ));
  };

  return (
    <>
    <Checknickname uid={user.uid}/>
      <Flex
        // bg="blue.100"
        w="300px"
        h="100vh"
        borderEnd="1px solid"
        borderColor="gray.200"
        direction="column"
      >
        <Flex
          // bg="red.100"
          h="81px"
          w="100%"
          align="center"
          justifyContent="space-between"
          borderBottom="1px solid"
          borderColor="gray.200"
          p={3}
        >
          <Flex align="center">
            <Avatar src={user.photoURL} marginEnd={3} />
            <Text>{user.displayName}</Text>
          </Flex>

          <Flex>
            <IconButton
              size="sm"
              isRound
              icon={<SettingsIcon />}
              onClick={() => reNickname()}
            />
            <IconButton
              marginStart={2}
              size="sm"
              isRound
              icon={<UnlockIcon />}
              onClick={() => signOut(auth).then(redirectBack())}
            />
          </Flex>
        </Flex>

        <Button m={5} p={4} onClick={() => newChat()}>
          New Chat +
        </Button>

        <Flex
          overflowX="scroll"
          direction="column"
          className="hideScroll"
          flex={1}
        >
          <ChatList />
        </Flex>
      </Flex>
    </>
  );
}
