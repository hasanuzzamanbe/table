<template>
  <div style="width: 900px;">
    <el-table
      :data="[]">
      <el-table-column
        v-for="(column, columnIndex) in tableSettings" :key="columnIndex"
        :prop="column.key"
        :label="column.name"
        width="180">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tableSettings: [
        {
            name: 'First Name',
            key: 'first_name',
            type: 'single',
            breakpoint: 'a-s'
        },
        {
            name: 'Last Name',
            key: 'last_name',
            type: 'single',
            breakpoint: 'a-s'
        },
        {
            name: 'Age',
            key: 'age',
            type: 'single',
            breakpoint: 'a-s'
        }
      ]
      }
    },
    methods: {
      
    }
  }
</script>