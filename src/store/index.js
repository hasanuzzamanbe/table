import Vue from "vue";
import Vuex from "vuex";
import * as firebase from "firebase";

Vue.use(Vuex);
export const store = new Vuex.Store({
    state: {
        loadedTablehead: [],
        loadedTabledata: []
    },
    mutations: {
        setloadedTablehead(state, payload) {
            state.loadedTablehead = payload;
        },
        setloadedTableData(state, payload) {
            payload.forEach(element => {
                state.loadedTabledata.push(element);
            });
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
            firebase
                .database()
                .ref("tableData")
                .once("value")
                .then(data => {
                    const loadedCopyTableData = [];
                    const obj = data.val();
                    for (let key in obj) {
                        loadedCopyTableData.push(obj[key]);
                    }
                    commit("setloadedTableData", loadedCopyTableData);
                    // console.log(loadedCopyTableData);
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
                .push(headerData)
                .then(data => {
                    console.log(data);
                });
            console.log(state.loadedTablehead);
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
        }
    },

    getters: {
        loadedTableHead(state) {
            return state.loadedTablehead;
        },
        loadedTableData(state) {
            return state.loadedTabledata;
        }
    }
});
