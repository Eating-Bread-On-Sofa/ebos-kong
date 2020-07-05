<template>
  <div>
    <el-row style="height: 40px;margin-top: 10px;">
      <el-col :span="24">
        <span style="float: left;font-weight: bold;font-size: 23px"><i class="el-icon-konggaojing"></i> &nbsp;告警信息</span>
      </el-col>
    </el-row>

    <el-row style="box-shadow:1px 0px 5px #909090;">
      <!--          <target-table ref="targetTable"></target-table>-->
      <el-table
        style="width: 100%;margin-top: 0px"
        :data="alerts.slice((currentPage-1)*pageSize,currentPage*pageSize)">
        <el-table-column
          prop="job"
          label="job">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.labels.job }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="instance"
          label="instance">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.labels.instance }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="alertname"
          label="告警类型">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.labels.alertname }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="summary"
          label="告警信息"
          width="400px">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.annotations.summary }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="告警状态">
          <template slot-scope="scope">
            <el-button type="danger" style="cursor: auto" size="small"><span style="font-size: 13px;margin-left: 0px">警报触发</span></el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="activeAt"
          label="告警创建时间">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.activeAt }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :pager-count="5"
        :total="alerts.length">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'AlertInfo',
    data () {
      return {
        currentPage: 1,
        pageSize: 5,
        alerts: [],
        timer: '',
        notifyPromise: Promise.resolve()
      }
    },
    mounted () {
      this.loadAlerts()
      this.timer = setInterval(this.loadAlerts, 30000)
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    methods: {
      loadAlerts () {
        let _this = this
        // this.$axios.get('http://localhost:9090/api/v1/alerts')
        this.$axios.get('http://' + localStorage.ip + ':9090/api/v1/alerts')
          .then((response) => {
            // console.log(response.data.data.alerts)
            response.data.data.alerts.map(function (alert) {
              alert.activeAt = _this.utc2beijing(alert.activeAt)
              _this.notify(alert.labels.job, alert.labels.instance, alert.annotations.summary)
              // console.log(alert.activeAt)
            })
            _this.alerts = response.data.data.alerts
          })
      },
      notify (job, instance, msg) {
        this.notifyPromise = this.notifyPromise.then(this.$nextTick).then(() => {
          this.$message({
            showClose: true,
            message: '告警：job【' + job + '】,instance【' + instance + '】的系统 ' + msg,
            duration: 5000,
            type: 'warning'
          })
        })
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage
      },
      utc2beijing(utc_datetime) {
        // 转为正常的时间格式 年-月-日 时:分:秒
        var T_pos = utc_datetime.indexOf('T')
        var Z_pos = utc_datetime.indexOf('Z')
        var year_month_day = utc_datetime.substr(0,T_pos)
        var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1)
        var new_datetime = year_month_day+" "+hour_minute_second // 2017-03-31 08:02:06

        // 处理成为时间戳
        var timestamp = new Date(Date.parse(new_datetime))
        timestamp = timestamp.getTime()
        timestamp = timestamp / 1000

        // 增加8个小时，北京时间比utc时间多八个时区
        timestamp = timestamp + 8 * 60 * 60

        let createDate = moment.unix(timestamp)
        createDate = createDate.format('YYYY-MM-DD HH:mm:ss')
        // console.log(createDate)
        // 时间戳转为时间
        // var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, '-').replace(/日/g, ' ')
        // console.log(beijing_datetime)
        return createDate // 2017-03-31 16:02:06
      }
    }
  }
</script>

<style scoped>

</style>
