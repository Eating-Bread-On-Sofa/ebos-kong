<!--<template>-->
<!--&lt;!&ndash;  <div id="main" style="width: 700px;height:400px;margin-left: 0px;box-shadow:2px 2px 5px #909090;"></div>&ndash;&gt;-->
<!--</template>-->

<!--<script>-->
<!--  // import echarts from 'echarts'-->
<!--  // 引入基本模板-->
<!--  let echarts = require('echarts/lib/echarts')-->
<!--  // 按需引入需要的组件模块-->
<!--  require('echarts/lib/chart/line')-->
<!--  require('echarts/lib/component/title')-->
<!--  require('echarts/lib/component/legend')-->
<!--  require('echarts/lib/component/tooltip')-->
<!--  export default {-->
<!--    name: 'ConnectionLine',-->
<!--    data () {-->
<!--      return {-->
<!--        charts: '',-->
<!--        totals: [],-->
<!--        accepted: [],-->
<!--        handled: [],-->
<!--        timer: ''-->
<!--      }-->
<!--    },-->
<!--    methods: {-->
<!--      drawLine (id) {-->
<!--        this.charts = echarts.init(document.getElementById(id))-->
<!--        this.charts.setOption({-->
<!--          tooltip: {-->
<!--            trigger: 'axis'-->
<!--          },-->
<!--          legend: {-->
<!--            data: ['客户端请求总数', '已接收的客户端连接数', '已处理的客户端连接数']-->
<!--          },-->
<!--          grid: {-->
<!--            left: '5%',-->
<!--            right: '4%',-->
<!--            bottom: '3%',-->
<!--            top: '10%',-->
<!--            containLabel: true-->
<!--          },-->
<!--          // toolbox: {-->
<!--          //   feature: {-->
<!--          //     saveAsImage: {}-->
<!--          //   }-->
<!--          // },-->
<!--          xAxis: {-->
<!--            type: 'category',-->
<!--            boundaryGap: false,-->
<!--            data: ['0', '5s', '10s', '15s']-->
<!--          },-->
<!--          yAxis: {-->
<!--            type: 'value'-->
<!--          },-->
<!--          series: [-->
<!--            {-->
<!--              name: '客户端请求总数',-->
<!--              type: 'line',-->
<!--              stack: '总量1',-->
<!--              data: []-->
<!--            },-->
<!--            {-->
<!--              name: '已接收的客户端连接数',-->
<!--              type: 'line',-->
<!--              stack: '总量2',-->
<!--              data: []-->
<!--            },-->
<!--            {-->
<!--              name: '已处理的客户端连接数',-->
<!--              type: 'line',-->
<!--              stack: '总量3',-->
<!--              data: []-->
<!--            }-->
<!--          ]-->
<!--        })-->
<!--      },-->
<!--      loadStatus () {-->
<!--        this.$axios.get('/status')-->
<!--          .then(response => {-->
<!--            if (response) {-->
<!--              let kongStatus = response.data-->
<!--              // console.log(kongStatus)-->
<!--              this.totals.push(kongStatus.server.total_requests)-->
<!--              this.accepted.push(kongStatus.server.connections_accepted)-->
<!--              this.handled.push(kongStatus.server.connections_handled)-->
<!--              this.charts.setOption({-->
<!--                series: [-->
<!--                  {-->
<!--                    name: '客户端请求总数',-->
<!--                    type: 'line',-->
<!--                    stack: '总量1',-->
<!--                    data: this.totals-->
<!--                  },-->
<!--                  {-->
<!--                    name: '已接收的客户端连接数',-->
<!--                    type: 'line',-->
<!--                    stack: '总量2',-->
<!--                    data: this.accepted-->
<!--                  },-->
<!--                  {-->
<!--                    name: '已处理的客户端连接数',-->
<!--                    type: 'line',-->
<!--                    stack: '总量3',-->
<!--                    data: this.handled-->
<!--                  }]-->
<!--              })-->
<!--            }-->
<!--          })-->
<!--      }-->
<!--    },-->
<!--    //调用-->
<!--    mounted () {-->
<!--      this.loadStatus()-->
<!--      this.timer = setInterval(this.loadStatus, 10000)-->
<!--      this.$nextTick(function () {-->
<!--        this.drawLine('main')-->
<!--      })-->
<!--    },-->
<!--    beforeDestroy () {-->
<!--      clearInterval(this.timer)-->
<!--    }-->
<!--  }-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
