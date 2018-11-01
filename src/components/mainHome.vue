<template>
    <div>
        <el-container v-if="!checkTablePresent">
            <el-header>
                <span v-if="!isLoading">There is No table to show !</span>
                <span v-if="isLoading">your table is loading please wait ......</span>
            </el-header>
            <el-main>
                <img
                    v-if="isLoading"
                    src="https://loading.io/spinners/typing/lg.-text-entering-comment-loader.gif"
                    alt="loading"
                >
                <p
                    v-if="!isLoading"
                >Welcome to table creator world.It seems no table added yet. Please add a table First .</p>
            </el-main>
        </el-container>
        <el-dialog :visible.sync="modalVisible">
            <p style="height: 34px;">Add Your Table Name that you can identify later :)</p>
            <el-form @submit.prevent="tableNameSubmit">
                <span>
                    <el-input
                        id="nameOfTable"
                        v-model="nameOfTable"
                        placeholder="Enter your table name here"
                        style="margin-bottom: 15px;"
                    ></el-input>
                </span>
            </el-form>
            <el-button @click="modalVisible = false">Cancel</el-button>
            <el-button type="primary" @click="tableNameSubmit">Add Table</el-button>
        </el-dialog>
        <div class="alltable" v-if="checkTablePresent">
            <div class="head">All tables are shown here:</div>
            <div v-for="(tables,index) in allTables" :key="index" class="loopContent">
                <h3>{{tables[0]}}</h3>
                <br>
                <div class="buttonGroup">
                    <el-button type="Primary" size="mini" @click="editTable(index)">Edit</el-button>
                    <el-button type="success" size="mini" @click="previewTable(index)">Preview</el-button>
                    <el-button type="danger" size="mini" @click="deleteTable(index)">Delete</el-button>
                </div>
            </div>
        </div>
        <el-button
            type="success"
            round
            @click="modalVisible=true"
            class="plusBtn"
            title="Click To add table"
        >+</el-button>
        <el-dialog :visible.sync="deleteConfirm">
            <p>Are you sure to delete this?Ones you delete can't be undone</p>
            <el-button @click="deleteConfirm = false">Cancel</el-button>
            <el-button type="warning" @click="confirmedDelete">Confirm Delete</el-button>
        </el-dialog>
    </div>
</template>
<script>
import * as firebase from "firebase";
export default {
  props: ["ID"],
  data() {
    return {
      deleteConfirm: false,
      allTables: [],
      nameOfTable: " ",
      modalVisible: false,
      identityKey: "",
      e: ""
    };
  },
  computed: {
    checkTablePresent() {
      return this.loadedTableNameBy.length !== 0;
    },
    loadedTableNameBy() {
      return (this.allTables = this.$store.getters.loadTableNameByUser);
    },
    isLoading() {
      return this.$store.getters.loading;
    }
  },
  methods: {
    nameValidAlert() {
      this.$notify({
        title: "Warning",
        message: "Please enter a valid name",
        type: "warning"
      });
    },
    tableNameadded() {
      this.$notify.success({
        title: "Success",
        message: "Table added successfully",
        offset: 100
      });
    },
    tableDeleted() {
      this.$notify.success({
        title: "Success",
        message: "Table deleted successfully",
        offset: 100
      });
    },
    tableNameSubmit() {
      if (
        this.nameOfTable !== " " &&
        this.nameOfTable !== "name" &&
        this.nameOfTable !== undefined &&
        this.nameOfTable !== null
      ) {
        this.createTableWithName({
          tableNameByUser: this.nameOfTable
        });

        this.allTables.push([this.nameOfTable]);
        this.modalVisible = false;
        this.nameOfTable = " ";
      } else {
        this.nameValidAlert();
      }
    },
    createTableWithName(payload) {
      firebase
        .database()
        .ref()
        .push([payload.tableNameByUser])
        .then(data => {
          this.allTables[this.allTables.length - 1].push(data.key);
        });
      this.tableNameadded();
    },
    previewTable(e) {
      let tableKey = this.allTables[e][1];
      this.$store.dispatch("setValueOfKey", tableKey);
      this.$store.dispatch("previewModeOn");

      this.$router.push(/home/ + tableKey);
      this.$store.dispatch("loadTableHead", tableKey);
      this.$store.dispatch("loadTableData", tableKey);
    },
    editTable(e) {
      let tableKey = this.allTables[e][1];
      this.$store.dispatch("setValueOfKey", tableKey);
      this.$store.dispatch("previewModeOff");
      this.$router.push(/home/ + tableKey);
      this.$store.dispatch("loadTableHead", tableKey);
      this.$store.dispatch("loadTableData", tableKey);
    },
    deleteTable(e) {
      this.deleteConfirm = true;
      this.e = e;
    },
    confirmedDelete() {
      let tableKey = this.allTables[this.e][1];
      this.$store.dispatch("removeFullTable", tableKey);
      this.tableDeleted();
      this.deleteConfirm = false;
    }
  }
};
</script>
<style scope>
@media only screen and (max-width: 566px) {
  .el-button.is-round {
    margin-top: -9px;
  }
}
.alltable .head {
  height: 60px;
  line-height: 55px;
  padding-left: 80px;
  font-size: 23px;
  font-family: cursive;
}
.plusBtn {
  border-radius: 33px !important;
  font-size: 50px;
  margin-top: -28px;
  padding: 4px 16px !important;
  position: absolute;
}
.el-header {
  background-color: #6d3636;
  color: #cece69;
  font-size: 23px;
  text-align: center;
  line-height: 60px;
}
.el-main {
  border: 2px double darkred;
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 33px;
}

body > .el-container {
  margin-bottom: 40px;
}
.alltable {
  text-align: left;
  background: #966c7b;
  color: whitesmoke;
}
.buttonGroup {
  margin-top: -22px;
}
.loopContent {
  background: #5f5a6b;
  padding: 16px;
  padding-left: 78px;
  margin-bottom: 2px;
}
.el-button--mini,
.el-button--mini.is-round {
  padding: 3px 15px;
}
</style>
