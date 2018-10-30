// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import { store } from "./store";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/en";
import "element-ui/lib/theme-chalk/index.css";
import * as firebase from "firebase";

Vue.use(ElementUI, { locale });
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    store,
    components: { App },
    template: "<App/>",
    created() {
        var firebase = require("firebase");
        firebase.initializeApp({
            apiKey: "AIzaSyCOVeoCtNs5JgGRVZKCCEkwX6LkIER5aNI",
            authDomain: "table-71bc2.firebaseapp.com",
            databaseURL: "https://table-71bc2.firebaseio.com",
            projectId: "table-71bc2",
            storageBucket: "",
            messagingSenderId: "61792409876"
        });
        this.$store.dispatch("loadTableHead");
        this.$store.dispatch("loadTableData");
        this.$store.dispatch("loadTableName");
    }
});
