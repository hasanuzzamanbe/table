import Vue from "vue";
import Vuex from "vuex";
import * as firebase from "firebase";

Vue.use(Vuex);
export const store = new Vuex.Store({
    state: {
        loadedTablehead: [],
        loadedTabledata: [],
        loadedTableName: [],
        tableIdentityVal: "",
        previewMode: true,
        loading: false
    },
    mutations: {
        setloadedTablehead(state, payload) {
            state.loadedTablehead = payload;
        },
        setloadedTableData(state, payload) {
            state.loadedTabledata = [];
            payload.forEach(element => {
                state.loadedTabledata.push(element);
            });
        },
        setloadedTableName(state, payload) {
            payload.forEach(element => {
                state.loadedTableName.push([element[1][0], element[0]]);
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
        },
        removeFullTableLocaly(state, payload) {
            const table = state.loadedTableName.find(data => {
                return data.id === payload.id;
            });
            let index = this.state.loadedTableName.indexOf(table);
            state.loadedTableName.splice(index, 1);
        }
    },
    actions: {
        loadTableHead({ commit }, payload) {
            var path = payload + "/" + "tableHead";
            firebase
                .database()
                .ref(path)
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
        loadTableData({ commit }, payload) {
            commit("setLoading", true);
            var path = payload + "/" + "tableData";
            firebase
                .database()
                .ref(path)
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
        loadTableName({ commit }, payload) {
            commit("setLoading", true);
            firebase
                .database()
                .ref()
                .once("value")
                .then(data => {
                    var tablesWithNameId = data.val();
                    var arrOfTableMaster = [];
                    var getName = Object.entries(tablesWithNameId);
                    getName.forEach(arrNameId => {
                        arrOfTableMaster.push(arrNameId);
                    });
                    commit("setLoading", false);
                    commit("setloadedTableName", arrOfTableMaster);
                });
        },
        setValueOfKey({ state }, payload) {
            state.tableIdentityVal = payload;
        },
        previewModeOn({ state }, payload) {
            state.previewMode = true;
        },
        previewModeOff({ state }, payload) {
            state.previewMode = false;
        },
        tableHeadData({ state }, payload) {
            const headerData = {
                name: payload.name,
                key: payload.key,
                type: payload.type,
                breakpoint: payload.breakpoint
            };
            state.loadedTablehead.push(headerData);
            var idntityKey = state.tableIdentityVal;
            var path = idntityKey + "/" + "tableHead";
            firebase
                .database()
                .ref(path)
                .push(headerData);
            console.log(path);
        },
        tablRowData({ state }, payload) {
            state.loadedTabledata.push(payload);
            var idntityKey = state.tableIdentityVal;
            var path = idntityKey + "/" + "tableData";
            firebase
                .database()
                .ref(path)
                .push(payload)
                .then(data => {
                    // console.log(data);
                });
        },
        removeTableData({ commit }, payload) {
            let id = payload.pageKey + "/" + "tableData" + "/" + payload.id;
            let firebaseRef = firebase.database().ref(id);
            firebaseRef.remove();
            commit("removeRowData", payload);
        },
        removeFullTable({ commit }, payload) {
            let id = payload;
            let firebaseRef = firebase.database().ref(id);
            firebaseRef.remove();
            commit("removeFullTableLocaly", payload);
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
        },
        loadTableNameByUser(state) {
            return state.loadedTableName;
        },
        previewModeCheck(state) {
            return state.previewMode;
        }
    }
});
