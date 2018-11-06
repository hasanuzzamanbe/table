import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/Home.vue";
import MainHome from "@/components/mainHome.vue";
import Help from "@/components/help.vue";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "mainHome",
            component: MainHome
        },
        {
            path: "/home/:ID",
            name: "Home",
            component: Home,
            props: true
        },
        {
            path: "/help",
            name: "Help",
            component: Help
        }
    ]
});
