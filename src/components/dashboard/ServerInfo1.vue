<template>
  <div>
    <el-container>
      <el-aside width="12.5%"></el-aside>
      <el-main>
        <el-row style="height: 40px;;">
          <el-col :span="24">
            <span style="float: left;font-weight: bold;font-size: 23px"><i class="el-icon-s-platform"></i> &nbsp;系统物理信息表</span>
          </el-col>
        </el-row>
        <el-row style="box-shadow:1px 0px 5px #909090;">
          <el-table
            style="width: 100%;margin-top: 10px"
            :data="serverInfo">
            <el-table-column
              prop="systemInfo"
              label="系统类型"
              width="150px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.metric.sysname }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="nodename"
              label="主机名">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.metric.nodename }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="job"
              label="job">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.metric.job }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="instance"
              label="instance">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.metric.instance }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="memoryVal"
              label="内存"
              width="80px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.memoryVal }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="cpuTotal"
              label="CPU核"
              width="80px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.cpuTotal }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="bootTime"
              label="运行时间">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.bootTime }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="filesystem"
              label="分区使用率">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.filesystem }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="cpuRate"
              label="CPU使用率">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.cpuRate }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="memoryRate"
              label="内存使用率">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.memoryRate }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="downBand"
              label="下载带宽">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.downBand }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="upBand"
              label="上传带宽">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.upBand }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <health-check-status ref="healthcheck"></health-check-status>
        <alert-info ref="alert"></alert-info>
<!--        <el-row style="margin-top: 30px">-->
<!--          <c-p-u-charts ref="cpuChart"></c-p-u-charts>-->
<!--&lt;!&ndash;          <el-col :span="7"><div id="cpu" style="width: 400px;height:300px;margin-left: 0px;box-shadow:2px 2px 5px #909090;"></div></el-col>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-col :span="7"><div id="memory" style="width: 400px;height:300px;margin-left: 60px;box-shadow:2px 2px 5px #909090;"></div></el-col>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-col :span="7"><div id="band" style="width: 400px;height:300px;margin-left: 120px;box-shadow:2px 2px 5px #909090;"></div></el-col>&ndash;&gt;-->
<!--        </el-row>-->
      </el-main>
    </el-container>
  </div>
</template>

