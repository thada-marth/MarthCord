import Sidebar from "../../component/Sidebar";
import {
  Avatar,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Text,
  ChakraProvider,
  Center,
  Spinner,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  useCollectionData,
  useDocumentData,
  useCollection,
} from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  doc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../../firebaseconfig";
import { query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import getOtherEmail from "../../utils/getOtherEmail";
import { useEffect, useState } from "react";
import { async } from "@firebase/util";
import { useRef } from "react";
import getNickname from "../../utils/getNickname";

const Topbar = ({ email, nickname }) => {
  return (
    <Flex bg="gray.100" h="81px" w="100%" align="center" p={5}>
      <Avatar src="" marginRight={3} />
      <Flex direction="column">
        <Heading size="lg">{nickname}</Heading>
        <Text>{email}</Text>
      </Flex>
    </Flex>
  );
};

const BottomBar = ({ id, user }) => {
  const [input, setInput] = useState("");
  const [profile] = useCollectionData(collection(db, "users"));

  const sendMessage = async (e) => {
    if (input.length === 0) {
      return;
    }
    e.preventDefault(); //not to refresh everytime we click on send
    await addDoc(collection(db, "chat", id, "messages"), {
      text: input,
      sender: user.email,
      timestamp: serverTimestamp(),
    });
    setInput("");
  };

  return (
    <form>
      <FormControl p={3}>
        <Flex gap={3}>
          <Input
            placeholder="Type here boi"
            autoComplete="off"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <Button type="submit" bgColor="red.300" onClick={sendMessage}>
            Send
          </Button>
        </Flex>
      </FormControl>
    </form>
  );
};

export default function Chat() {
  const router = useRouter();
  const { id } = router.query;
  const [user] = useAuthState(auth);
  const [chat] = useDocumentData(doc(db, "chat", id));

  const q = query(collection(db, `chat/${id}/messages`), orderBy("timestamp"));
  const [messages, loading] = useCollectionData(q);
  const [profile] = useCollectionData(collection(db, "users"));
  const bottomOfChat = useRef();

  const Getmessages = () => {
    if (loading) {
      return (
        <ChakraProvider>
          <Center h="100vh">
            <Spinner size="lg" />
          </Center>
        </ChakraProvider>
      );
    }

    return messages?.map((msg) => (
      <Flex
        key={Math.random()}
        alignSelf={msg.sender == user.email ? "flex-end" : "flex-start"}
        direction="column"
      >
        <Text alignSelf={msg.sender == user.email ? "flex-end" : "flex-start"} color="gray.500" fontSize="xs" m={1}>{msg.sender == user.email ? getNickname(profile,user.email) : getNickname(profile,msg.sender)}</Text>
        <Flex
        key = {Math.random()}
          bg={msg.sender == user.email ? "green.100" : "blue.100"}
          w="fit-content"
          // minWidth="100px"
          borderRadius="lg"
          p={3}
          m={1}
        >
          <Text>{msg.text}</Text>
        </Flex>
      </Flex>
    ));
  };

  useEffect(() =>
    bottomOfChat.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  );

  return (
    <Flex h="100vh">
      <Head>
        <title>MarthCord</title>
      </Head>

      <Sidebar />

      <Flex
        // bg="blue.100"
        flex={1}
        direction="column"
      >
        <Topbar
          email={getOtherEmail(chat?.users, user)}
          nickname={getNickname(profile, getOtherEmail(chat?.users, user))}
        />

        <Flex
          flex={1}
          direction="column"
          pt={4}
          mx={5}
          overflowX="scroll"
          className="hideScroll"
        >
          <Flex
            bg="yellow.100"
            w="fit-content"
            minWidth="100px"
            borderRadius="lg"
            p={3}
            m={1}
            alignSelf="center"
          >
            <Text>Hello , Welcome to MarthCord</Text>
          </Flex>
          <Getmessages />
          <div ref={bottomOfChat}></div>
        </Flex>

        <BottomBar id={id} user={user} />
      </Flex>
    </Flex>
  );
}
