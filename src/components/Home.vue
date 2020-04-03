<template>
    <div class="tableEditPage">
        <div class="settingPanel" v-if="!previewModeCheck && !isLoading">
            <el-row>
                <el-button-group>
                    <el-button
                        type="primary"
                        @click="addcolModal=true"
                        icon="el-icon-plus"
                        size="mini"
                    >Add column</el-button>
                    <el-button
                        type="success"
                        @click="addDataRow"
                        icon="el-icon-plus"
                        size="mini"
                    >Add Data</el-button>
                    <el-button
                        type="success"
                        @click="headerEdit"
                        icon="el-icon-edit"
                        size="mini"
                    >Edit Header</el-button>
                    <el-button
                        type="success"
                        @click="refreshPage()"
                        icon="el-icon-refresh"
                        size="mini"
                    >Reload Page</el-button>
                    <el-button
                        type="success"
                        @click="allTablesShow()"
                        icon="el-icon-caret-right"
                        size="mini"
                    >All Table</el-button>
                    <el-button
                        type="primary"
                        @click="previewModeOn"
                        icon="el-icon-caret-right"
                        size="mini"
                    >Preview Table</el-button>
                </el-button-group>
            </el-row>
            <el-row style="margin-top: 9px; " class="function2ndRow">
                <el-tooltip placement="top">
                    <div slot="content">All previous color will
                        <br>remove & set to default
                    </div>
                    <el-button
                        type="primary"
                        @click="resetColorOfTable"
                        icon="el-icon-refresh"
                        size="mini"
                        style="margin-right: 32px;"
                    >Reset Color</el-button>
                </el-tooltip>
                <el-button-group>
                    <el-tooltip placement="top">
                        <div slot="content">click left to the button
                            <br>to change table color
                        </div>
                        <el-button type="success" size="mini">Table Color</el-button>
                    </el-tooltip>
                    <el-color-picker
                        id="div-bkgd"
                        v-model="colorOfRow"
                        show-alpha
                        :predefine="predefineColors"
                        size="mini"
                        style="margin-top: 0px;
                          position: absolute;
                          margin-left: -162px;"
                        @change="changeColor"
                    ></el-color-picker>
                    <el-tooltip placement="top">
                        <div slot="content">click right to the button
                            <br>to change font color
                        </div>
                        <el-button size="mini" type="primary">Font-color</el-button>
                    </el-tooltip>
                    <el-color-picker
                        id="div-color"
                        v-model="colorOfFont"
                        show-alpha
                        :predefine="predefineColors"
                        size="mini"
                        style="position: absolute;
                          margin-left: 0px;"
                        @change="fontColorChange"
                    ></el-color-picker>
                </el-button-group>
                <el-checkbox
                    style="margin-left: 50px;"
                    v-model="HideHead"
                    id="headShowHide"
                    @change="showHideHead"
                >Hide Table head</el-checkbox>
            </el-row>
        </div>
        <el-row v-if="!isLoading && !HideHead " class="headerRow">
            <el-col :span="12">
                <el-form
                    v-on:submit.native.prevent="searchContent"
                    v-if="(loadedTableData.length!==0)"
                >
                    <el-form-item>
                        <el-tooltip placement="top">
                            <div slot="content">Use more than 3 letters
                                <br>can make your result better
                            </div>
                            <el-input
                                @keydown.native="searchContent()"
                                id="searchBox"
                                placeholder="Type to search, Case insensitive"
                                v-model="searchText"
                                type="text"
                                style="max-width:208px;float: left;"
                                size="mini"
                            ></el-input>
                        </el-tooltip>
                        <el-button
                            id="searchButton"
                            icon="el-icon-search"
                            size="mini"
                            @click="searchContent"
                        ></el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12">
                <h3
                    style="color:black;text-align:left;
                    margin-left:12px;
                    font-family: cursive;
                    text-decoration:underline"
                    v-if="!isLoading"
                >{{this.nameOfTable}}</h3>
            </el-col>
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
            <el-checkbox
                v-model="checkedForAddMoreCol"
                style="float: left;
                 margin-top: 36px;"
            >Continue adding</el-checkbox>
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
            <img v-if="loadingAtModal" src="@/components/loader1.gif" alt="loading">
            <el-form
                @submit.native.prevent="submitEditedRowData"
                v-if="!isLoading && !loadingAtModal"
            >
                <el-form-item
                    v-for="(dataRow,index) in tableEditObjArr[tableEditObjArr.length-1]"
                    :key="index"
                    :label="index"
                    v-if="index !== 'id'  "
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
            <el-form @submit.native.prevent="submitRowData()">
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
            <el-checkbox
                v-model="checkedForAddMoreData"
                style="float: left;
                 margin-top: 36px;"
            >Continue adding</el-checkbox>
        </el-dialog>
        <!-- dialog ending for add data -->
        <img
            id="loaderImageOnBody"
            v-if="isLoading"
            src="@/components/loader1.gif"
            alt="loading"
            style="display:block; z-index:87989998"
        >
        <el-table
            style="width: 100%;margin-left: 0px;"
            :data="this.loadData"
            v-if="!isLoading"
            id="tableMain"
        >
            <el-table-column
                v-for="(column, columnIndex) in loadedTableHead"
                :key="columnIndex"
                :prop="column.key"
                :label="column.name"
                width="auto"
                min-width="150"
                sortable
            ></el-table-column>
            <el-table-column
                v-if="!previewModeCheck"
                class="settingPanel"
                fixed="right"
                label="Operations"
                min-width="150"
            >
                <template slot-scope="scope">
                    <el-button
                        @click="remove(scope.row.id)"
                        type="text"
                        size="small"
                        class="functionalButtonD"
                    >
                        <i class="el-icon-delete"></i>Delete
                    </el-button>
                    <el-button
                        @click="editData(scope.row.id)"
                        type="text"
                        size="small"
                        class="functionalButtonE"
                    >
                        <i class="el-icon-edit"></i>Edit
                    </el-button>
                    <el-button
                        @click="cloneData(scope.row.id)"
                        type="text"
                        size="small"
                        class="functionalButtonDp"
                    >Duplicate</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-if="!isLoading"
            background=""
            :current-page="currentPage"
            layout="prev, pager, next"
            :total="this.loadedTableData.length"
            @current-change="paginateValue()"
        ></el-pagination>
        <el-button-group style="margin-top: 45px;">
            <el-button
                v-if="!isLoading"
                size="mini"
                type="primary"
                @click="allTablesShow"
                icon="el-icon-menu"
                style="margin-top:18px"
            >home</el-button>
            <el-button
                v-if="!isLoading && previewModeCheck"
                size="mini"
                type="primary"
                @click="previewModeOff"
                icon="el-icon-edit"
                style="margin-top:18px"
            >edit</el-button>
            <el-button
                v-if="!isLoading && !previewModeCheck"
                size="mini"
                @click="helpPage"
                type="primary"
                icon="el-icon-info"
                style="margin-top:18px"
            >Help</el-button>
        </el-button-group>
    </div>
