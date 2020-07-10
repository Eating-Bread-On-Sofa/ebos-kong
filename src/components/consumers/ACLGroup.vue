<template>
  <div>
    <el-row>
      <el-col :span="12"><div></div></el-col>
      <el-col :span="12"><div style="text-align:right;position: absolute;bottom: -5px;right: 0px">
        <el-button size="small" @click="addGroup" type="primary">添加分组</el-button>
      </div></el-col>
    </el-row>
    <add-acl-group @refresh="refreshAcl" ref="addAclGroup"></add-acl-group>
    <el-row>
      <el-table
        style="width: 100%;margin-top: 10px"
        :data="groups">
        <el-table-column
          prop="id"
          label="id">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="group"
          label="分组">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.group }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="created_at"
          label="创建时间">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.createAtStr }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="operation"
          label="操作">
          <template slot-scope="scope">
                <span style="margin-left: 0px">
                  <el-button @click="deleteGroup(scope.$index,scope.row.id)" size="small" type="danger">删除</el-button>
                </span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  import moment from 'moment'
  import AddAclGroup from './AddAclGroup'
  export default {
    name: 'ACLGroup',
    inject: ['reload'],
    props: ['consumerId'],
    components: {AddAclGroup},
    data () {
      return {
        groups: []
      }
    },
    mounted () {
      this.$emit('sendConsumerId')
      // console.log(this.consumerId)
      this.loadAclGroup()
    },
    methods: {
      sortKey (array, key) {
        return array.sort(function (a, b) {
          var x = a[key]
          var y = b[key]
          return x > y ? -1 : x < y ? 1 : 0
        });
      },
      loadAclGroup () {
        this.$axios.get(localStorage.address + '/consumers/' + this.consumerId + '/acls')
          .then((response) => {
            this.groups = response.data.data
            this.groups = this.sortKey(this.groups, 'created_at')
            this.groups.map(function (group) {
              let createDate = moment.unix(group.created_at)
              group.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
            })
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
          })
      },
      addGroup () {
        this.$refs.addAclGroup.dialogFormVisble = true
      },
      deleteGroup (index, groupId) {
        let _this = this
        this.$confirm('是否删除id为【' + groupId + '】的分组？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios.delete(localStorage.address + '/consumers/' + this.consumerId + '/acls/' + groupId)
            .then((response) => {
              if (response && response.status === 204) {
                this.$Message.success('id为【' + groupId + '】的分组已删除')
                _this.loadAclGroup()
                // _this.reload()
              }
            })
        }).catch(() => {
          this.$Message.info('已取消删除')
        })
      },
      refreshAcl () {
        this.loadAclGroup()
      }
    }
  }
</script>

<style scoped>

</style>
