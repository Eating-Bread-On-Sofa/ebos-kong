<template>
  <div>
    <el-container>
      <el-aside width="12.5%"></el-aside>
      <el-main>
        <add-service ref="addservice"></add-service>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px">
          <el-breadcrumb-item :to="{ path: '/info' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/services' }">服务列表</el-breadcrumb-item>
<!--          <template><el-breadcrumb-item></el-breadcrumb-item></template>-->
        </el-breadcrumb>
        <el-row>
          <el-col :span="12"><div></div></el-col>
          <el-col :span="12"><div style="text-align:right;position: absolute;bottom: -5px;right: 0px">
            <el-button size="small" @click="addService" type="primary">添加服务</el-button>
          </div></el-col>
        </el-row>
        <el-row>
          <el-table
            style="width: 100%;margin-top: 10px"
            :data="services.slice((currentPage-1)*pageSize,currentPage*pageSize)">
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
              prop="host"
              label="主机名">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.host }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="创建时间">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.createAtStr }}</span>
              </template>
            </el-table-column>
<!--            <el-table-column-->
<!--              prop="proxy"-->
<!--              label="代理类型">-->
<!--              <template slot-scope="scope">-->
<!--                <span style="margin-left: 0px">{{ scope.row.proxy }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
            <el-table-column
              prop="protocol"
              label="协议">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.protocol }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="port"
              label="端口">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.port }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="updated_at"
              label="更新时间">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.updatedAtStr }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="operation"
              label="操作">
              <template slot-scope="scope">
                <span style="margin-left: 0px">
                  <el-button size="small" type="primary" @click="handleEdit(scope.$index,scope.row.id)">查看</el-button>
                  <el-button size="small" type="danger" @click="deleteDialog(scope.$index,scope.row.id)">删除</el-button>
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
          :total="services.length">
        </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  // 时间格式化工具
  import moment from 'moment'
  import AddService from './AddService'
  export default {
    name: 'ServicesList',
    components: {AddService},
    data () {
      return {
        loading: true,
        currentPage: 1,
        pageSize: 6,
        services: [],
        offset: '',
        offsetStack: [],
        isFlag: true
      }
    },
    created () {
      if (!localStorage.serCurrentPage) {
        localStorage.setItem('serCurrentPage', this.currentPage)
      }
      // 如果为firstIndex为1，则讲页数置为1，否则页数为本地缓存的页数
      if (this.$store.state.serFirstIndex === 1) {
        this.currentPage = 1
      } else {
        this.currentPage = parseInt(localStorage.serCurrentPage)
      }
    },
    mounted () {
      this.loadUpstreams()
      this.loadServices()
    },
    methods: {
      sortKey (array, key) {
        return array.sort(function (a, b) {
          var x = a[key]
          var y = b[key]
          return x > y ? -1 : x < y ? 1 : 0
        });
      },
      loadServices (offset) {
        // 说明是刷新重新加载服务数据
        // this.flag = false
        let url
        if (offset) {
          url = localStorage.address + '/services?offset=' + offset + '&size=10'
        } else {
          url = localStorage.address + '/services'
          this.offsetStack = []
          this.offset = ''
        }
        this.loading = true
        this.$axios.get(url)
          .then(response => {
            this.services = []
            // 合并数组
            Array.prototype.push.apply(this.services, response.data.data)
            // console.log(this.services)
            this.services = this.sortKey(this.services, 'created_at')
            // let upstreamsNames = localStorage.getItem('upstreamsNames').split(',')
            // let isFlag = false

            this.services.map(function (service) {
              let createDate = moment.unix(service.created_at)
              service.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
              let updatedDate = moment.unix(service.updated_at)
              service.updatedAtStr = updatedDate.format('YYYY-MM-DD HH:mm:ss')
              // for (var i = 0; i < upstreamsNames.length; i++) {
              //   if (upstreamsNames[i] === service.host) {
              //     service.proxy = '反向代理'
              //     isFlag = true
              //     break
              //   }
              // }
              // if (!isFlag) {
              //   service.proxy = '正向代理'
              // }
              // isFlag = false
            })
          })
          .catch((error) => {
            if (error.response === undefined) {
              this.$Message.error('无法连接KONG网关~')
            } else {
              this.$Message.error(error.response.message)
            }
          })
        // console.log(this.currentPage)

        },
      loadUpstreams () {
        localStorage.setItem('upstreamsNames', [])
        let _this = this
        let url = localStorage.address + '/upstreams'
        this.$axios.get(url)
          .then(response => {
            // console.log(response.data.data)
            let upstreamsNames = []
            _this.upstreams = response.data.data
            for(var i = 0; i < _this.upstreams.length; i++) {
              upstreamsNames[i] = _this.upstreams[i].name
            }
            localStorage.setItem('upstreamsNames', upstreamsNames)
            // console.log(localStorage.getItem('upstreamsNames'))
            // console.log(upstreamsNames)
            // this.upstreams.map(function (upstream) {
            //   let createDate = moment.unix(upstream.created_at)
            //   upstream.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
            //   // consumer.serviceName = ''
            // })
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
          })
      },
      handleEdit (index, serviceId) {
        let serviceName = this.services[index].name
        // console.log(serviceName)
        this.$store.commit('saveServiceName', serviceName)
        localStorage.setItem('serviceId', serviceId)
        // this.$store.commit('saveServiceId', serviceId)
        // console.log(this.$store.state.serviceId)
        this.$router.push('/services/' + serviceId)
      },
      handleCurrentChange: function (currentPage) {
        if (currentPage !== 1) {
          this.$store.commit('saveSerFirstIndex', 0)
        }
        this.currentPage = currentPage
        localStorage.serCurrentPage = currentPage
        // console.log(this.currentPage)
      },
      addService () {
        // this.$store.state.addOrEdit = 'add'
        this.$refs.addservice.dialogFormVisble = true
      },
      deleteDialog (index, serviceId) {
        let _this = this
        this.$confirm('是否删除id为【' + serviceId + '】的服务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios.delete(localStorage.address + '/services/' + serviceId)
            .then((response) => {
              if (response && response.status === 204) {
                this.$Message.success('id为【' + serviceId + '】的服务已删除')
                this.loadServices()
              }
            })
            .catch(() => {
              // console.log(error.response)
              this.$Message.error('删除失败，待删除的服务中不能包含路由，请先将路由清空')
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