</template>

<script>
import * as firebase from "firebase";
export default {
  props: ["data", "ID"],

  data() {
    return {
      HideHead: false,
      loadData: [],
      currentPage: 1,
      dataCountInFirebase: 50,
      foundMatch: [],
      loadingAtModal: false,
      checkedForAddMoreData: true,
      checkedForAddMoreCol: true,
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
      uniqId: "",
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#c7158577",
        "#FFFFFF",
        "#000000",
        "#808080"
      ],
      colorOfRow: "",
      colorOfFont: ""
    };
  },
  computed: {
    nameOfTable() {
      return this.$store.getters.tableNameGeter;
    },
    loadedTableHead() {
      return (this.headerDataForEdit = this.$store.getters.loadedTableHead);
    },
    previewModeCheck() {
      return this.$store.getters.previewModeCheck;
    },
    loadedTableData: {
      get: function() {
        return (this.loadData = this.$store.getters.loadedTableData);
      }
    },
    isLoading() {
      return this.$store.getters.loading;
    }
  },
  methods: {
    showHideHead() {
      let path = this.ID + "/" + "headerStatus";
      firebase
        .database()
        .ref(path)
        .set(this.HideHead)
        .then(data => {
          this.headerStatusAlert();
        });
    },
    paginateValue(val) {
      console.log(`current page: ${this.currentPage}`);
      console.log(this);
    },
    resetColorOfTable() {
      this.colorOfRow = "rgba(255, 255, 255, 1)";
      this.colorOfFont = "rgba(0, 0, 0, 1)";
      this.fontColorChange();
      this.changeColor();
    },
    loadColorOfTable() {
      let path = this.ID + "/" + "colorOfTable";
      firebase
        .database()
        .ref(path)
        .once("value")
        .then(data => {
          this.colorOfRow = data.val();
          document.documentElement.style.setProperty("--base", this.colorOfRow);
          this.oddtableColorSet();
          this.colorOfRow;
        });
      let path1 = this.ID + "/" + "headerStatus";
      firebase
        .database()
        .ref(path1)
        .once("value")
        .then(data => {
          this.HideHead = data.val();
        });
    },
    loadFontColorOfTable() {
      let path = this.ID + "/" + "fontColorOfTable";
      firebase
        .database()
        .ref(path)
        .once("value")
        .then(data => {
          this.colorOfFont = data.val();
          document.documentElement.style.setProperty(
            "--base1",
            this.colorOfFont
          );
        });
    },
    fontColorChange(e) {
      document.documentElement.style.setProperty("--base1", this.colorOfFont);
      this.updateFontColor();
    },
    updateFontColor() {
      let path = this.ID + "/" + "fontColorOfTable";
      firebase
        .database()
        .ref(path)
        .set(this.colorOfFont)
        .then(data => {
          this.colorUpdateAlertForFont();
        });
    },
    oddtableColorSet() {
      let value = this.colorOfRow;
      const parts = value.match(/[\d.]+/g);
      if (parts.length === 3) {
        parts.push(1);
      }
      if (parts[2] < 240) {
        parts[2] = parseFloat(parts[2]) + 15;
      }
      let newColor = `rgba(${parts.join(",")})`;
      document.documentElement.style.setProperty("--base2", newColor);
    },
    changeColor() {
      document.documentElement.style.setProperty("--base", this.colorOfRow);
      this.oddtableColorSet();
      this.updateColor();
    },
    updateColor() {
      let path = this.ID + "/" + "colorOfTable";
      firebase
        .database()
        .ref(path)
        .set(this.colorOfRow)
        .then(data => {
          this.colorUpdateAlert();
        });
    },
    helpPage() {
      this.$router.push("/help");
    },
    previewModeOff() {
      this.$store.dispatch("previewModeOff");
    },
    previewModeOn() {
      this.$store.dispatch("previewModeOn");
    },
    allTablesShow() {
      this.$router.push("/");
    },
    searchContent() {
      var input, filter, table, tr, td, i, j;
      input = this.searchText;
      filter = input.toUpperCase();
      table = document.getElementById("tableMain");
      tr = table.getElementsByTagName("tr");
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
          let tdata = td[j];
          if (tdata) {
            if (tdata.innerHTML.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
              break;
            } else {
              tr[i].style.display = "none";
            }
          }
        }
      }
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

    headerStatusAlert() {
      this.$notify.success({
        title: "Success",
        message: "Table header status changed",
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
    colorUpdateAlert() {
      this.$notify({
        title: "Your Color Changed To",
        dangerouslyUseHTMLString: true,
        message: this.colorOfRow
      });
    },
    colorUpdateAlertForFont() {
      this.$notify({
        title: "Your Color Changed To",
        dangerouslyUseHTMLString: true,
        message: this.colorOfFont
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
          this.foundMatch.push(data);
          return data;
        }
      });

      let arrayOfHeader = [];
      let tableHedNew = this.loadedTableHead.find(data => {
        arrayOfHeader.push(data.key);
      });
      var arr2ofdata = [];
      let tableDatanew = this.foundMatch.find(data => {
        arr2ofdata = Object.keys(data);
      });
      this.comapringHeadWithData(arrayOfHeader, arr2ofdata, editableData);
      this.tableEditObjArr.push(editableData);
      this.editRowModal = true;
    },
    comapringHeadWithData(arr1, arr2, editableData) {
      var res = arr1.filter(function(n) {
        return !this.has(n);
      }, new Set(arr2));
      if (res.length !== 0) {
        res.forEach(newElem => {
          editableData[newElem] = "";
        });
      }
    },
    submitEditedRowData() {
      this.loadingAtModal = true;
      firebase
        .database()
        .ref(this.uniqpath)
        .child(this.uniqId)
        .update(this.tableEditObjArr[this.tableEditObjArr.length - 1])
        .then(data => {
          this.loadingAtModal = false;
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
      this.addRowModal = this.checkedForAddMoreData;
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
        this.addcolModal = this.checkedForAddMoreCol;
        this.headerData.name = "";
        this.headerData.key = "";
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
      this.headerEditModal1 = false;
      this.headerEditModal = true;
      this.editSelectedCol = this.headerDataForEdit[k];
    }
  },
  mounted: function() {
    this.$store.dispatch("loadTableHead", this.ID);
    this.$store.dispatch("loadTableData", this.ID);
    this.$store.dispatch("setValueOfKey", this.ID);
    this.loadColorOfTable();
    this.loadFontColorOfTable();
  }
};
</script>
<style>
.el-table {
  margin-left: 30px;
}
.el-table::before {
  display: none;
}
.tableEditPage {
  padding: 15px;
  margin-top: 75px;
}
div#columnForEdit {
  height: 33px;
  text-align: left;
  margin-left: 40px;
  background-color: #3fbea1;
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
.functionalButtonD:hover {
  color: #e75656;
}
.functionalButtonE:hover {
  color: #3ca91a;
}
.functionalButtonDp:hover {
  color: #0724ff;
}
.function2ndRow {
  margin-bottom: 12px;
}
.el-button--primary:hover {
  background-color: #1a62ac;
}
.el-button--success:hover {
  background-color: #4ba81d;
}
.el-table th,
.el-table tr:nth-child(odd) {
  background-color: var(--base2);
  color: var(--base1);
}
.el-table th,
.el-table tr:nth-child(even) {
  background-color: var(--base);
  color: var(--base1);
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #9ca0a561 !important;
}

:root {
  --base: rgb(248, 248, 248);
  --base1: rgb(31, 29, 29);
  --base2: rgb(248, 248, 248);
}
.functionalButtonD,
.functionalButtonE,
.functionalButtonDp {
  color: var(--base1);
}
div#div-color {
  position: absolute;
  margin-left: 27px;
}
.el-color-picker--small .el-color-picker__trigger {
  height: 35px;
  width: 32px;
  /* margin-top: 11px; */
}
button#searchButton {
  background: rgb(255, 255, 255);
  height: 28px;
  float: left;
  margin-top: 7px;
  margin-left: 4px;
  box-shadow: 2px 3px 2px;
}
input#searchBox {
  border: 1px solid var(--base);
  box-shadow: 2px 2px 2px;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: var(--base);
  color: var(--base1);
}
.headerRow {
  margin-bottom: -26px;
  border: 2px solid var(--base);
  background-color: var(--base);
}
#headShowHide {
  margin-left: 50px;
  background: #67c23a;
  padding: 4px;
  border-radius: 4px;
  color: white;
}
#headShowHide .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #822121;
  line-height: 14px;
}
.settingPanel {
  background-color: #daceced4;
  padding-top: 12px;
  padding-bottom: 4px;
  margin-bottom: 13px;
  margin-top: -35px;
  border: 1px solid darkred;
  box-shadow: 2px 4px 8px #230707;
}
@media only screen and (max-width: 900px) {
  .editModalColumnNo {
    display: none;
  }
}
@media only screen and (min-width: 650px) {
  #loaderImageOnBody {
    margin-left: 440px;
    position: absolute;
  }
}
@media only screen and (max-width: 547px) {
  .function2ndRow {
    margin-left: 112px;
  }
}
</style>
