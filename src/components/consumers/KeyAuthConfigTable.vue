<template>
  <div>
    <add-key @refresh="refreshKey" ref="addKey"></add-key>
    <el-button style="float: right" size="small" type="primary" @click="addCredential">创建凭证</el-button>
    <el-table
      style="width: 100%;margin-top: 10px"
      :data="apikeys.slice((currentPage-1)*pageSize,currentPage*pageSize)">
      <el-table-column
        prop="id"
        label="id">
        <template slot-scope="scope">
          <span style="margin-left: 0px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="key"
        label="密钥">
        <template slot-scope="scope">
          <span style="margin-left: 0px">{{ scope.row.key }}</span>
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
<!--                  <el-button size="small" type="primary" @click="handleEdit(scope.$index,scope.row.id)">查看</el-button>-->
                  <el-button size="small" type="danger" @click="deleteKey(scope.$index,scope.row.id)">删除</el-button>
                </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :pager-count="5"
      :total="apikeys.length">
    </el-pagination>
  </div>
</template>

<script>
  import moment from 'moment'
  import AddKey from './AddKey'
  export default {
    name: 'KeyAuthConfigTable',
    inject: ['reload'],
    components: {AddKey},
    data () {
      return {
        apikeys: [],
        consumerId: '',
        currentPage: 1,
        pageSize: 5
      }
    },
    mounted () {
      this.consumerId = this.$route.params.consumerId
      this.loadCredential()
      // console.log(this.$route.params.consumerId)
    },
    methods: {
      sortKey (array, key) {
        return array.sort(function (a, b) {
          var x = a[key]
          var y = b[key]
          return x > y ? -1 : x < y ? 1 : 0
        });
      },
      loadCredential () {
        this.$axios.get(localStorage.address + '/consumers/' + this.consumerId + '/key-auth')
          .then((response) => {
            this.apikeys = response.data.data
            this.apikeys = this.sortKey(this.apikeys, 'created_at')
            this.apikeys.map(function (apikey) {
              let createDate = moment.unix(apikey.created_at)
              apikey.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
            })
          })
      },
      addCredential () {
        this.$refs.addKey.dialogFormVisble = true
      },
      deleteKey (index, keyId) {
        let _this = this
        let consumerId = this.$route.params.consumerId
        // console.log(consumerId)
        this.$confirm('是否删除id为【' + keyId + '】的key auth凭证？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios.delete(localStorage.address + '/consumers/' + this.consumerId + '/key-auth/' + keyId)
            .then((response) => {
              if (response && response.status === 204) {
                this.$Message.success('id为【' + keyId + '】的key auth凭证已删除')
                this.loadCredential()
              }
            })
            .catch((error) => {
              // console.log(error.response)
              this.$Message.error(error.response)
            })
        }).catch(() => {
          this.$Message.info('已取消删除')
        })
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage
      },
      refreshKey () {
        this.loadCredential()
      }
    }
  }
</script>

<style scoped>

</style>
