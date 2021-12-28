export const initialState = {
  allPosts: [],
  reload: null,
  searchData: [],
  userDetails: {},
  userPosts: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ALLPOST":
      return {
        ...state,
        allPosts: action.allPosts,
      };
    case "SET_FOLLOWINGS":
      const followingsUser = { ...state.userDetails };
      followingsUser.following = action.following;
      return {
        ...state,
        userDetails: followingsUser,
      };
    case "SET_LIKES":
      const mPosts = [...state.allPosts];
      const index = mPosts.findIndex((obj) => obj._id === action._id);
      if (index !== -1) {
        mPosts[index].likes = action.likes;
      }
      return {
        ...state,
        allPosts: mPosts,
      };
    case "SET_COMMENTS":
      const commPosts = [...state.allPosts];
      const commIndex = commPosts.findIndex((obj) => obj._id === action._id);
      if (commIndex !== -1) {
        commPosts[commIndex].comments = action.comments;
      }
      return {
        ...state,
        allPosts: commPosts,
      };
    case "SET_PIC":
      const pUser = { ...state.userDetails };
      pUser.pic = action.pic;
      return {
        ...state,
        userDetails: pUser,
      };
    case "DELETE_POST":
      const dPosts = [...state.userPosts];
      const dIndex = dPosts.findIndex((obj) => obj._id === action.id);
      if (dIndex !== -1) {
        dPosts.splice(dIndex, 1);
      }
      return {
        ...state,
        userPosts: dPosts,
      };
    case "SET_FAVS":
      let user = { ...state.userDetails };
      user.favorites = action.favs;
      return {
        ...state,
        userDetails: user,
      };
    case "SET_USER":
      return {
        ...state,
        userDetails: action.userDetails,
      };
    case "SET_POSTS":
      return {
        ...state,
        userPosts: action.userPosts,
      };
    case "SET_RELOAD":
      return {
        ...state,
        reload: action.reload,
      };
    case "SET_SEARCHDATA":
      return {
        ...state,
        searchData: action.searchData,
      };

    default:
      return state;
  }
};

export default reducer;

