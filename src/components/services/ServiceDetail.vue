<template>
  <div>
    <el-container>
      <el-aside width="12.5%"></el-aside>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px">
          <el-breadcrumb-item :to="{ path: '/info' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/services' }">服务列表</el-breadcrumb-item>
          <el-breadcrumb-item>{{ serviceName }}</el-breadcrumb-item>
        </el-breadcrumb>
        <single-service-info ref="serviceTable"></single-service-info>
        <route-table ref="routeTable"></route-table>
<!--        <plugin-table ref="pluginTable"></plugin-table>-->
        <service-plugin-table ref="pluginTable"></service-plugin-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import moment from 'moment'
  import SingleServiceInfo from './SingleServiceInfo'
  import RouteTable from './RouteTable'
  import ServicePluginTable from './ServicePluginTable'
  export default {
    name: 'ServiceDetail',
    components: {ServicePluginTable, RouteTable, SingleServiceInfo},
    data () {
      return {
        serviceName: ''
      }
    },
    mounted () {
      this.$refs.pluginTable.pluginTitle = '服务插件信息'
      this.$refs.pluginTable.serviceId = this.$route.params.id
      this.loadSingleService()
    },
    methods: {
      sortKey (array, key) {
        return array.sort(function (a, b) {
          var x = a[key]
          var y = b[key]
          return x > y ? -1 : x < y ? 1 : 0
        });
      },
      loadSingleService () {
        let url = localStorage.address + '/services/' + this.$route.params.id
        // console.log(url)
        this.$axios.get(url)
          .then(response => {
            let serviceData = response.data
            let createDate = moment.unix(serviceData.created_at)
            let createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
            serviceData.createAtStr = createAtStr
            // console.log(serviceData)
            let updatedDate = moment.unix(serviceData.updated_at)
            let updatedAtStr = updatedDate.format('YYYY-MM-DD HH:mm:ss')
            serviceData.updatedAtStr = updatedAtStr
            // console.log(serviceData)
            this.$refs.serviceTable.services.push(serviceData)
            this.serviceName = response.data.name
            // this.services.push(serviceData)
            this.loadRoutes()
          })
      },
      loadRoutes () {
        let routesInfo = []
        let routeInfo = {}
        this.$refs.routeTable.routes = []
        this.$axios.get(localStorage.address + '/services/' + this.$route.params.id + '/routes')
          .then(response => {
            this.$refs.routeTable.routes = response.data.data
            this.$refs.routeTable.routes = this.sortKey(this.$refs.routeTable.routes, 'created_at')
            // console.log(response.data.data)
            for (var i = 0; i < this.$refs.routeTable.routes.length; i++) {
              routeInfo.routeName = this.$refs.routeTable.routes[i].name
              routeInfo.routeId = this.$refs.routeTable.routes[i].id
              routesInfo.push(routeInfo)
              routeInfo = {}
              if (!this.$refs.routeTable.routes[i].hosts || !this.$refs.routeTable.routes[i].hosts.length) {
                this.$refs.routeTable.routes[i].hosts = ['localhost']
              }
              if (!this.$refs.routeTable.routes[i].paths) {
                this.$refs.routeTable.routes[i].paths = []
              }
            }
            // console.log(routesInfo)
            localStorage.setItem('routesInfo', JSON.stringify(routesInfo))
            // console.log(JSON.parse(localStorage.getItem('routesInfo')))
            // console.log(this.$refs.routeTable.routes)
            this.$refs.routeTable.routes.map(function (route) {
              let createDate = moment.unix(route.created_at)
              route.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
              let updatedDate = moment.unix(route.updated_at)
              route.updatedAtStr = updatedDate.format('YYYY-MM-DD HH:mm:ss')
            })
          })
        // 查找对应的插件添加到下面的表格
        this.loadPlugins()
      },
      loadPlugins () {
        // let _this = this
        this.$axios.get(localStorage.address + '/services/' + this.$route.params.id + '/plugins')
          .then(response => {
            this.$refs.pluginTable.plugins = response.data.data
            this.$refs.pluginTable.plugins = this.sortKey(this.$refs.pluginTable.plugins, 'created_at')
            this.$refs.pluginTable.plugins.map(function (plugin) {
              let createDate = moment.unix(plugin.created_at)
              plugin.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
            })
            for(var i = 0; i < this.$refs.pluginTable.plugins.length; i++) {
              this.$refs.pluginTable.plugins[i].scope = '服务'
            }
        })
      }
    }
  }
</script>

<style scoped>
  .text {
    font-size: 16px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 480px;
  }
</style>
