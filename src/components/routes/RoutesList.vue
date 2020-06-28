<template>
  <div>
    <el-container>
      <el-aside width="12.5%"></el-aside>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px">
          <el-breadcrumb-item :to="{ path: '/info' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/routes' }">路由列表</el-breadcrumb-item>
          <!--          <template><el-breadcrumb-item></el-breadcrumb-item></template>-->
          <add-route ref="addRouteList"></add-route>
        </el-breadcrumb>
        <el-row>
          <el-col :span="12"><div></div></el-col>
          <el-col :span="12"><div style="text-align:right;position: absolute;bottom: -5px;right: 0px">
            <!--@click="addService"-->
<!--            <el-button size="small" type="primary" @click="addRoute">添加路由</el-button>-->
          </div></el-col>
        </el-row>
        <el-row>
          <el-table
            style="width: 100%;margin-top: 10px"
            :data="routes.slice((currentPage-1)*pageSize,currentPage*pageSize)">
            <el-table-column
              prop="id"
              label="id"
              width="120px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              width="100px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="service"
              label="所属服务">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.serviceName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="hosts"
              label="主机名"
              width="135px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.hosts }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="paths"
              label="路径"
              width="130px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.paths }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="methods"
              label="请求方式"
              width="130px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.methods }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="创建时间"
              width="100px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.createAtStr }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="protocols"
              label="协议"
              width="120px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.protocols }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="operation"
              label="操作">
              <template slot-scope="scope">
                <span style="margin-left: 0px">
                  <!-- @click="handleEdit(scope.$index,scope.row.id)-->
                  <!-- @click="deleteDialog(scope.$index,scope.row.id)"-->
                  <el-button size="mini" @click="addRoute(scope.$index,scope.row.id)" type="primary">查看</el-button>
                  <el-button size="mini" @click="listPlugin(scope.$index,scope.row.id)"  type="success">插件</el-button>
                  <el-button size="mini" @click="deleteRoute(scope.$index,scope.row.id)" type="danger">删除</el-button>
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
          :total="routes.length">
        </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  // 时间格式化工具
  import moment from 'moment'
  import AddRoute from './AddRoute'
  export default {
    name: 'RoutesList',
    inject: ['reload'],
    components: {
      AddRoute
      // historyTab: resolve => {
      //   require(['./AddRoute'], resolve)
      // }
    },
      data () {
        return {
          loading: true,
          currentPage: 1,
          pageSize: 6,
          routes: []
        }
      },
      created () {
        if (!localStorage.rouCurrentPage) {
          localStorage.setItem('rouCurrentPage', this.currentPage)
        }
        // 如果为firstIndex为1，则讲页数置为1，否则页数为本地缓存的页数
        if (this.$store.state.rouFirstIndex === 1) {
          this.currentPage = 1
        } else {
          this.currentPage = parseInt(localStorage.rouCurrentPage)
        }
      },
      mounted () {
        this.loadRoutes()
      },
      methods: {
        sortKey (array, key) {
          return array.sort(function (a, b) {
            var x = a[key]
            var y = b[key]
            return x > y ? -1 : x < y ? 1 : 0
          });
        },
        loadRoutes (offset) {
          let _this = this
          let url
          if (offset) {
            url = localStorage.address + '/routes?offset=' + offset + '&size=10'
          } else {
            url = localStorage.address + '/routes'
          }
          this.loading = true
          this.$axios.get(url)
            .then(response => {
              this.routes = []
              // 合并数组
              Array.prototype.push.apply(this.routes, response.data.data)
              this.routes = this.sortKey(this.routes, 'created_at')
              // console.log(this.routes)
              this.routes.map(function (route) {
                let createDate = moment.unix(route.created_at)
                route.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
                route.serviceName = ''
              })
              // console.log(this.routes)
              for (var i = 0; i < this.routes.length; i++) {
                let j = i
                let serviceId = this.routes[j].service.id
                _this.$axios.get(localStorage.address + '/services/' + serviceId)
                  .then(response => {
                    if (response && response.status === 200) {
                      let serviceName = response.data.name
                      _this.routes[j].serviceName = serviceName
                    }
                  })
                let hosts = this.routes[j].hosts
                if (hosts === null || hosts.length === 0) {
                  this.routes[j].hosts = 'localhost'
                }
              }
              this.loading = false
            })
            .catch((error) => {
              if (error.response === undefined) {
                this.$Message.error('无法连接KONG网关~')
              } else {
                this.$Message.error(error.response.message)
              }
            })
        },
        // handleEdit (index, serviceId) {
        //   let serviceName = this.services[index].name
        //   // console.log(serviceName)
        //   this.$store.commit('saveServiceName', serviceName)
        //   // this.$store.commit('saveServiceId', serviceId)
        //   // console.log(this.$store.state.serviceId)
        //   this.$router.push('/services/' + serviceId)
        // },
        handleCurrentChange: function (currentPage) {
          if (currentPage !== 1) {
            this.$store.commit('saveRouFirstIndex', 0)
          }
          this.currentPage = currentPage
          localStorage.rouCurrentPage = currentPage
          // console.log(this.currentPage)
        },
        addRoute (index, routeId) {
          this.$refs.addRouteList.titleName = '修改路由'
          this.getRoute(routeId)
          this.$refs.addRouteList.dialogFormVisble = true
        },
        // 当进行修改服务时，调用此方法获取到服务信息并回显
        getRoute (routeId) {
          this.$axios.get(localStorage.address + '/routes/' + routeId)
            .then(resp => {
              // console.log(resp.data)
              let formData = this.$refs.addRouteList.formData
              formData.name = resp.data.name === null ? '' : resp.data.name
              formData.protocols = resp.data.protocols
              formData.methods = resp.data.methods === null ? [] : resp.data.methods
              formData.hosts = resp.data.hosts === null ? '' : resp.data.hosts
              formData.paths = resp.data.paths === null ? '' : resp.data.paths
              formData.regex_priority = resp.data.regex_priority
              formData.strip_path = resp.data.strip_path
              formData.preserve_host = resp.data.preserve_host
              formData.snis = resp.data.snis
              formData.sources = resp.data.sources
              formData.destinations = resp.data.destinations
              this.$refs.addRouteList.routeId = resp.data.id
              this.$refs.addRouteList.formData.service.id = resp.data.service.id
              // localStorage.setItem('serviceId', resp.data.service.id)
              // console.log(localStorage.getItem('serviceId'))
              // console.log(this.$refs.addRoute.routeId)
              // console.log(formData)
            })
        },
        deleteRoute (index, routeId) {
          let _this = this
          this.$confirm('是否删除id为【' + routeId + '】的路由？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.$axios.delete(localStorage.address + '/routes/' + routeId)
              .then((response) => {
                if (response && response.status === 204) {
                  this.$Message.success('id为【' + routeId + '】的路由已删除')
                  _this.reload()
                }
              })
          }).catch(() => {
            this.$Message.info('已取消删除')
          })
        },
        listPlugin (index, routeId) {
          this.$router.push('/plugins/' + routeId)
        }
        // addService () {
        //   // this.$store.state.addOrEdit = 'add'
        //   this.$refs.addservice.dialogFormVisble = true
        // },
        // deleteDialog (index, serviceId) {
        //   let _this = this
        //   this.$confirm('是否删除id为【' + serviceId + '】的服务？', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   }).then(() => {
        //     _this.$axios.delete('/services/' + serviceId)
        //       .then((response) => {
        //         if (response && response.status === 204) {
        //           this.$Message.success('id为【' + serviceId + '】的服务已删除')
        //           this.loadServices()
        //         }
        //       })
        //   }).catch(() => {
        //     this.$Message.info('已取消删除')
        //   })
        //   // this.$confirm({
        //   //   title: this.$t('common.delete'),
        //   //   content: this.$t('common.deleteMessage',{id:serviceId}),
        //   //   onOk: () => {
        //   //     _this._delete('/services/' + serviceId, () => {
        //   //       this.$Message.info(this.$t('common.deleted',{type:'Service'}));
        //   //       this.loadServices();
        //   //     });
        //   //   },
        //   //   onCancel: () => {
        //   //   }
        //   // });
        // }
      }
  }
</script>

<style scoped>

</style>
