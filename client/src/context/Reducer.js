export const initialState = {
  allPosts: [],
  reload: null,
  searchData: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ALLPOST":
      return {
        ...state,
        allPosts: action.allPosts,
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
