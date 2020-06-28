<!--<template>-->
<!--  <div>-->
<!--    <el-container>-->
<!--      <el-aside width="12.5%"></el-aside>-->
<!--      <el-main>-->
<!--        <el-row>-->
<!--          <el-col :span="24">-->
<!--            <span class="panel-title-text">服务器资源总览表</span>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--        <el-row>-->
<!--          <el-table-->
<!--            style="width: 100%;margin-top: 10px"-->
<!--            :data="serverInfos">-->
<!--            <el-table-column-->
<!--              prop="systemInfo"-->
<!--              label="系统类型">-->
<!--              <template slot-scope="scope">-->
<!--                <span style="margin-left: 0px">{{ scope.row.systemInfo }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="nodename"-->
<!--              label="主机名">-->
<!--              <template slot-scope="scope">-->
<!--                <span style="margin-left: 0px">{{ scope.row.nodename }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="memoryVal"-->
<!--              label="内存">-->
<!--              <template slot-scope="scope">-->
<!--                <span style="margin-left: 0px">{{ scope.row.memoryVal }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="cpuTotal"-->
<!--              label="CPU核">-->
<!--              <template slot-scope="scope">-->
<!--                <span style="margin-left: 0px">{{ scope.row.cpuTotal }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="bootTime"-->
<!--              label="运行时间">-->
<!--              <template slot-scope="scope">-->
<!--                <span style="margin-left: 0px">{{ scope.row.bootTime }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            &lt;!&ndash;            <el-table-column&ndash;&gt;-->
<!--            &lt;!&ndash;              prop="port"&ndash;&gt;-->
<!--            &lt;!&ndash;              label="分区使用率">&ndash;&gt;-->
<!--            &lt;!&ndash;              <template slot-scope="scope">&ndash;&gt;-->
<!--            &lt;!&ndash;                <span style="margin-left: 0px">{{ scope.row.port }}</span>&ndash;&gt;-->
<!--            &lt;!&ndash;              </template>&ndash;&gt;-->
<!--            &lt;!&ndash;            </el-table-column>&ndash;&gt;-->
<!--            &lt;!&ndash;            <el-table-column&ndash;&gt;-->
<!--            &lt;!&ndash;              prop="updated_at"&ndash;&gt;-->
<!--            &lt;!&ndash;              label="CPU使用率">&ndash;&gt;-->
<!--            &lt;!&ndash;              <template slot-scope="scope">&ndash;&gt;-->
<!--            &lt;!&ndash;                <span style="margin-left: 0px">{{ scope.row.updatedAtStr }}</span>&ndash;&gt;-->
<!--            &lt;!&ndash;              </template>&ndash;&gt;-->
<!--            &lt;!&ndash;            </el-table-column>&ndash;&gt;-->
<!--            &lt;!&ndash;            <el-table-column&ndash;&gt;-->
<!--            &lt;!&ndash;              prop="operation"&ndash;&gt;-->
<!--            &lt;!&ndash;              label="内存使用率">&ndash;&gt;-->
<!--            &lt;!&ndash;              <template slot-scope="scope">&ndash;&gt;-->
<!--            &lt;!&ndash;                <span style="margin-left: 0px">{{ scope.row.updatedAtStr }}</span>&ndash;&gt;-->
<!--            &lt;!&ndash;              </template>&ndash;&gt;-->
<!--            &lt;!&ndash;            </el-table-column>&ndash;&gt;-->
<!--            &lt;!&ndash;            <el-table-column&ndash;&gt;-->
<!--            &lt;!&ndash;              prop="updated_at"&ndash;&gt;-->
<!--            &lt;!&ndash;              label="下载带宽">&ndash;&gt;-->
<!--            &lt;!&ndash;              <template slot-scope="scope">&ndash;&gt;-->
<!--            &lt;!&ndash;                <span style="margin-left: 0px">{{ scope.row.updatedAtStr }}</span>&ndash;&gt;-->
<!--            &lt;!&ndash;              </template>&ndash;&gt;-->
<!--            &lt;!&ndash;            </el-table-column>&ndash;&gt;-->
<!--            &lt;!&ndash;            <el-table-column&ndash;&gt;-->
<!--            &lt;!&ndash;              prop="updated_at"&ndash;&gt;-->
<!--            &lt;!&ndash;              label="上传带宽">&ndash;&gt;-->
<!--            &lt;!&ndash;              <template slot-scope="scope">&ndash;&gt;-->
<!--            &lt;!&ndash;                <span style="margin-left: 0px">{{ scope.row.updatedAtStr }}</span>&ndash;&gt;-->
<!--            &lt;!&ndash;              </template>&ndash;&gt;-->
<!--            &lt;!&ndash;            </el-table-column>&ndash;&gt;-->
<!--          </el-table>-->
<!--        </el-row>-->
<!--      </el-main>-->
<!--    </el-container>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--  export default {-->
<!--    name: 'ServerInfo',-->
<!--    data () {-->
<!--      return {-->
<!--        serverInfos: [],-->
<!--        job: []-->
<!--      }-->
<!--    },-->
<!--    mounted () {-->
<!--      // console.log(this.serverInfo.memoryVal)-->
<!--      this.loadServerInfo()-->
<!--      // if (this.serverInfo[0].memoryVal) {-->
<!--      //   this.loadMemory()-->
<!--      // }-->
<!--      // this.load1()-->
<!--      // this.timer = setInterval(this.loadServerInfo, 5000)-->
<!--    },-->
<!--    methods: {-->
<!--      loadServerInfo () {-->
<!--        let _this = this-->
<!--        // let job-->
<!--        // let job = []-->
<!--        // let instances = []-->
<!--        this.$axios.get('/query?query=node_uname_info')-->
<!--          .then((response) => {-->
<!--            console.log(response.data.data.result)-->
<!--            _this.serverInfo = new Array(response.data.data.result.length)-->
<!--            for (var i = 0; i < response.data.data.result.length; i++) {-->
<!--              let j = i-->
<!--              _this.serverInfo[j] = {}-->
<!--              _this.serverInfo[j].systemInfo = response.data.data.result[j].metric.sysname + '【' + response.data.data.result[j].metric.machine + '】'-->
<!--              _this.serverInfo[j].nodename = response.data.data.result[j].metric.nodename-->
<!--              _this.serverInfo[j].memoryVal = ''-->
<!--              console.log(_this.serverInfo[j])-->
<!--              _this.job[j] = response.data.data.result[j].metric.job-->
<!--            }-->
<!--          })-->
<!--      }-->
<!--      // loadMemory () {-->
<!--      //   // console.log(this.job)-->
<!--      //   let _this = this-->
<!--      //   // console.log(this.serverInfo)-->
<!--      //   for (var i = 0; i < _this.serverInfo.length; i++) {-->
<!--      //     this.$axios.get('/query?query=node_memory_MemTotal_bytes{job=~"' + _this.job[i] + '"}')-->
<!--      //       .then((resp) => {-->
<!--      //         // _this.serverInfo[i].memoryVal = ''-->
<!--      //         let val = resp.data.data.result[0].value[1]-->
<!--      //         _this.serverInfo[i].memoryVal = val-->
<!--      //         console.log(_this.serverInfo[i].memoryVal)-->
<!--      //       })-->
<!--      //   }-->
<!--      //   // this.$forceUpdate()-->
<!--      // }-->
<!--    }-->
<!--  }-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
