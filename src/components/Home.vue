<template>
    <div>
        <el-row v-if="!previewModeCheck">
            <el-button type="primary" @click="addcolModal=true">Add column</el-button>
            <el-button type="success" @click="addDataRow">Add Data</el-button>
        </el-row>
        <!-- dialog start for adding column -->
        <el-dialog title="Adding column" :visible.sync="addcolModal">
            <el-form>
                <el-alert
                    v-if="addHeadSuccess"
                    title="success alert"
                    type="success"
                    description="Column is added. Add more?"
                    show-icon
                ></el-alert>
                <el-form-item label="column Name" required>
                    <el-input id="nameInput" v-model="headerData.name" v-on:input="createKey()"></el-input>
                </el-form-item>
                <el-form-item label="column Key " required>
                    <el-input v-model="headerData.name" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Type of column" required>
                    <el-select
                        v-model="headerData.type"
                        placeholder="Please select a type"
                        value="single"
                    >
                        <el-option label="single" value="single"></el-option>
                        <el-option label="multiple" value="multiple"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" col breakpoint" required>
                    <el-select
                        v-model="headerData.breakpoint"
                        placeholder="Please select responsive opt."
                        selected
                    >
                        <el-option label="a-s" value="a-s"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addcolModal = false">Cancel</el-button>
                <el-button type="primary" v-if="headerDataValidate() " @click="AddHeader()">Confirm</el-button>
            </span>
        </el-dialog>
        <!-- dialog end for adding column -->
        <!-- for edit modal -->
        <el-dialog title="edit modal" :visible.sync="editRowModal">
            <el-form @submit.prevent>
                <el-form-item
                    v-for="(dataRow,index) in tableEditObjArr[tableEditObjArr.length-1]"
                    :key="index"
                    :label="index"
                >
                    <span>
                        <el-input
                            id="nameInput"
                            v-model="tableEditObjArr[tableEditObjArr.length-1][index]"
                        ></el-input>
                    </span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRowModal = false">Cancel</el-button>
                <el-button type="primary" v-if="dataPresent()" @click="submitEditedRowData">Add Data</el-button>
            </span>
        </el-dialog>
        <!-- dialog start for adding data -->
        <el-dialog title="Add row data" :visible.sync="addRowModal">
            <el-form @submit.prevent="submitRowData()">
                <el-form-item v-for="(dataRow,index) in tableRowObj[0]" :key="index" :label="index">
                    <span>
                        <el-input id="nameInput" v-model="tableRowObj[0][index]"></el-input>
                    </span>
                </el-form-item>
            </el-form>
            <p v-if="!dataPresent()">You must add table head / column first.</p>
            <span slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    v-if="!dataPresent()"
                    @click="directToHeader"
                >Add Table Head</el-button>
                <el-button @click="addRowModal = false">Cancel</el-button>
                <el-button type="primary" v-if="dataPresent()" @click="submitRowData">Add Data</el-button>
            </span>
        </el-dialog>
        <img
            v-if="isLoading"
            src="https://loading.io/spinners/typing/lg.-text-entering-comment-loader.gif"
            alt="loading"
        >
        <!-- dialog ending for data -->
        <el-table style="width: 100%" :data="loadedTableData" v-if="!isLoading">
            <el-table-column
                v-for="(column, columnIndex) in loadedTableHead"
                :key="columnIndex"
                :prop="column.key"
                :label="column.name"
                width="150"
            ></el-table-column>
            <el-table-column v-if="!previewModeCheck">
                <template slot-scope="scope">
                    <el-button @click="remove(scope.row.id)" type="text" size="small">Remove</el-button>
                    <el-button @click="editData(scope.row.id)" type="text" size="small">Edit</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import * as firebase from "firebase";
