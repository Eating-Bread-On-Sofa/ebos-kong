<template>
  <div>
    <el-container>
      <el-aside width="12.5%"></el-aside>
      <el-main>
        <add-consumer ref="addConsumer"></add-consumer>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px">
          <el-breadcrumb-item :to="{ path: '/info' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/consumers' }">消费者列表</el-breadcrumb-item>
          <!--          <template><el-breadcrumb-item></el-breadcrumb-item></template>-->
<!--          <add-route ref="addRouteList"></add-route>-->

        </el-breadcrumb>
        <el-row>
          <el-col :span="12"><div></div></el-col>
          <el-col :span="12"><div style="text-align:right;position: absolute;bottom: -5px;right: 50px">
            <!--@click="addService"-->
            <el-button size="small" type="primary" @click="addConsumer">添加消费者</el-button>
          </div></el-col>
        </el-row>
        <el-row>
          <el-table
            style="width: 100%;margin-top: 10px"
            :data="consumers.slice((currentPage-1)*pageSize,currentPage*pageSize)">
            <el-table-column
              prop="id"
              label="id"
              width="350px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="username"
              label="用户名"
              width="280px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.username }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="custom_id"
              label="自定义id"
              width="280px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.custom_id }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createAtStr"
              label="创建时间"
              width="220px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.createAtStr }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="operation"
              label="操作">
              <template slot-scope="scope">
                <span style="margin-left: 0px">
                  <!-- @click="handleEdit(scope.$index,scope.row.id)-->
                  <!-- @click="deleteDialog(scope.$index,scope.row.id)"-->
                  <el-button size="small" @click="editConsumer(scope.$index,scope.row.id)" type="primary">查看</el-button>
                  <el-button size="mini" @click="deleteConsumer(scope.$index,scope.row.id)" type="danger">删除</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <!--当前页数--><!--每页显示条目个数--><!--总条目数-->
        <!-- current-change	currentPage 改变时会触发。回调参数为当前页-->
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :pager-count="5"
          :total="consumers.length">
        </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  // 时间格式化工具
  import moment from 'moment'
  // import AddRoute from './AddRoute'
  import AddConsumer from './AddConsumer'
  export default {
    name: 'ConsumersList',
    inject: ['reload'],
    components: {
      AddConsumer
      // AddRoute
      // historyTab: resolve => {
      //   require(['./AddRoute'], resolve)
      // }
    },
    data () {
      return {
        currentPage: 1,
        pageSize: 6,
        consumers: []
      }
    },
    created () {
      if (!localStorage.conCurrentPage) {
        localStorage.setItem('conCurrentPage', this.currentPage)
      }
      // 如果为firstIndex为1，则讲页数置为1，否则页数为本地缓存的页数
      if (this.$store.state.conFirstIndex === 1) {
        this.currentPage = 1
      } else {
        this.currentPage = parseInt(localStorage.conCurrentPage)
      }
    },
    mounted () {
      this.loadConsumers()
    },
    methods: {
      sortKey (array, key) {
        return array.sort(function (a, b) {
          var x = a[key]
          var y = b[key]
          return x > y ? -1 : x < y ? 1 : 0
        });
      },
      loadConsumers (offset) {
        let _this = this
        let url
        if (offset) {
          url = localStorage.address + '/consumers?offset=' + offset + '&size=10'
        } else {
          url = localStorage.address + '/consumers'
        }
        this.$axios.get(url)
          .then(response => {
            // console.log(response.data.data)
            _this.consumers = response.data.data
            _this.consumers = this.sortKey(this.consumers, 'created_at')
            // console.log(_this.consumers)
            // _this.reload()
            // this.consumers = []
            // 合并数组
            // Array.prototype.push.apply(this.routes, response.data.data)
            // // console.log(this.routes)
            this.consumers.map(function (consumer) {
              let createDate = moment.unix(consumer.created_at)
              consumer.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
              // consumer.serviceName = ''
            })
          })
          .catch((error) => {
            if (error.response === undefined) {
              this.$Message.error('无法连接KONG网关~')
            } else {
              this.$Message.error(error.response.message)
            }
          })
      },
      editConsumer (index, consumerId) {
        this.$router.push('/consumers/edit/' + consumerId)
      },
      handleCurrentChange: function (currentPage) {
        if (currentPage !== 1) {
          this.$store.commit('saveConFirstIndex', 0)
        }
        this.currentPage = currentPage
        localStorage.conCurrentPage = currentPage
        // console.log(this.currentPage)
      },
      addConsumer () {
        this.$refs.addConsumer.titleName = '添加消费者'
        // this.getRoute(routeId)
        this.$refs.addConsumer.dialogFormVisble = true
      },
      deleteConsumer (index, consumerId) {
        let _this = this
        this.$confirm('是否删除id为【' + consumerId + '】的消费者？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios.delete(localStorage.address + '/consumers/' + consumerId)
            .then((response) => {
              if (response && response.status === 204) {
                this.$Message.success('id为【' + consumerId + '】的消费者已删除')
                _this.reload()
              }
            })
        }).catch(() => {
          this.$Message.info('已取消删除')
        })
      }
    }
  }
</script>

<style scoped>

</style>
