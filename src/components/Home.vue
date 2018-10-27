<template>
    <div>
        <img
            src="https://loading.io/spinners/typing/lg.-text-entering-comment-loader.gif"
            alt="loading"
        >
        <el-row>
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
        <!-- dialog ending for data -->
        <el-table style="width: 100%" :data="loadedTableData">
            <el-table-column
                v-for="(column, columnIndex) in loadedTableHead"
                :key="columnIndex"
                :prop="column.key"
                :label="column.name"
                width="150"
            ></el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <el-button @click="remove(this)" type="text" size="small">Remove</el-button>
                    <el-button type="text" size="small">Edit</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  data() {
    return {
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
      copyheaderData: {
        name: "",
        key: "",
        type: "single",
        breakpoint: "a-s"
      },
      tableSettings: [],
      tableRowObj: [],
      tableData: []
    };
  },
  computed: {
    loadedTableHead() {
      return this.$store.getters.loadedTableHead;
    },
    loadedTableData() {
      return this.$store.getters.loadedTableData;
    }
  },
  methods: {
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
    remove() {
      //   this.tableData.splice(columnIndex - 1, 1);
      console.log(this);
    },
    submitRowData() {
      this.tableData.push(this.tableRowObj[0]);
      this.$store.dispatch("tablRowData", this.tableRowObj[0]);
      this.tableRowObj = [];
      this.addDataRow();
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
        this.headerData.name !== "" &&
        this.headerData.key !== "" &&
        this.headerData.breakpoint !== null &&
        this.headerData.breakpoint !== undefined &&
        this.headerData.breakpoint !== "" &&
        this.headerData.type !== ""
      ) {
        this.tableSettings.push(this.headerData);
        this.$store.dispatch("tableHeadData", this.headerData);
        this.headerData = {};
        this.copyheaderData = this.headerData;
        this.addHeadSuccess = true;
      } else {
        alert("please fill all the required");
      }
    }
  }
};
</script>