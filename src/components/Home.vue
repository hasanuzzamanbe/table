<template>
    <div class="tableEditPage">
        <el-row v-if="!previewModeCheck && !isLoading">
            <el-button
                type="primary"
                @click="addcolModal=true"
                icon="el-icon-plus"
                size="small"
            >Add column</el-button>
            <el-button type="success" @click="addDataRow" icon="el-icon-plus" size="small">Add Data</el-button>
            <el-button
                type="success"
                @click="headerEdit"
                icon="el-icon-edit"
                size="small"
            >Edit Header</el-button>
            <el-button
                type="success"
                @click="refreshPage()"
                icon="el-icon-caret-right"
                size="small"
            >Reload Page</el-button>
            <el-button
                type="success"
                @click="allTablesShow()"
                icon="el-icon-caret-right"
                size="small"
            >All Table</el-button>
        </el-row>
        <el-row v-if="!isLoading">
            <el-form v-on:submit.native.prevent="searchContent">
                <el-form-item>
                    <el-input
                        @keydown.native="searchContent()"
                        id="searchBox"
                        placeholder="Type to search"
                        v-model="searchText"
                        type="text"
                        style="max-width:188px;float:right;"
                        size="mini"
                    ></el-input>
                    <el-button
                        id="searchButton"
                        type="primary"
                        icon="el-icon-search"
                        size="mini"
                        style="float: right;
                         position: inherit;
                         margin-top:6px;
                         margin-right:-4px;
                         "
                        @click="searchContent"
                    ></el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <!-- dialog start for adding column -->
        <el-dialog title="Adding column" :visible.sync="addcolModal">
            <el-form>
                <el-form-item label="column Name" required>
                    <el-input id="nameInput" v-model="headerData.name" v-on:input="createKey()"></el-input>
                </el-form-item>
                <el-form-item label="column Key " required>
                    <el-input v-model="headerData.key" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Type of column">
                    <el-select
                        v-model="headerData.type"
                        placeholder="Please select a type"
                        value="single"
                    >
                        <el-option label="single" value="single"></el-option>
                        <el-option label="multiple" value="multiple"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" col breakpoint">
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
        <!-- dialog for edit column first stage   -->
        <el-dialog title="Edit column" :visible.sync="headerEditModal1">
            <div id="columnForEdit" v-for="(item,k) in hederDataEditName" :key="k">
                {{item}}
                <span
                    class="editModalColumnNo"
                    style="font-size:12px !important"
                >(This is column no: {{k+1}})</span>
                <el-button type="warning" @click="editColumnName(k)" size="mini">
                    <i class="el-icon-edit">Edit</i>
                </el-button>
            </div>
        </el-dialog>
        <!--end dialog for edited column first stage -->
        <!-- start dialog for editing column -->
        <el-dialog title="Edit column" :visible.sync="headerEditModal">
            <el-form>
                <el-form-item label="column Name" required>
                    <el-input id="nameInput" v-model="editSelectedCol.name"></el-input>
                </el-form-item>
                <el-form-item label="column Key " required>
                    <el-input v-model="editSelectedCol.key" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Type of column">
                    <el-select
                        v-model="editSelectedCol.type"
                        placeholder="Please select a type"
                        value="single"
                    >
                        <el-option label="single" value="single"></el-option>
                        <el-option label="multiple" value="multiple"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" col breakpoint">
                    <el-select
                        v-model="editSelectedCol.breakpoint"
                        placeholder="Please select responsive opt."
                        selected
                    >
                        <el-option label="a-s" value="a-s"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="headerEditModal = false">Cancel</el-button>
                <el-button
                    type="primary"
                    v-if="headerEditDataValidate() "
                    @click="submitEditedColumn()"
                >Update</el-button>
            </span>
        </el-dialog>
        <!-- end of editing column modal -->
        <!--start of edit row/ for edit modal -->
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
                <el-button
                    type="primary"
                    v-if="dataPresent()"
                    @click="submitEditedRowData"
                >update Data</el-button>
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
            <el-table-column
                v-if="!previewModeCheck"
                class="settingPanel"
                fixed="right"
                label="Operations"
            >
                <template slot-scope="scope">
                    <el-button @click="remove(scope.row.id)" type="text" size="small">
                        <i class="el-icon-delete"></i>Remove
                    </el-button>
                    <el-button @click="editData(scope.row.id)" type="text" size="small">
                        <i class="el-icon-edit"></i>Edit
                    </el-button>
                    <el-button @click="cloneData(scope.row.id)" type="text" size="small">Clone Data</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button
            v-if="!isLoading"
            size="mini"
            type="primary"
            @click="allTablesShow"
            icon="el-icon-arrow-left"
            style="margin-top:18px"
        >Back to home</el-button>
        <!-- search start -->
        <el-dialog :visible.sync="searchModal">
            <div v-if="!searchTextPresent">
                <img src="http://www.nathdwaramart.com/nodata.jpg" alt="">
                <p>There is no data match... you can try with more precise text</p>
                <p>Note: seach item is not case sensitive</p>
            </div>
            <el-table style="margin-left: 10px;" :data="searchVal" v-if="searchTextPresent">
                <el-table-column
                    v-for="(column, columnIndex) in loadedTableHead"
                    :key="columnIndex"
                    :prop="column.key"
                    :label="column.name"
                    width="150"
                ></el-table-column>
                <el-table-column class="settingPanel" fixed="right" label="Operations">
                    <template slot-scope="scope">
                        <el-button @click="remove(scope.row.id)" type="text" size="small">
                            <i class="el-icon-delete"></i>Remove
                        </el-button>
                        <el-button @click="editData(scope.row.id)" type="text" size="small">
                            <i class="el-icon-edit"></i>Edit
                        </el-button>
                        <el-button
                            @click="cloneData(scope.row.id)"
                            type="text"
                            size="small"
                        >Clone Data</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- search end -->
    </div>
