import { createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../helpers/axiosClient";

const initialState = {
  isLoading: false,
  loggedUser: "",
  isUserLoggedIn: false,
  error: false,
  posts: [],
  post: null,
  recentPosts: [],
  hasMore: true,
  index: 0,
  step: 11,
};

const slice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET POSTS
    getPostsSuccess(state, action) {
      state.isLoading = false;
      state.posts = action.payload;
    },

    // GET POST INFINITE
    getPostsInitial(state, action) {
      state.isLoading = false;
      state.posts = action.payload;
    },

    getMorePosts(state) {
      const setIndex = state.index + state.step;
      state.index = setIndex;
    },

    noHasMore(state) {
      state.hasMore = false;
    },

    // GET POST
    getPostSuccess(state, action) {
      state.isLoading = false;
      state.post = action.payload;
    },

    // GET RECENT POST
    getRecentPostsSuccess(state, action) {
      state.isLoading = false;
      state.recentPosts = action.payload;
    },

    // login user
    loginUserSuccess(state, action) {
      state.loggedUser = action.payload;
      state.isLoading = false;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { getMorePosts } = slice.actions;

// ----------------------------------------------------------------------

export function getAllPosts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosClient.get("/api/blog/posts/all");
      dispatch(slice.actions.getPostsSuccess(response.data.posts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getPostsInitial(index, step) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosClient.get("/api/blog/posts", {
        params: { index, step },
      });
      const results = response.data.results.length;
      const { maxLength } = response.data;

      dispatch(slice.actions.getPostsInitial(response.data.results));

      if (results >= maxLength) {
        dispatch(slice.actions.noHasMore());
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getPost(title) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosClient.get("/api/blog/post", {
        params: { title },
      });
      dispatch(slice.actions.getPostSuccess(response.data.post));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getRecentPosts(title) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosClient.get("/api/blog/posts/recent", {
        params: { title },
      });

      dispatch(slice.actions.getRecentPostsSuccess(response.data.recentPosts));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function userLogin(payload, checkRes) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosClient.post("/auth", payload);
      dispatch(slice.actions.loginUserSuccess(response.data.data));
      checkRes(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function userRegister(payload, checkRes) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosClient.post("auth/register", payload);
      // dispatch(slice.actions.loginUserSuccess(response.data));
      checkRes(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
