const getOtherEmail = (users, currentUser) => {
    return users?.filter(users => users!== currentUser.email)[0];
}

export default getOtherEmail;
