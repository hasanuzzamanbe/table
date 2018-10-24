<template>
    <div>
        <el-row>
            <el-button type="primary" @click="addcolModal=true">Add column</el-button>
            <el-button type="success">Add Data</el-button>
        </el-row>
        <!-- dialog start for adding column -->
        <el-dialog title="Adding column" :visible.sync="addcolModal">
            <el-form>
                <el-form-item label="column Name">
                    <el-input v-model="tableSettings.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="column Key ">
                    <el-input v-model="tableSettings.key" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Type of column">
                    <el-select v-model="tableSettings.type" placeholder="Please select a type">
                        <el-option label="single" value="single"></el-option>
                        <el-option label="multiple" value="multiple"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" col breakpoint">
                    <el-select
                        v-model="tableSettings.breakpoint"
                        placeholder="Please select responsive opt."
                    >
                        <el-option label="a-s" value="a-s"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addcolModal = false">Cancel</el-button>
                <el-button type="primary" @click="addcolModal = false">Confirm</el-button>
            </span>
        </el-dialog>
        <!-- dialog end for adding column -->
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
      addDataModal: false,
      addcolModal: false,
      tableSettings: [
        {
          name: "First Name",
          key: "first_name",
          type: "single",
          breakpoint: "a-s"
        },
        {
          name: "Last Name",
          key: "last_name",
          type: "single",
          breakpoint: "a-s"
        },
        {
          name: "Age",
          key: "age",
          type: "single",
          breakpoint: "a-s"
        }
      ],
      tableData: [
        {
          first_name: "Shourov",
          last_name: "Talukdar",
          age: "23"
        },
        {
          first_name: "Mark",
          last_name: "Tomy",
          age: "23"
        },
        {
          first_name: "Shourovi",
          last_name: "Barsa",
          age: "23"
        },
        {
          first_name: "Shourovi",
          last_name: "Barsa",
          age: "23"
        }
      ]
    };
  },
  methods: {
    remove() {
      console.log(this);
    }
  }
};
</script>