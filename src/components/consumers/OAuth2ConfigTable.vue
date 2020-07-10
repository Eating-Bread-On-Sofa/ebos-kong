<template>
  <div>
    <add-o-auth2 @refresh="refreshOauth2" ref="addOauth2"></add-o-auth2>
    <el-button style="float: right" size="small" type="primary" @click="addCredential">创建凭证</el-button>
    <el-table
      style="width: 100%;margin-top: 10px"
      :data="OAuths.slice((currentPage-1)*pageSize,currentPage*pageSize)">
      <el-table-column
        prop="id"
        label="id">
        <template slot-scope="scope">
          <span style="margin-left: 0px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称">
        <template slot-scope="scope">
          <span style="margin-left: 0px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="client_id"
        label="客户端id">
        <template slot-scope="scope">
          <span style="margin-left: 0px">{{ scope.row.client_id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="client_secret"
        label="客户端密钥">
        <template slot-scope="scope">
          <span style="margin-left: 0px">{{ scope.row.client_secret }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="redirect_uris"
        label="重定向URI">
        <template slot-scope="scope">
          <span style="margin-left: 0px">{{ scope.row.redirect_uris }}</span>
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
                  <el-button size="small" type="danger" @click="deleteOauth(scope.$index,scope.row.id)">删除</el-button>
                </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :pager-count="5"
      :total="OAuths.length">
    </el-pagination>
  </div>
</template>

<script>
  import moment from 'moment'
  import AddOAuth2 from './AddOAuth2'
  export default {
    name: 'OAuth2ConfigTable',
    inject: ['reload'],
    components: {AddOAuth2},
    data () {
      return {
        OAuths: [],
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
        this.$axios.get(localStorage.address + '/consumers/' + this.consumerId + '/oauth2')
          .then((response) => {
            this.OAuths = response.data.data
            this.OAuths = this.sortKey(this.OAuths, 'created_at')
            this.OAuths.map(function (OAuth) {
              let createDate = moment.unix(OAuth.created_at)
              OAuth.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
            })
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
          })
      },
      addCredential () {
        this.$refs.addOauth2.dialogFormVisble = true
      },
      deleteOauth (index, oauthId) {
        let _this = this
        let consumerId = this.$route.params.consumerId
        console.log(consumerId)
        this.$confirm('是否删除id为【' + oauthId + '】的hmac auth凭证？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios.delete(localStorage.address + '/consumers/' + this.consumerId + '/oauth2/' + oauthId)
            .then((response) => {
              if (response && response.status === 204) {
                this.$Message.success('id为【' + oauthId + '】的hmac auth凭证已删除')
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
      refreshOauth2 () {
        this.loadCredential()
      }
    }
  }
</script>

<style scoped>

</style>
