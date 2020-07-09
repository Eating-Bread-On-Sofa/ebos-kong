<template>
  <div>
    <el-container>
      <el-aside width="12.5%"></el-aside>
      <el-main>
        <el-row style="margin-bottom: 20px">
          <el-col :span="8">
            <el-select v-model="item" placeholder="请选择Kong节点" style="width: 350px;float: left" clearable @change="selectKongNode">
              <el-option
                v-for="item in instances"
                :key="item.instance"
                :label="'【' + item.instance + '】: ' +  item.__address__"
                :value="item.instance">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div style="width: 420px;height:40px;margin-left: 0px;font-size: 22px;font-weight: bold;font-family: verdana"><span class="el-icon-kongmyicon-"></span> &nbsp;总连接数</div>
          </el-col>
          <el-col :span="8">
            <div style="width: 420px;height:40px;margin-left: 0px;font-size: 22px;font-weight: bold;font-family: verdana"><span class="el-icon-kongfuwulianjiejiankong"></span> &nbsp;已接收连接数</div>
          </el-col>
          <el-col :span="8">
            <div style="width: 420px;height:40px;margin-left: 0px;font-size: 22px;font-weight: bold;font-family: verdana"><span class="el-icon-kongicon-fuwuqijiankong"></span>&nbsp; 已处理连接数</div>
          </el-col>
<!--          <el-col :span="6">-->
<!--            <node-info ref="node"></node-info>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <connection-div ref="connDiv"></connection-div>-->
<!--          </el-col>-->
<!--          <el-col :span="6">-->
<!--            <data-store-info ref="data"></data-store-info>-->
<!--          </el-col>-->
        </el-row>
        <el-row style="margin-top: 0px">
          <el-col :span="8"><div id="total" style="width: 420px;height:300px;margin-left: 0px;box-shadow:2px 2px 5px #909090;"></div></el-col>
          <el-col :span="8"><div id="accepted" style="width: 420px;height:300px;margin-left: 10px;box-shadow:2px 2px 5px #909090;"></div></el-col>
          <el-col :span="8"><div id="handled" style="width: 420px;height:300px;margin-left: 15px;box-shadow:2px 2px 5px #909090;"></div></el-col>
          <!--          <el-col :span="10"><enabled-plugin ref="plugin"></enabled-plugin></el-col>-->
        </el-row>
        <el-row style="margin-top: 30px">
<!--          <el-col :span="14"><div id="main" style="width: 700px;height:400px;margin-left: 0px;box-shadow:2px 2px 5px #909090;"></div></el-col>-->
          <el-col :span="10"><enabled-plugin ref="plugin"></enabled-plugin></el-col>
        </el-row>

        <!--        <el-row>-->

        <!--        </el-row>-->
      </el-main>
    </el-container>
  </div>
</template>

