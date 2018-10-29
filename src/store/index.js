import Vue from "vue";
import Vuex from "vuex";
import * as firebase from "firebase";

Vue.use(Vuex);
export const store = new Vuex.Store({
    state: {
        loadedTablehead: [],
        loadedTabledata: [],
        loading: false
    },
    mutations: {
        setloadedTablehead(state, payload) {
            state.loadedTablehead = payload;
        },
        setloadedTableData(state, payload) {
            payload.forEach(element => {
                state.loadedTabledata.push(element);
            });
        },
        setLoading(state, payload) {
            state.loading = payload;
        },
        removeRowData(state, payload) {
            const tableData = state.loadedTabledata.find(data => {
                return data.id === payload.id;
            });
            let index = this.state.loadedTabledata.indexOf(tableData);
            state.loadedTabledata.splice(index, 1);
        }
    },
    actions: {
        loadTableHead({ commit }) {
            firebase
                .database()
                .ref("tableHead")
                .once("value")
                .then(data => {
                    const loadedCopyTableHead = [];
                    const obj = data.val();
                    for (let key in obj) {
                        loadedCopyTableHead.push({
                            id: key,
                            name: obj[key].name,
                            key: obj[key].key,
                            type: obj[key].type,
                            breakpoint: obj[key].breakpoint
                        });
                    }
                    commit("setloadedTablehead", loadedCopyTableHead);
                });
        },
        loadTableData({ commit }) {
            commit("setLoading", true);
            firebase
                .database()
                .ref("tableData")
                .once("value")
                .then(data => {
                    const loadedCopyTableData = [];
                    const obj = data.val();
                    for (let key in obj) {
                        loadedCopyTableData.push(obj[key]);
                        let length = loadedCopyTableData.length;
                        loadedCopyTableData[length - 1].id = key;
                    }
                    commit("setloadedTableData", loadedCopyTableData);
                    commit("setLoading", false);
                });
        },

        tableHeadData({ state }, payload) {
            const headerData = {
                name: payload.name,
                key: payload.key,
                type: payload.type,
                breakpoint: payload.breakpoint
            };
            state.loadedTablehead.push(headerData);
            firebase
                .database()
                .ref("tableHead")
                .push(headerData);
        },
        tablRowData({ state }, payload) {
            state.loadedTabledata.push(payload);
            firebase
                .database()
                .ref("tableData")
                .push(payload)
                .then(data => {
                    console.log(data);
                });
        },
        removeTableData({ commit }, payload) {
            let id = "tableData" + "/" + payload.id;
            let firebaseRef = firebase.database().ref(id);
            firebaseRef.remove();
            commit("removeRowData", payload);
        }
    },

    getters: {
        loadedTableHead(state) {
            return state.loadedTablehead;
        },
        loadedTableData(state) {
            return state.loadedTabledata;
        },
        loading(state) {
            return state.loading;
        }
    }
});
