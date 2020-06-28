<template>
  <div>
    <el-container>
      <el-aside width="12.5%"></el-aside>
      <el-main>
        <el-row>
          <el-col :span="6">
            <node-info ref="node"></node-info>
          </el-col>
          <el-col :span="12">
            <connection-div ref="connDiv"></connection-div>
          </el-col>
          <el-col :span="6">
            <data-store-info ref="data"></data-store-info>
          </el-col>
        </el-row>
        <el-row style="margin-top: 30px">
          <el-col :span="14"><div id="main" style="width: 700px;height:400px;margin-left: 0px;box-shadow:2px 2px 5px #909090;"></div></el-col>
          <el-col :span="10"><enabled-plugin ref="plugin"></enabled-plugin></el-col>
        </el-row>
<!--        <el-row>-->

<!--        </el-row>-->
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import ConnectionDiv from './ConnectionDiv'
  import NodeInfo from './NodeInfo'
  import DataStoreInfo from './DataStoreInfo'
  import EnabledPlugin from './EnabledPlugin'
  let echarts = require('echarts/lib/echarts')
  // 按需引入需要的组件模块
  require('echarts/lib/chart/line')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')
  require('echarts/lib/component/tooltip')
  export default {
    name: 'Dashboard',
    components: {EnabledPlugin, DataStoreInfo, NodeInfo, ConnectionDiv},
    data () {
      return {
        charts: '',
        totals: [],
        accepted: [],
        handled: [],
        timer: ''
      }
    },
    methods: {
      drawLine (id) {
        this.charts = echarts.init(document.getElementById(id))
        this.charts.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['客户端请求总数', '已接收的客户端连接数', '已处理的客户端连接数']
          },
          grid: {
            left: '5%',
            right: '4%',
            bottom: '3%',
            top: '10%',
            containLabel: true
          },
          // toolbox: {
          //   feature: {
          //     saveAsImage: {}
          //   }
          // },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['0', '5s', '10s', '15s']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '客户端请求总数',
              type: 'line',
              stack: '总量1',
              data: []
            },
            {
              name: '已接收的客户端连接数',
              type: 'line',
              stack: '总量2',
              data: []
            },
            {
              name: '已处理的客户端连接数',
              type: 'line',
              stack: '总量3',
              data: []
            }
          ]
        })
      },
      loadStatus () {
        this.$axios.get(localStorage.address + '/status')
          .then(response => {
            if (response) {
              let kongStatus = response.data
              // console.log(kongStatus)
              this.$refs.connDiv.total_requests = kongStatus.server.total_requests
              this.$refs.connDiv.active = kongStatus.server.connections_active
              this.$refs.connDiv.accepted = kongStatus.server.connections_accepted
              this.$refs.connDiv.handled = kongStatus.server.connections_handled
              this.$refs.connDiv.reading = kongStatus.server.connections_reading
              this.$refs.connDiv.writing = kongStatus.server.connections_writing
              this.$refs.connDiv.waiting = kongStatus.server.connections_waiting
              this.$refs.data.basicInfo[3].basicInfo_value = kongStatus.database.reachable.toString() === 'true' ? '已连接' : '未连接'

              this.totals.push(kongStatus.server.total_requests)
              this.accepted.push(kongStatus.server.connections_accepted)
              this.handled.push(kongStatus.server.connections_handled)
              this.charts.setOption({
                series: [
                  {
                    name: '客户端请求总数',
                    type: 'line',
                    stack: '总量1',
                    data: this.totals
                  },
                  {
                    name: '已接收的客户端连接数',
                    type: 'line',
                    stack: '总量2',
                    data: this.accepted
                  },
                  {
                    name: '已处理的客户端连接数',
                    type: 'line',
                    stack: '总量3',
                    data: this.handled
                  }]
              })
            }
          })
          .catch((error) => {
            if (error.response === undefined) {
              this.$Message.error('无法连接KONG网关~')
            } else {
              this.$Message.error(error.response.message)
            }
          })
      },
      loadBasicInfo () {
        let _this = this
        this.$axios.get(localStorage.address + '/')
          .then(response => {
            if (response) {
              let kongInfo = response.data
              _this.$refs.node.basicInfo[0].basicInfo_value = kongInfo.hostname
              _this.$refs.node.basicInfo[1].basicInfo_value = kongInfo.tagline
              _this.$refs.node.basicInfo[2].basicInfo_value = kongInfo.version
              _this.$refs.node.basicInfo[3].basicInfo_value = kongInfo.lua_version
              _this.$refs.node.basicInfo[4].basicInfo_value = kongInfo.configuration.admin_listen.toString()

              _this.$refs.data.basicInfo[0].basicInfo_value = kongInfo.configuration.database
              _this.$refs.data.basicInfo[1].basicInfo_value = kongInfo.configuration.pg_host
              _this.$refs.data.basicInfo[2].basicInfo_value = kongInfo.configuration.pg_database
              _this.$refs.data.basicInfo[4].basicInfo_value = kongInfo.configuration.pg_port

              _this.$refs.plugin.plugins = kongInfo.plugins.enabled_in_cluster
            }
          })

      }
    },
    //调用
    mounted () {
      this.loadStatus()
      this.loadBasicInfo()
      this.timer = setInterval(this.loadStatus, 5000)
      this.$nextTick(function () {
        this.drawLine('main')
      })
    },
    beforeDestroy () {
      clearInterval(this.timer)
    }
  }
</script>

<style scoped>

</style>
