import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import siteInfoModule from "./store/site.js";
import rankModule from "./store/rank.js";
import adminModule from "./store/admin.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    logined: false,
    checked: undefined,
    userName: undefined,
    role: undefined,
    credit: undefined,
    exp: undefined,
    dark: false,
    ad: undefined,
    currentPage: undefined,
    notification: false,
    notificationColor: "primary",
    notificationMsg: "测试文字",
    favoriteAid: [],
    favoriteMid: []
  },
  mutations: {
    showMessage(state, data) {
      state.notificationMsg = data.msg;
      state.notificationColor = data.color;
      state.notification = true;
    },

    setSiteInfo(state, info) {
      state.siteInfo = info;
    },
    setNotification(state, notification) {
      state.notification = notification;
    },
    setData(state, payload) {
      state[payload.name] = payload.data;
    },
    setUserName(state, userName) {
      state.userName = userName;
    },
    setRole(state, role) {
      state.role = role;
    },
    setDark(state) {
      state.dark = !state.dark;
    },
    setCredit(state, credit) {
      state.credit = credit;
    },
    setExp(state, exp) {
      state.exp = exp;
    },
    setFavoriteVideo(state, aidList) {
      state.favoriteAid = aidList;
    },
    addFavoriteVideo(state, aid) {
      state.favoriteAid.push(aid);
    },
    addFavoriteAuthor(state, mid) {
      state.favoriteMid.push(mid);
    },
    removeFavoriteVideo(state, aid) {
      let index = state.favoriteAid.indexOf(aid);
      state.favoriteAid.splice(index, 1);
    },
    setFavoriteAuthor(state, midList) {
      state.favoriteMid = midList;
    },
    removeFavoriteAuthor(state, mid) {
      let index = state.favoriteMid.indexOf(mid);
      state.favoriteMid.splice(index, 1);
    },
    login(state) {
      state.logined = true;
    },
    logout(state) {
      state.logined = false;
    },
    toVideo(state) {
      state.currentPage = "video";
    },
    toAuthor(state) {
      state.currentPage = "author";
    },
    toElse(state) {
      state.currentPage = "else";
    },
    checkIn(state, checkStatus) {
      state.checked = checkStatus;
    }
  },
  getters: {
    notificationState: state => {
      return state.notification;
    },
    getUserName: state => {
      return state.userName;
    },
    getRole: state => {
      return state.role;
    },
    getCredit: state => {
      return state.credit;
    },
    getExp: state => {
      return state.exp;
    },
    getLoginState: state => {
      return state.logined;
    },
    getCurrentPage: state => {
      return state.currentPage;
    },
    getFavoriteAuthor: state => {
      return state.favoriteMid;
    },
    getFavoriteVideo: state => {
      return state.favoriteAid;
    },
    getDark: state => {
      return state.dark;
    },
    getCheckStatus: state => {
      return state.checked;
    }
  },
  actions: {
    login(context) {
      axios
        .get(`/user`)
        .then(response => {
          context.commit("login");
          context.commit("setRole", response.data.role);
          context.commit("setCredit", response.data.credit);
          context.commit("setExp", response.data.exp);
          context.commit("setUserName", response.data.name);
          if (response.data.favoriteAid) {
            context.commit("setFavoriteVideo", response.data.favoriteAid);
          }
          if (response.data.favoriteMid) {
            context.commit("setFavoriteAuthor", response.data.favoriteMid);
          }
        })
        .catch(() => {
          context.commit("logout");
        });
    },
    checkIn(context) {
      context.commit("checkIn", undefined);
      axios
        .post("/user/check-in")
        .then(response => {
          if (response.data.code == 1) {
            context.commit("setCredit", response.data.data.credit);
            context.commit("setExp", response.data.data.exp);
            context.commit("checkIn", true);
            context.commit("showMessage", {
              msg: `签到成功！当前积分：${
                response.data.data.credit
              }，当前经验：${response.data.data.exp}`,
              color: "info"
            });
          } else {
            context.commit("checkIn", false);
          }
        })
        .catch(e => e.data.msg);
    },
    getAd(context) {
      axios.get("/video/ads").then(response => {
        context.commit("setData", { name: "ad", data: response.data });
      });
    }
  },
  modules: {
    site: siteInfoModule,
    admin: adminModule,
    rank: rankModule
  }
});