</template>

<script>
import * as firebase from "firebase";
export default {
  props: ["data", "ID", "loadedTabledata"],

  data() {
    return {
      searchVal: [],
      searchModal: false,
      searchText: "",
      hederDataEditName: [],
      headerDataForEdit: "",
      editSelectedCol: [],
      editRowModal: false,
      addRowModal: false,
      addDataModal: false,
      addcolModal: false,
      headerEditModal: false,
      headerEditModal1: false,
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
      return (this.headerDataForEdit = this.$store.getters.loadedTableHead);
    },
    previewModeCheck() {
      return this.$store.getters.previewModeCheck;
    },
    loadedTableData() {
      return this.$store.getters.loadedTableData;
    },
    isLoading() {
      return this.$store.getters.loading;
    },
    searchTextPresent() {
      return this.searchText.length !== 0;
    }
  },
  methods: {
    allTablesShow() {
      this.$router.push("/");
    },
    searchContent() {
      let length = this.searchText.length;
      let getSearchVal = [];
      this.searchVal = [];
      this.loadedTableData.forEach(data => {
        for (let k in data) {
          if (
            data[k]
              .replace(/ /g, "")
              .toUpperCase()
              .substring(0, length) ==
            this.searchText.replace(/ /g, "").toUpperCase()
          ) {
            getSearchVal.push(data);
          }
        }
      });
      this.searchVal = getSearchVal;
      if (getSearchVal.length === 0) {
        this.searchModal = false;
        this.searchVal = [];
        getSearchVal = [];
      }
      if (getSearchVal.length !== 0) {
        this.searchModal = true;
      } else {
        this.SearchAlert();
      }
    },
    SearchAlert() {
      this.$message({
        showClose: true,
        message: "Warning, No Data Found.",
        type: "warning"
      });
    },
    headFieldRequiredAlert() {
      this.$notify({
        title: "Warning",
        message: "Please fill Name & chose an unique key",
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
    rowDeletedAlert() {
      this.$notify.success({
        title: "Success",
        message: "Table Data deleted successfully",
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
      this.rowDeletedAlert();
    },
    cloneData(e) {
      this.$store.dispatch("cloneTableData", { id: e, pageKey: this.ID });
    },
    editData(e) {
      this.editTableData({
        id: e,
        pageKey: this.ID
      });
    },
    pageReloadBug() {
      this.$alert("Please Reload this page", "Title", {
        confirmButtonText: "OK",
        callback: action => {
          this.$message({
            type: "info",
            message: `action: ${action}`
          });
        }
      });
    },
    refreshPage: function() {
      window.location.reload();
    },
    editTableData(payload) {
      let path = payload.pageKey + "/" + "tableData" + "/" + payload.id;
      this.uniqpath = payload.pageKey + "/" + "tableData";
      this.uniqId = payload.id;
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
    headerEditDataValidate() {
      return this.editSelectedCol.name !== "";
    },

    AddHeader() {
      var keyIsMatch = false;
      var columnKey = this.headerData.key;
      var secureKey = Math.floor(1000 + Math.random() * 9000);
      var copyTableHead = [];
      this.loadedTableHead.forEach(elem => {
        if (elem.key === this.headerData.key) {
          keyIsMatch = true;
          this.headerData.key = columnKey + secureKey;
        }
      });
      if (this.headerData.key === "id") {
        this.headerData.key = "id_";
      }

      if (
        this.headerData.name !== " " &&
        this.headerData.name !== undefined &&
        this.headerData.key !== "" &&
        this.headerData.breakpoint !== null &&
        this.headerData.breakpoint !== undefined &&
        this.headerData.breakpoint !== "" &&
        this.headerData.type !== "" &&
        keyIsMatch === false
      ) {
        this.tableSettings.push(this.headerData);
        this.$store.dispatch("tableHeadData", this.headerData);
        (this.headerData.name = ""),
          (this.headerData.key = ""),
          this.tableheadadded();
      } else {
        this.headFieldRequiredAlert();
      }
    },
    headerEdit() {
      var columnAvailable = [];
      this.headerDataForEdit.forEach(objElem => {
        columnAvailable.push(objElem.name);
      });
      this.hederDataEditName = columnAvailable;
      this.headerEditModal1 = true;
    },
    submitEditedColumn() {
      if (this.editSelectedCol.id) {
        let pageId = this.ID;
        let headDataId = this.editSelectedCol.id;
        let path = pageId + "/" + "tableHead";
        firebase
          .database()
          .ref(path)
          .child(headDataId)
          .update(this.editSelectedCol)
          .then(data => {
            this.headerEditModal = false;
            this.updatedSuccessAlert();
          });
      } else {
        this.headerEditModal = false;
        this.pageReloadBug();
      }
    },
    editColumnName(k) {
      //   this.headerDataForEdit = this.$store.getters.loadedTableHead;
      this.headerEditModal1 = false;
      this.headerEditModal = true;
      this.editSelectedCol = this.headerDataForEdit[k];
    }
  },
  mounted: function() {
    this.$store.dispatch("loadTableHead", this.ID);
    this.$store.dispatch("loadTableData", this.ID);
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
.tableEditPage {
  margin-top: 75px;
}
div#columnForEdit {
  height: 33px;
  text-align: left;
  margin-left: 40px;
  background-color: #698c57;
  margin-bottom: 16px;
  color: white;
  padding-left: 45px;
  line-height: 32px;
  font-size: 2vw;
}
div#columnForEdit button {
  margin-right: 26px;
  float: left;
  margin-top: 2px;
  font-size: 14px;
}
@media only screen and (max-width: 900px) {
  .editModalColumnNo {
    display: none;
  }
}
/* //// */
/* input#searchBox {
  max-width: 256px !important;
  float: right !important;
  background: #ce8686;
} */
</style>