<script>
  // let echarts = require('echarts/lib/echarts')
  // // 按需引入需要的组件模块
  // require('echarts/lib/chart/line')
  // require('echarts/lib/component/title')
  // require('echarts/lib/component/legend')
  // require('echarts/lib/component/tooltip')
  import TargetTable from '../upstreams/TargetTable'
  import HealthCheckStatus from './HealthCheckStatus'
  import AlertInfo from './AlertInfo'
  export default {
    name: 'ServerInfo1',
    components: {AlertInfo, HealthCheckStatus, TargetTable},
    data () {
      return {
        serverInfo: [],
        job: '',
        memoryVal: '',
        chartsCpu: '',
        cpuRate: [],
        timer: '',

        // instances: []
      }
    },
    mounted () {
      this.loadServerInfo()
      this.timer = setInterval(this.loadServerInfo, 10000)
      // this.$nextTick(function () {
      //   this.drawCpuLine('cpu')
      // })
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    methods: {
      async loadServerInfo () {
        let job = ''
        // let instance = ''
        let _this = this
        // let serverInfo2 = []
        await this.$axios.get('http://' + localStorage.ip + ':9090/api/v1/query?query=node_uname_info')
          .then((response) => {
            // _this.serverInfo = []
            _this.serverInfo = response.data.data.result
            // console.log(response.data.data.result)
            // for (var i = 0; i < _this.serverInfo.length; i++) {
            //   let j = i
            //   let job = _this.serverInfo[j].metric.job
            //   let instance = _this.serverInfo[j].metric.instance
            //   _this.loadMemory(j, job)
            //   _this.loadCpuTotal(j, job, instance)
            //   _this.loadBootTime(j, job, instance)
            //   _this.loadFilesystem(j, job, instance)
            //   _this.loadCpuRate(j, job, instance)
            //   _this.loadMemoryRate(j, job)
            // }
            for (var i = 0; i < _this.serverInfo.length; i++) {
              // console.log(response.data.data.result)
              _this.serverInfo[i].metric.sysname = response.data.data.result[i].metric.sysname + '【' + response.data.data.result[i].metric.machine + '】'
              if (i !== _this.serverInfo.length - 1) {
                job += _this.serverInfo[i].metric.job + '|'
              } else {
                job += _this.serverInfo[i].metric.job
              }
              // instance.push(_this.serverInfo[i].metric.instance)
            }
            _this.loadMemory(job)
            _this.loadCpuTotal(job)
            _this.loadBootTime(job)
            _this.loadFilesystem(job)
            _this.loadCpuRate(job)
            _this.loadMemoryRate(job)
            _this.loadDownBandwidth(job)
            _this.loadUpBandwidth(job)
            // console.log(job)
            // console.log(_this.serverInfo)
          })
      },
      // loadMemory (i, job) {
      //   this.$axios.get('/query?query=node_memory_MemTotal_bytes{job=~"' + job + '"}')
      //     .then((resp) => {
      //       this.$set(this.serverInfo[i], 'memoryVal', resp.data.data.result[0].value[1])
      //     })
      //     .catch((error) => {
      //       this.$Message.error(error.response.message)
      //     })
      // },
      loadMemory (job) {
        // console.log(job)
        this.$axios.get('http://' + localStorage.ip + ':9090/api/v1/query?query=node_memory_MemTotal_bytes{job=~"' + job + '"}')
          .then((resp) => {
            // console.log(resp.data.data.result)
            for (var i = 0; i < this.serverInfo.length; i++) {
              this.$set(this.serverInfo[i], 'memoryVal', (parseInt(resp.data.data.result[i].value[1]) / 1024 / 1024 / 1024).toFixed(2) + 'G')
            }
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
          })
      },
      loadCpuTotal (job) {
        let url = 'http://' + localStorage.ip + ':9090/api/v1/query?query=count(node_cpu_seconds_total{job=~"' + job + '"' + ",mode='system'}) by (instance)"
        this.$axios.get(url)
          .then((response) => {
            for (var i = 0; i < this.serverInfo.length; i++) {
              this.$set(this.serverInfo[i], 'cpuTotal', response.data.data.result[i].value[1])
            }
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
          })
      },
      loadBootTime (job) {
        this.$axios.get('http://' + localStorage.ip + ':9090/api/v1/query?query=sum(time() - node_boot_time_seconds{job=~"' + job + '"})by(instance)')
          .then((resp) => {
            // bootTime
            for (var i = 0; i < this.serverInfo.length; i++) {
              var period = parseFloat(resp.data.data.result[i].value[1]) / 60 / 60
              if (period <= 24) {
                period = period.toFixed(2) + ' 小时'
              } else {
                period = (period / 24).toFixed(2) + ' 天'
              }
              this.$set(this.serverInfo[i], 'bootTime', period)
            }
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
          })
      },
      loadFilesystem (job) {
        let url = 'http://' + localStorage.ip + ':9090/api/v1/query?query=max((node_filesystem_size_bytes{job=~"' + job + '",fstype=~"ext.?|xfs"}-node_filesystem_free_bytes{job=~"' + job + '",fstype=~"ext.?|xfs"})*100/(node_filesystem_avail_bytes{job=~"' + job + '",fstype=~"ext.?|xfs"}%2B(node_filesystem_size_bytes{job=~"' + job + '",fstype=~"ext.?|xfs"}-node_filesystem_free_bytes{job=~"' + job + '",fstype=~"ext.?|xfs"})))by(instance)'
        this.$axios.get(url)
          .then((resp) => {
            for (var i = 0; i < this.serverInfo.length; i++) {
              this.$set(this.serverInfo[i], 'filesystem', parseFloat(resp.data.data.result[i].value[1]).toFixed(2) +'%')
            }
            // console.log(resp.data.data.result[0].value[1])
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
            // console.log(error.response)
          })
      },
      loadCpuRate (job) {
        let url = 'http://' + localStorage.ip + ':9090/api/v1/query?query=(1 - avg(irate(node_cpu_seconds_total{job=~"' + job + '",mode="idle"}[5m])) by (instance)) * 100'
        this.$axios.get(url)
          .then((resp) => {
            // console.log(resp.data.data.result[0].value[1])
            for (var i = 0; i < this.serverInfo.length; i++) {
              this.$set(this.serverInfo[i], 'cpuRate', parseFloat(resp.data.data.result[i].value[1]).toFixed(2) + '%')
            }

            // this.$refs.cpuChart.cpuRate.push(parseFloat(resp.data.data.result[0].value[1]).toFixed(2))
            // this.chartsCpu.setOption({
            //   series: [
            //     {
            //       name: 'CPU使用率',
            //       type: 'line',
            //       stack: '总量1',
            //       data: this.$refs.cpuChart.cpuRate
            //     }]
            // })
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
            // console.log(error.response)
          })
      },
      loadMemoryRate (job) {
        let url = 'http://' + localStorage.ip + ':9090/api/v1/query?query=(1 - (node_memory_MemAvailable_bytes{job=~"' + job + '"} / (node_memory_MemTotal_bytes{job=~"' + job + '"})))* 100'
        this.$axios.get(url)
          .then((resp) => {
            // console.log(resp.data.data.result)
            for (var i = 0; i < this.serverInfo.length; i++) {
              this.$set(this.serverInfo[i], 'memoryRate', parseFloat(resp.data.data.result[i].value[1]).toFixed(2) + '%')
            }
            // this.$set(this.serverInfo[i], 'memoryRate', resp.data.data.result[0].value[1])
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
            // console.log(error.response)
          })
      },
      loadDownBandwidth (job) {
        let url = 'http://' + localStorage.ip + ':9090/api/v1/query?query=max(irate(node_network_receive_bytes_total{job=~"' + job + '"}[5m])*8) by (instance)'
        this.$axios.get(url)
          .then((resp) => {
            // console.log(resp.data.data.result)
            for (var i = 0; i < this.serverInfo.length; i++) {
              this.$set(this.serverInfo[i], 'downBand', (parseFloat(resp.data.data.result[i].value[1]) / 1000).toFixed(2) + 'kbps')
            }
            // this.$set(this.serverInfo[i], 'memoryRate', resp.data.data.result[0].value[1])
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
            // console.log(error.response)
          })
      },
      loadUpBandwidth (job) {
        let url = 'http://' + localStorage.ip + ':9090/api/v1/query?query=max(irate(node_network_transmit_bytes_total{job=~"' + job + '"}[5m])*8) by (instance)'
        this.$axios.get(url)
          .then((resp) => {
            // console.log(resp.data.data.result)
            for (var i = 0; i < this.serverInfo.length; i++) {
              this.$set(this.serverInfo[i], 'upBand', (parseFloat(resp.data.data.result[i].value[1]) / 1000).toFixed(2) + 'kbps')
            }
            // this.$set(this.serverInfo[i], 'memoryRate', resp.data.data.result[0].value[1])
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
            // console.log(error.response)
          })
      },
      // drawCpuLine (id) {
      //   this.$refs.cpuChart.chartsCpu = echarts.init(document.getElementById(id))
      //   this.$refs.cpuChart.chartsCpu.setOption({
      //     tooltip: {
      //       trigger: 'axis'
      //     },
      //     legend: {
      //       data: ['CPU使用率']
      //     },
      //     grid: {
      //       left: '5%',
      //       right: '4%',
      //       bottom: '3%',
      //       top: '10%',
      //       containLabel: true
      //     },
      //     // toolbox: {
      //     //   feature: {
      //     //     saveAsImage: {}
      //     //   }
      //     // },
      //     xAxis: {
      //       type: 'category',
      //       boundaryGap: false,
      //       data: ['0', '5s', '10s', '15s']
      //     },
      //     yAxis: {
      //       type: 'value'
      //     },
      //     series: [
      //       {
      //         name: 'CPU使用率',
      //         type: 'line',
      //         stack: '总量1',
      //         data: []
      //       }
      //       // {
      //       //   name: '已接收的客户端连接数',
      //       //   type: 'line',
      //       //   stack: '总量2',
      //       //   data: []
      //       // },
      //       // {
      //       //   name: '已处理的客户端连接数',
      //       //   type: 'line',
      //       //   stack: '总量3',
      //       //   data: []
      //       // }
      //     ]
      //   })
      // }
    }
  }
</script>

<style scoped>
  .panel-title-text {
    border: 1px solid #C0C0C0;
    width: 80%;
    /*margin-left: 15%;*/
  }
</style>