export default {
  props: ["data", "ID", "loadedTabledata"],

  data() {
    return {
      editRowModal: false,
      addRowModal: false,
      addHeadSuccess: false,
      addDataModal: false,
      addcolModal: false,
      headerData: {
        name: "",
        key: "",
        type: "single",
        breakpoint: "a-s"
      },
      tableSettings: [],
      tableEditObjArr: [],
      tableEditObjArr2: [],
      tableRowObj: [],
      tableData: [],
      uniqpath: "",
      uniqId: ""
    };
  },
  computed: {
    loadedTableHead() {
      return this.$store.getters.loadedTableHead;
    },
    previewModeCheck() {
      return this.$store.getters.previewModeCheck;
    },
    loadedTableData() {
      return this.$store.getters.loadedTableData;
    },
    isLoading() {
      return this.$store.getters.loading;
    }
  },

  methods: {
    headFieldRequiredAlert() {
      this.$notify({
        title: "Warning",
        message: "Please fill all the required field",
        type: "warning"
      });
    },
    tableadded() {
      this.$notify.success({
        title: "Success",
        message: "Table Data added successfully",
        offset: 100
      });
    },
    updatedSuccessAlert() {
      this.$notify({
        title: "Success",
        message: "Data updated successfully",
        type: "success"
      });
    },
    tableheadadded() {
      this.$notify.success({
        title: "Success",
        message: "Table header added successfully",
        offset: 100
      });
    },
    createKey() {
      this.headerData.key = document.getElementById("nameInput").value;
      this.addHeadSuccess = false;
    },
    directToHeader() {
      this.addRowModal = false;
      this.addcolModal = true;
    },
    dataPresent() {
      return this.loadedTableHead.length !== 0;
    },
    remove(e) {
      this.$store.dispatch("removeTableData", { id: e, pageKey: this.ID });
    },
    editData(e) {
      this.editTableData({
        id: e,
        pageKey: this.ID
      });
    },
    editTableData(payload) {
      let path = payload.pageKey + "/" + "tableData" + "/" + payload.id;
      this.uniqpath = payload.pageKey + "/" + "tableData";
      this.uniqId = payload.id;
      //   let firebaseRef = firebase.database().ref(path);
      //   firebase
      //     .database()
      //     .ref(path)
      //     .once("value")
      //     .then(data => {
      //       this.tableEditObjArr.push(data.val());
      //       this.tableEditObjArr2.push(data.val());
      //       this.editRowModal = true;
      //     });
      // blocked------------------------

      let editableData = this.loadedTableData.find(data => {
        if (data.id === payload.id) {
          return data;
        }
      });
      this.tableEditObjArr.push(editableData);
      this.editRowModal = true;
    },

    submitEditedRowData() {
      firebase
        .database()
        .ref(this.uniqpath)
        .child(this.uniqId)
        .update(this.tableEditObjArr[this.tableEditObjArr.length - 1])
        .then(data => {
          this.editRowModal = false;
          this.updatedSuccessAlert();
        });
    },

    submitRowData() {
      this.tableData.push(this.tableRowObj[0]);
      this.$store.dispatch("tablRowData", this.tableRowObj[0]);
      this.tableRowObj = [];
      this.addDataRow();
      this.tableadded();
    },
    addDataRow() {
      var dataObj = {};
      this.loadedTableHead.forEach(elem => {
        dataObj[elem.key] = " ";
      });
      this.tableRowObj.unshift(dataObj);
      this.addRowModal = true;
    },
    headerDataValidate() {
      return this.headerData.name !== "";
    },
    AddHeader() {
      if (
        this.headerData.name !== " " &&
        this.headerData.name !== undefined &&
        this.headerData.key !== "" &&
        this.headerData.breakpoint !== null &&
        this.headerData.breakpoint !== undefined &&
        this.headerData.breakpoint !== "" &&
        this.headerData.type !== ""
      ) {
        this.tableSettings.push(this.headerData);
        this.$store.dispatch("tableHeadData", this.headerData);
        (this.headerData.name = " "),
          (this.headerData.key = " "),
          (this.addHeadSuccess = true);
        this.tableheadadded();
      } else {
        this.headFieldRequiredAlert();
      }
    }
  }
};
</script>
<style scoped>
.el-table {
  margin-left: 30px;
}
.el-table::before {
  display: none;
}
</style>
