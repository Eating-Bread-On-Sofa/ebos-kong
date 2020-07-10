<template>
  <div>
    <add-hmac @refresh="refreshHmac" ref="addHmac"></add-hmac>
    <el-button style="float: right" size="small" type="primary" @click="addCredential">创建凭证</el-button>
    <el-table
      style="width: 100%;margin-top: 10px"
      :data="hmacs.slice((currentPage-1)*pageSize,currentPage*pageSize)">
      <el-table-column
        prop="id"
        label="id">
        <template slot-scope="scope">
          <span style="margin-left: 0px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名">
        <template slot-scope="scope">
          <span style="margin-left: 0px">{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="secret"
        label="密钥">
        <template slot-scope="scope">
          <span style="margin-left: 0px">{{ scope.row.secret }}</span>
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
                  <el-button size="small" type="danger" @click="deleteBasic(scope.$index,scope.row.id)">删除</el-button>
                </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :pager-count="5"
      :total="hmacs.length">
    </el-pagination>
  </div>
</template>

<script>
  import moment from 'moment'
  import AddHmac from './AddHmac'
  export default {
    name: 'HMACAuthConfigTable',
    inject: ['reload'],
    components: {AddHmac},
    data () {
      return {
        hmacs: [],
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
        this.$axios.get(localStorage.address + '/consumers/' + this.consumerId + '/hmac-auth')
          .then((response) => {
            this.hmacs = response.data.data
            this.hmacs = this.sortKey(this.hmacs, 'created_at')
            this.hmacs.map(function (hmac) {
              let createDate = moment.unix(hmac.created_at)
              hmac.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
            })
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
          })
      },
      addCredential () {
        this.$refs.addHmac.dialogFormVisble = true
      },
      deleteBasic (index, hmacId) {
        let _this = this
        let consumerId = this.$route.params.consumerId
        console.log(consumerId)
        this.$confirm('是否删除id为【' + hmacId + '】的hmac auth凭证？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios.delete(localStorage.address + '/consumers/' + this.consumerId + '/hmac-auth/' + hmacId)
            .then((response) => {
              if (response && response.status === 204) {
                this.$Message.success('id为【' + hmacId + '】的hmac auth凭证已删除')
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
      refreshHmac () {
        this.loadCredential()
      }
    }
  }
</script>

<style scoped>

</style>
