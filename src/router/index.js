import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/Home.vue";
import MainHome from "@/components/mainHome.vue";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "mainHome",
            component: MainHome
        },
        {
            path: "/home",
            name: "Home",
            component: Home
        }
    ]
});
