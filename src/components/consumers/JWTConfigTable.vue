<template>
  <div>
    <add-j-w-t @refresh="refreshJWT" ref="addJWT"></add-j-w-t>
    <el-button style="float: right" size="small" type="primary" @click="addCredential">创建凭证</el-button>
    <el-table
      style="width: 100%;margin-top: 10px"
      :data="JWTS.slice((currentPage-1)*pageSize,currentPage*pageSize)">
      <el-table-column
        prop="id"
        label="id">
        <template slot-scope="scope">
          <span style="margin-left: 0px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="key"
        label="载荷">
        <template slot-scope="scope">
          <span style="margin-left: 0px">{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="algorithm"
        label="算法">
        <template slot-scope="scope">
          <span style="margin-left: 0px">{{ scope.row.algorithm }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rsa_public_key"
        label="RSA公钥">
        <template slot-scope="scope">
          <span style="margin-left: 0px">{{ scope.row.rsa_public_key }}</span>
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
                  <el-button size="small" type="danger" @click="deleteJWT(scope.$index,scope.row.id)">删除</el-button>
                </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :pager-count="5"
      :total="JWTS.length">
    </el-pagination>
  </div>
</template>

<script>
  import moment from 'moment'
  import AddOAuth2 from './AddOAuth2'
  import AddJWT from './AddJWT'
  export default {
    name: 'JWTConfigTable',
    inject: ['reload'],
    components: {AddJWT, AddOAuth2},
    data () {
      return {
        JWTS: [],
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
        this.$axios.get(localStorage.address + '/consumers/' + this.consumerId + '/jwt')
          .then((response) => {
            this.JWTS = response.data.data
            this.JWTS = this.sortKey(this.JWTS, 'created_at')
            this.JWTS.map(function (JWT) {
              let createDate = moment.unix(JWT.created_at)
              JWT.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
            })
          })
      },
      addCredential () {
        this.$refs.addJWT.dialogFormVisble = true
      },
      deleteJWT (index, JWTId) {
        let _this = this
        let consumerId = this.$route.params.consumerId
        // console.log(consumerId)
        this.$confirm('是否删除id为【' + JWTId + '】的JWT凭证？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios.delete(localStorage.address + '/consumers/' + this.consumerId + '/jwt/' + JWTId)
            .then((response) => {
              if (response && response.status === 204) {
                this.$Message.success('id为【' + JWTId + '】的JWT凭证已删除')
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
      refreshJWT () {
        this.loadCredential()
      }
    }
  }
</script>

<style scoped>

</style>