<script>
  // import ConnectionDiv from './ConnectionDiv'
  // import NodeInfo from './NodeInfo'
  // import DataStoreInfo from './DataStoreInfo'
  import EnabledPlugin from './EnabledPlugin'
  let echarts = require('echarts/lib/echarts')
  // 按需引入需要的组件模块
  require('echarts/lib/chart/line')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')
  require('echarts/lib/component/tooltip')
  export default {
    name: 'KongInfo',
    components: {EnabledPlugin},
    data () {
      return {
        totalCharts: '',
        handledCharts: '',
        acceptedCharts: '',
        setTotals: [],
        totals: [],
        accepted: [],
        handled: [],
        timer: '',
        graph: {},
        graph1: {},
        graph2: {},
        _zr: {},
        _zr1: {},
        _zr2: {},
        instances: [],
        item: '',
        isLoad: false,
        selectedVal: ''
      }
    },
    methods: {
      drawTotalLine (id) {
        this.totalCharts = echarts.init(document.getElementById(id))
        var _this = this
        // var _zr = this.totalCharts.getZr()
        // _zr.add(new echarts.graphic.Text({
        //   style: {
        //     x: _zr.getWidth() / 1.8,
        //     y: _zr.getHeight() / 2,
        //     color: '#666',
        //     text: this.setTotals,
        //     textAlign: 'center',
        //     textFont: 'bold 20px verdana'
        //   }}
        // ))
        this.totalCharts.setOption({
          tooltip: {
            trigger: 'axis'
          },
          // legend: {
          //   data: ['客户端请求总数']
          // },
          grid: {
            left: '5%',
            right: '4%',
            bottom: '3%',
            top: '10%',
            containLabel: true
          },
          // graphic: {},
          xAxis: {
            show: true,
            type: 'category',
            boundaryGap: false,
            axisLine: {
              show: true
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            show: true,
            axisLine: {
              show: true, // 是否显示坐标轴轴线。
              lineStyle: {
                // color : "#bae1e5"
              }
            },
            scale: true,
            axisTick: {
              show: true // 是否显示坐标轴刻度
            },
            axisLabel: {
              show: true // 是否显示刻度标签。
            },
            position: 'left',
            type: 'value',
            boundaryGap: [ 0, '20%' ], // 表示数据最小值和最大值的延伸范围
            splitLine: {
              show: false, // 去除网格线
              interval: 1,
              lineStyle: {
                color: '#bae1e5'
              }
            },
          },
          // yAxis: {
          //   type: 'value'
          // },
          series: [
            {
              name: '客户端请求数',
              type: 'line',
              stack: '总量1',
              data: [],
              areaStyle: {
                color: '#3bcec6' //折线下方色块颜色
              }
            }
          ]
        })
      },
      drawHandledLine (id) {
        this.handledCharts = echarts.init(document.getElementById(id))
        this.handledCharts.setOption({
          tooltip: {
            trigger: 'axis'
          },
          // legend: {
          //   data: ['客户端请求总数']
          // },
          grid: {
            left: '5%',
            right: '4%',
            bottom: '3%',
            top: '10%',
            containLabel: true
          },
          // graphic: {},
          xAxis: {
            show: true,
            type: 'category',
            boundaryGap: false,
            axisLine: {
              show: true
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            show: true,
            axisLine: {
              show: true, // 是否显示坐标轴轴线。
              lineStyle: {
                // color : "#bae1e5"
              }
            },
            scale: true,
            axisTick: {
              show: true // 是否显示坐标轴刻度
            },
            axisLabel: {
              show: true // 是否显示刻度标签。
            },
            position: 'left',
            type: 'value',
            boundaryGap: [ 0, '20%' ], // 表示数据最小值和最大值的延伸范围
            splitLine: {
              show: false, // 去除网格线
              interval: 1,
              lineStyle: {
                color: '#bae1e5'
              }
            },
          },
          // yAxis: {
          //   type: 'value'
          // },
          series: [
            {
              name: '客户端请求数',
              type: 'line',
              stack: '总量1',
              data: [],
              areaStyle: {
                color: '#3bcec6' //折线下方色块颜色
              }
            }
          ]
        })
      },
      drawAcceptedLine (id) {
        this.acceptedCharts = echarts.init(document.getElementById(id))
        this.acceptedCharts.setOption({
          tooltip: {
            trigger: 'axis'
          },
          // legend: {
          //   data: ['客户端请求总数']
          // },
          grid: {
            left: '5%',
            right: '4%',
            bottom: '3%',
            top: '10%',
            containLabel: true
          },
          // graphic: {},
          xAxis: {
            show: true,
            type: 'category',
            boundaryGap: false,
            axisLine: {
              show: true
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            show: true,
            axisLine: {
              show: true, // 是否显示坐标轴轴线。
              lineStyle: {
                // color : "#bae1e5"
              }
            },
            scale: true,
            axisTick: {
              show: true // 是否显示坐标轴刻度
            },
            axisLabel: {
              show: true // 是否显示刻度标签。
            },
            position: 'left',
            type: 'value',
            boundaryGap: [ 0, '20%' ], // 表示数据最小值和最大值的延伸范围
            splitLine: {
              show: false, // 去除网格线
              interval: 1,
              lineStyle: {
                color: '#bae1e5'
              }
            },
          },
          // yAxis: {
          //   type: 'value'
          // },
          series: [
            {
              name: '已接收的请求数',
              type: 'line',
              stack: '总量1',
              data: [],
              areaStyle: {
                color: '#3bcec6' //折线下方色块颜色
              }
            }
          ]
        })
      },
      loadStatus () {
        // console.log(this.setTotals)
        if (localStorage.isLoad) {
          if (this.totals.length !== 0) {
            this._zr = this.totalCharts.getZr()
            this._zr.remove(this.graph)
            this._zr1 = this.handledCharts.getZr()
            this._zr1.remove(this.graph1)
            this._zr2 = this.acceptedCharts.getZr()
            this._zr2.remove(this.graph2)
          }
          this.$axios.get('http://' + localStorage.ip + ':9090/api/v1/query?query=sum(kong_nginx_http_current_connections{state="total", instance=~"' + localStorage.selectedVal + '"})')
            .then((response) => {
              // console.log(response)
              let kongStatus = response.data.data.result[0].value[1]
              if (this.totals.length === 0) {
                // this._zr.remove(this.graph)
                this._zr = this.totalCharts.getZr()
                // _zr.remove(this.graph)
              }
              this.totals.push(kongStatus)
              this.graph = new echarts.graphic.Text({
                style: {
                  x: this._zr.getWidth() / 1.8,
                  y: this._zr.getHeight() / 2,
                  color: '#666',
                  text: kongStatus,
                  textAlign: 'center',
                  textFont: 'bold 28px verdana'
                }}
              )
              this._zr.add(this.graph)

              this.totalCharts.setOption({
                series: [
                  {
                    name: '客户端总请求数',
                    type: 'line',
                    stack: '总量1',
                    data: this.totals
                  }]
              })
            })
          this.$axios.get('http://' + localStorage.ip + ':9090/api/v1/query?query=sum(kong_nginx_http_current_connections{state="handled", instance=~"' + localStorage.selectedVal + '"})')
            .then((response) => {
              // console.log(response)
              console.log(localStorage.selectedVal)
              let kongStatus = response.data.data.result[0].value[1]
              if (this.handled.length === 0) {
                this._zr1 = this.handledCharts.getZr()
              }
              this.handled.push(kongStatus)
              this.graph1 = new echarts.graphic.Text({
                style: {
                  x: this._zr.getWidth() / 1.8,
                  y: this._zr.getHeight() / 2,
                  color: '#666',
                  text: kongStatus,
                  textAlign: 'center',
                  textFont: 'bold 28px verdana'
                }}
              )
              this._zr1.add(this.graph1)

              this.handledCharts.setOption({
                series: [
                  {
                    name: '已处理请求数',
                    type: 'line',
                    stack: '总量1',
                    data: this.handled
                  }]
              })
            })
          this.$axios.get('http://' + localStorage.ip + ':9090/api/v1/query?query=sum(kong_nginx_http_current_connections{state="accepted", instance=~"' + localStorage.selectedVal + '"})')
            .then((response) => {
              // console.log(response)
              let kongStatus = response.data.data.result[0].value[1]
              if (this.accepted.length === 0) {
                this._zr2 = this.acceptedCharts.getZr()
              }
              this.accepted.push(kongStatus)
              this.graph2 = new echarts.graphic.Text({
                style: {
                  x: this._zr.getWidth() / 1.8,
                  y: this._zr.getHeight() / 2,
                  color: '#666',
                  text: kongStatus,
                  textAlign: 'center',
                  textFont: 'bold 28px verdana'
                }}
              )
              this._zr2.add(this.graph2)
              this.acceptedCharts.setOption({
                series: [
                  {
                    name: '已接收请求数',
                    type: 'line',
                    stack: '总量1',
                    data: this.accepted
                  }]
              })
            })
            .catch((error) => {
                  if (error.response === undefined) {
                    this.$Message.error('无法连接KONG网关~')
                  } else {
                    this.$Message.error(error.response.message)
                  }
                })
          // this.$axios.get(localStorage.address + '/status')
          //   .then(response => {
          //     if (response) {
          //       let kongStatus = response.data
          //       if (this.totals.length === 0) {
          //         this._zr = this.totalCharts.getZr()
          //         // _zr.remove(this.graph)
          //       }
          //       if (this.handled.length === 0) {
          //         this._zr1 = this.handledCharts.getZr()
          //       }
          //       if (this.accepted.length === 0) {
          //         this._zr2 = this.acceptedCharts.getZr()
          //       }
          //       this.totals.push(kongStatus.server.total_requests)
          //       this.accepted.push(kongStatus.server.connections_accepted)
          //       this.handled.push(kongStatus.server.connections_handled)
          //       this.graph = new echarts.graphic.Text({
          //         style: {
          //           x: this._zr.getWidth() / 1.8,
          //           y: this._zr.getHeight() / 2,
          //           color: '#666',
          //           text: kongStatus.server.total_requests,
          //           textAlign: 'center',
          //           textFont: 'bold 28px verdana'
          //         }}
          //       )
          //       this.graph1 = new echarts.graphic.Text({
          //         style: {
          //           x: this._zr.getWidth() / 1.8,
          //           y: this._zr.getHeight() / 2,
          //           color: '#666',
          //           text: kongStatus.server.connections_handled,
          //           textAlign: 'center',
          //           textFont: 'bold 28px verdana'
          //         }}
          //       )
          //       this.graph2 = new echarts.graphic.Text({
          //         style: {
          //           x: this._zr.getWidth() / 1.8,
          //           y: this._zr.getHeight() / 2,
          //           color: '#666',
          //           text: kongStatus.server.connections_accepted,
          //           textAlign: 'center',
          //           textFont: 'bold 28px verdana'
          //         }}
          //       )
          //       this._zr.add(this.graph)
          //       this._zr1.add(this.graph1)
          //       this._zr2.add(this.graph2)
          //       // this.$set(this.setTotals, 0, kongStatus.server.total_requests)
          //       // console.log(this.totals)
          //       // console.log(this.totals.pop())
          //
          //       this.totalCharts.setOption({
          //         series: [
          //           {
          //             name: '客户端总请求数',
          //             type: 'line',
          //             stack: '总量1',
          //             data: this.totals
          //           }]
          //       })
          //       this.handledCharts.setOption({
          //         series: [
          //           {
          //             name: '已处理请求数',
          //             type: 'line',
          //             stack: '总量1',
          //             data: this.handled
          //           }]
          //       })
          //       this.acceptedCharts.setOption({
          //         series: [
          //           {
          //             name: '已接收请求数',
          //             type: 'line',
          //             stack: '总量1',
          //             data: this.accepted
          //           }]
          //       })
          //     }
          //   })
          //   .catch((error) => {
          //     if (error.response === undefined) {
          //       this.$Message.error('无法连接KONG网关~')
          //     } else {
          //       this.$Message.error(error.response.message)
          //     }
          //   })
        }

      },
      loadBasicInfo () {
        let _this = this
        this.$axios.get(localStorage.address + '/')
          .then(response => {
            if (response) {
              let kongInfo = response.data
              // _this.$refs.node.basicInfo[0].basicInfo_value = kongInfo.hostname
              // _this.$refs.node.basicInfo[1].basicInfo_value = kongInfo.tagline
              // _this.$refs.node.basicInfo[2].basicInfo_value = kongInfo.version
              // _this.$refs.node.basicInfo[3].basicInfo_value = kongInfo.lua_version
              // _this.$refs.node.basicInfo[4].basicInfo_value = kongInfo.configuration.admin_listen.toString()
              //
              // _this.$refs.data.basicInfo[0].basicInfo_value = kongInfo.configuration.database
              // _this.$refs.data.basicInfo[1].basicInfo_value = kongInfo.configuration.pg_host
              // _this.$refs.data.basicInfo[2].basicInfo_value = kongInfo.configuration.pg_database
              // _this.$refs.data.basicInfo[4].basicInfo_value = kongInfo.configuration.pg_port

              _this.$refs.plugin.plugins = kongInfo.plugins.enabled_in_cluster
            }
          })

      },
      loadInstances () {
        let _this = this
        this.$axios.get('http://' + localStorage.ip + ':9090/api/v1/targets')
          .then((response) => {
            // console.log(response.data.data)
            response.data.data.activeTargets.map(function (target) {
              if ('up' === target.health && target.discoveredLabels.__address__.indexOf('8000') !== -1) {
                _this.instances.push(target.discoveredLabels)
                // _this.instances = _this.unique(_this.instances)
              }
            })
            // console.log(_this.instances)
          })

      },
      selectKongNode (val) {
        clearInterval(this.timer)
        this.totals = []
        this.handled = []
        this.accepted = []
        this._zr = this.totalCharts.getZr()
        this._zr.remove(this.graph)
        this._zr1 = this.handledCharts.getZr()
        this._zr1.remove(this.graph1)
        this._zr2 = this.acceptedCharts.getZr()
        this._zr2.remove(this.graph2)
        localStorage.isLoad = true
        localStorage.selectedVal = val
        this.loadStatus()
        this.timer = setInterval(this.loadStatus, 15000)
      }
    },
    //调用
    mounted () {
      if (localStorage.isLoad === undefined) {
        localStorage.isLoad = false
      }
      if (localStorage.selectedVal === undefined) {
        localStorage.selectedVal = ''
      }
      // console.log(localStorage.isLoad)
      // this.loadStatus()
      this.loadBasicInfo()
      this.loadInstances()
      // this.timer = setInterval(this.loadStatus, 15000)
      this.$nextTick(function () {
        this.drawTotalLine('total')
        this.drawHandledLine('handled')
        this.drawAcceptedLine('accepted')
        if (localStorage.isLoad) {
          this.item = localStorage.selectedVal
          this.selectKongNode(localStorage.selectedVal)
        }
      })

    },
    beforeDestroy () {
      clearInterval(this.timer)
    }
  }
</script>

<style scoped>

</style>
