<template>
  <div>
    <el-container>
      <el-aside width="12.5%"></el-aside>
      <el-main>
        <add-upstream ref="addUpstream"></add-upstream>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px">
          <el-breadcrumb-item :to="{ path: '/info' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/upstreams' }">代理网关列表</el-breadcrumb-item>
          <!--          <template><el-breadcrumb-item></el-breadcrumb-item></template>-->
          <!--          <add-route ref="addRouteList"></add-route>-->

        </el-breadcrumb>
        <el-row>
          <el-col :span="12"><div></div></el-col>
          <el-col :span="12"><div style="text-align:right;position: absolute;bottom: -5px;right: 50px">
            <!--@click="addService"-->
            <el-button size="small" type="primary" @click="addUpstream">添加代理网关</el-button>
          </div></el-col>
        </el-row>
        <el-row>
          <el-table
            style="width: 100%;margin-top: 10px"
            :data="upstreams.slice((currentPage-1)*pageSize,currentPage*pageSize)">
            <el-table-column
              prop="id"
              label="id"
              width="300px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="网关名称"
              >
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createAtStr"
              label="创建时间"
              width="220px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.createAtStr }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="hash_on"
              label="哈希算法"
              width="280px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.hash_on }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="operation"
              label="操作"
              width="300px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">
                  <!-- @click="handleEdit(scope.$index,scope.row.id)-->
                  <!-- @click="deleteDialog(scope.$index,scope.row.id)"-->
                  <!--@click="editTarget(scope.$index,scope.row.id)"-->
                  <el-button size="mini" @click="editUpstream(scope.$index,scope.row.id)" type="primary">查看代理网关</el-button>
                  <el-button size="mini" @click="showTargetList(scope.$index,scope.row.id)" type="success">查看终端</el-button>
                  <el-button size="mini" @click="deleteUpstream(scope.$index,scope.row.id)" type="danger">删除</el-button>
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
          :total="upstreams.length">
        </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  // 时间格式化工具
  import moment from 'moment'
  import AddUpstream from './AddUpstream'
  // import AddRoute from './AddRoute'
  export default {
    name: 'UpstreamsList',
    inject: ['reload'],
    components: {
      AddUpstream
    },
    data () {
      return {
        currentPage: 1,
        pageSize: 6,
        upstreams: []
      }
    },
    created () {
      if (!localStorage.upCurrentPage) {
        localStorage.setItem('upCurrentPage', this.currentPage)
      }
      // 如果为firstIndex为1，则讲页数置为1，否则页数为本地缓存的页数
      if (this.$store.state.upFirstIndex === 1) {
        this.currentPage = 1
      } else {
        this.currentPage = parseInt(localStorage.upCurrentPage)
      }
    },
    mounted () {
      this.loadUpstreams()
    },
    methods: {
      sortKey (array, key) {
        return array.sort(function (a, b) {
          var x = a[key]
          var y = b[key]
          return x > y ? -1 : x < y ? 1 : 0
        });
      },
      loadUpstreams (offset) {
        let _this = this
        let url
        if (offset) {
          url = localStorage.address + '/upstreams?offset=' + offset + '&size=10'
        } else {
          url = localStorage.address + '/upstreams'
        }
        this.$axios.get(url)
          .then(response => {
            // console.log(response.data.data)
            _this.upstreams = response.data.data
            this.upstreams = this.sortKey(this.upstreams, 'created_at')
            // console.log(_this.consumers)
            // _this.reload()
            // this.consumers = []
            // 合并数组
            // Array.prototype.push.apply(this.routes, response.data.data)
            // // console.log(this.routes)
            this.upstreams.map(function (upstream) {
              let createDate = moment.unix(upstream.created_at)
              upstream.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
              // consumer.serviceName = ''
            })
          })
          .catch((error) => {
            if (error.response === undefined) {
              this.$Message.error('无法连接KONG网关~')
            } else {
              this.$Message.error(error.response.message)
            }
          })
      },
      editUpstream (index, upstreamId) {
        this.$refs.addUpstream.titleName = '修改上游'
        this.getUpstream(upstreamId)
        this.$refs.addUpstream.upstreamId = upstreamId
        // console.log(upstreamId)
        this.$refs.addUpstream.dialogFormVisble = true
        // this.$router.push('/upstreams/edit/' + upstreamId)
      },
      handleCurrentChange: function (currentPage) {
        if (currentPage !== 1) {
          this.$store.commit('saveUpFirstIndex', 0)
        }
        this.currentPage = currentPage
        localStorage.upCurrentPage = currentPage
        // console.log(this.currentPage)
      },
      addUpstream () {
        // this.getRoute(routeId)
        this.$refs.addUpstream.dialogFormVisble = true
      },
      // 当进行修改上游时，调用此方法获取到上游信息并回显
      getUpstream (upstreamId) {
        this.$axios.get(localStorage.address + '/upstreams/' + upstreamId)
          .then(resp => {
            // console.log(resp.data)
            this.$refs.addUpstream.formData = resp.data
            // let formData = this.$refs.addRouteList.formData
            // formData.name = resp.data.name === null ? '' : resp.data.name
            // formData.protocols = resp.data.protocols
            // formData.methods = resp.data.methods === null ? [] : resp.data.methods
            // formData.hosts = resp.data.hosts === null ? '' : resp.data.hosts
            // formData.paths = resp.data.paths === null ? '' : resp.data.paths
            // formData.regex_priority = resp.data.regex_priority
            // formData.strip_path = resp.data.strip_path
            // formData.preserve_host = resp.data.preserve_host
            // formData.snis = resp.data.snis
            // formData.sources = resp.data.sources
            // formData.destinations = resp.data.destinations
            // this.$refs.addRouteList.routeId = resp.data.id
            // this.$refs.addRouteList.formData.service.id = resp.data.service.id
            // localStorage.setItem('serviceId', resp.data.service.id)
            // console.log(localStorage.getItem('serviceId'))
            // console.log(this.$refs.addRoute.routeId)
            // console.log(formData)
          })
      },
      deleteUpstream (index, upstreamId) {
        let _this = this
        this.$confirm('是否删除id为【' + upstreamId + '】的上游？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios.delete(localStorage.address + '/upstreams/' + upstreamId)
            .then((response) => {
              if (response && response.status === 204) {
                this.$Message.success('id为【' + upstreamId + '】的上游已删除')
                _this.reload()
              }
            })
        }).catch(() => {
          this.$Message.info('已取消删除')
        })
      },
      showTargetList (index, upstreamId) {
        this.$router.push('/targets/' + upstreamId)
      }
    }
  }
</script>

<style scoped>

</style>
