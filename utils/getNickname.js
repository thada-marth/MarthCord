const getNickname = (profiles , x) => {
    // const profiles = profile?.docs.map((doc) => doc.data());
    // const a = profiles?.map((input) => console.log(input.uid));
    const found = profiles?.find(e => e.email.includes(x))
    return found?.nickname;
  };

  export default getNickname;