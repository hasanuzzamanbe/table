<template>
    <div class="container">
        <el-container>
            <el-row class="helpHeader">
                <p>Thanks for using this table, You can easily know about all features of this table from here - Hasanuzzaman</p>
                <hr>
                <el-button-group>
                    <el-button
                        type="primary"
                        @click="allTablesShow()"
                        icon="el-icon-menu"
                        size="small"
                        style="margin-bottom: 10px;"
                    >Back to All Tables</el-button>
                    <el-button
                        type="success"
                        @click="goBack()"
                        icon="el-icon-caret-left"
                        size="small"
                        style="margin-bottom: 10px;"
                    >Back to Edit</el-button>
                </el-button-group>
            </el-row>
        </el-container>
        <el-row>
            <img src="@/components/help.png" alt="help picture">
        </el-row>
    </div>
</template>
<script>
import * as firebase from "firebase";
export default {
  methods: {
    allTablesShow() {
      this.$router.push("/");
    },
    goBack() {
      window.history.back();
    }
  }
};
</script>

<style>
.helpHeader {
  margin-left: 23px;
  margin-bottom: 38px;
  padding-right: 25px;
  padding-left: 25px;
  background: #b57676;
  box-shadow: 2px 2px 2px;
}
</style>
