<template>
    <div>
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
                    <el-select v-model="headerData.type" placeholder="Please select a type">
                        <el-option label="single" value="single" selected></el-option>
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
                <el-button type="primary" @click="AddHeader()">Confirm</el-button>
            </span>
        </el-dialog>
        <!-- dialog end for adding column -->
        <!-- dialog start for adding data -->
        <el-dialog title="Adding row" :visible.sync="addRowModal">
            <el-form>
                <el-form-item v-for="(dataRow,index) in tableRowObj[0]" :key="index" :label="index">
                    <span>
                        <el-input id="nameInput" v-model="tableRowObj[0][index]"></el-input>
                    </span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRowModal = false">Cancel</el-button>
                <el-button type="primary" @click="addRowData">Confirm</el-button>
            </span>
        </el-dialog>
        <!-- dialog ending for data -->
        <el-table style="width: 100%" :data="tableData">
            <el-table-column
                v-for="(column, columnIndex) in tableSettings"
                :key="columnIndex"
                :prop="column.key"
                :label="column.name"
                width="150"
            ></el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <el-button @click="remove" type="text" size="small">Remove</el-button>
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
        key: "first_name",
        type: "single",
        breakpoint: "a-s"
      },
      tableSettings: [],
      tableRowObj: [],
      tableData: []
    };
  },
  methods: {
    createKey() {
      this.headerData.key = document.getElementById("nameInput").value;
      this.addHeadSuccess = false;
    },
    remove() {
      console.log(this.tableRowObj);
    },
    addRowData() {
      this.tableData.push(this.tableRowObj[0]);
      this.tableRowObj = [];
    },
    addDataRow() {
      let length = this.tableSettings.length;
      var dataObj = {};
      this.tableSettings.forEach(elem => {
        dataObj[elem.key] = " ";
      });
      this.tableRowObj.unshift(dataObj);
      this.addRowModal = true;
    },
    AddHeader() {
      if (
        this.headerData.name !== "" &&
        this.headerData.key !== "" &&
        this.headerData.breakpoint !== "" &&
        this.headerData.type !== ""
      ) {
        this.tableSettings.push(this.headerData);
        this.headerData = {};
        this.addHeadSuccess = true;
      } else {
        alert("please fill all the required");
      }
    }
  }
};
</script>