<template>
    <div>
      <add-basic @refresh="refreshBasic" ref="addBasic"></add-basic>
      <el-button style="float: right" size="small" type="primary" @click="addCredential">创建凭证</el-button>
      <el-table
        style="width: 100%;margin-top: 10px"
        :data="basics.slice((currentPage-1)*pageSize,currentPage*pageSize)">
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
          prop="password"
          label="密码">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.password }}</span>
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
      <!--当前页数--><!--每页显示条目个数--><!--总条目数-->
      <!-- current-change	currentPage 改变时会触发。回调参数为当前页-->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :pager-count="5"
        :total="basics.length">
      </el-pagination>
    </div>
</template>

<script>
  import moment from 'moment'
  import AddBasic from './AddBasic'
  export default {
    name: 'BasicAuthConfigTable',
    inject: ['reload'],
    components: {AddBasic},
    data () {
      return {
        basics: [],
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
        this.$axios.get(localStorage.address + '/consumers/' + this.consumerId + '/basic-auth')
          .then((response) => {
            this.basics = response.data.data
            this.basics = this.sortKey(this.basics, 'created_at')
            this.basics.map(function (basic) {
              let createDate = moment.unix(basic.created_at)
              basic.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
            })
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
          })
      },
      addCredential () {
        this.$refs.addBasic.dialogFormVisble = true
      },
      deleteBasic (index, basicId) {
        let _this = this
        let consumerId = this.$route.params.consumerId
        console.log(consumerId)
        this.$confirm('是否删除id为【' + basicId + '】的basic auth凭证？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios.delete(localStorage.address + '/consumers/' + this.consumerId + '/basic-auth/' + basicId)
            .then((response) => {
              if (response && response.status === 204) {
                this.$Message.success('id为【' + basicId + '】的basic auth凭证已删除')
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
      refreshBasic () {
        this.loadCredential()
      }
    }
  }
</script>

<style scoped>

</style>
