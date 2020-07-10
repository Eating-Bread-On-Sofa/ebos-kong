<template>
    <div>
      <el-row style="height: 40px;margin-top: 30px;">
        <el-col :span="24">
          <span style="float: left;font-weight: bold;font-size: 23px"><i class="el-icon-kong50" style="margin-top: 2px"></i> &nbsp;终端健康状态</span>
<!--          <span class="el-icon-kongchajian"></span>-->
        </el-col>
      </el-row>
      <el-row style="box-shadow:1px 0px 5px #909090;">
        <!--          <target-table ref="targetTable"></target-table>-->
        <el-table
          style="width: 100%;margin-top: 0px"
          :data="targets.slice((currentPage-1)*pageSize,currentPage*pageSize)">
<!--          <el-table-column-->
<!--            prop="id"-->
<!--            label="id">-->
<!--            <template slot-scope="scope">-->
<!--              <span style="margin-left: 0px">{{ scope.row.id }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
            prop="target"
            label="终端名称">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.target }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="所属代理网关">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="weight"
            label="权重">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.weight }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="创建时间">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.createAtStr }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="health"
            label="健康状态">
            <template slot-scope="scope">
              <i v-if="scope.row.health == 'HEALTHCHECKS_OFF'" class="el-icon-warning-outline"></i>
              <span v-if="scope.row.health == 'HEALTHCHECKS_OFF'" style="margin-left: 0px">健康检查未开启</span>
              <i v-if="scope.row.health == 'HEALTHY'" class="el-icon-success"></i>
              <span v-if="scope.row.health == 'HEALTHY'" style="margin-left: 0px">健康</span>
              <i v-if="scope.row.health == 'UNHEALTHY'" class="el-icon-error"></i>
              <span v-if="scope.row.health == 'UNHEALTHY'" style="margin-left: 0px">不健康</span>
              <i v-if="scope.row.health == 'DNS_ERROR'" class="el-icon-close"></i>
              <span v-if="scope.row.health == 'DNS_ERROR'" style="margin-left: 0px">DNS解析出错</span>
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
          :total="targets.length">
        </el-pagination>
      </el-row>
    </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'HealthCheckStatus',
    data () {
      return {
        currentPage: 1,
        pageSize: 5,
        targets: [],
        upstreamsNames: [],
        timer: ''
      }
    },
    mounted () {
      this.loadAllUpstreams()
      this.timer = setInterval(this.loadAllUpstreams, 10000)
    },
    methods: {
      sortKey (array, key) {
        return array.sort(function (a, b) {
          var x = a[key]
          console.log(x)
          var y = b[key]
          console.log(y)
          return x > y ? -1 : x < y ? 1 : 0
        });
      },
      loadAllUpstreams () {
        this.targets = []
        let _this = this
        let map = new Map()
        let key = ''
        let value = ''
        this.$axios.get(localStorage.address + '/upstreams')
          .then(response => {
            // console.log(response.data.data)
            // _this.targets = response.data.data
            for (var i = 0; i < response.data.data.length; i++) {
              // console.log(response.data.data[i])
              key = response.data.data[i].id
              value = response.data.data[i].name
              map.set(key, value)
              // console.log(key)
              this.$axios.get(localStorage.address + '/upstreams/' + response.data.data[i].name + '/health/')
                // 查到的是每个上游里的多个终端
                .then((response) => {
                  // console.log(response.data.data)
                  if (response.data.data !== []) {
                    // response.data.data = this.sortKey(response.data.data, 'created_at')
                    response.data.data.map(function (target) {
                      target.name = map.get(target.upstream.id)
                      let createDate = moment.unix(target.created_at)
                      target.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
                      _this.targets.push(target)
                      // if (map.get(target.upstream.id) )
                      // console.log(map.get(target.upstream.id))
                      // console.log(target)
                    })
                  }
                })
                .catch(() => {
                  this.$Message.error('服务器内部出现问题~')
                })
            }
            // console.log(JSON.parse(JSON.stringify(_this.targets)))

            // this.upstreams = response.data.data
            // console.log(_this.consumers)
            // _this.reload()
            // this.consumers = []
            // 合并数组
            // Array.prototype.push.apply(this.routes, response.data.data)
            // // console.log(this.routes)
            // this.upstreams.map(function (upstream) {
            //   let createDate = moment.unix(upstream.created_at)
            //   upstream.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
            //   // consumer.serviceName = ''
            // })
          })
          .catch((error) => {
            if (error.response === undefined) {
              this.$Message.error('无法连接KONG网关~')
            } else {
              this.$Message.error(error.response.message)
            }
          })

      },
      handleCurrentChange: function (currentPage) {
        // if (currentPage !== 1) {
        //   this.$store.commit('saveTarFirstIndex', 0)
        // }
        this.currentPage = currentPage
        // localStorage.tarCurrentPage = currentPage
        // console.log(this.currentPage)
      }
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
  }
</script>

<style scoped>

</style>
