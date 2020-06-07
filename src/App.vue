<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
export default {
    name: "App"
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
#addTableModal .el-dialog {
    background: #171b1f61 !important;
    border: 2px solid white;
}
#NameEditModal .el-dialog {
    background: #171b1f61 !important;
    border: 2px solid white;
}

#deleteTableModal .el-dialog {
    background: #171b1f61 !important;
    border: 2px solid white;
}
</style>
