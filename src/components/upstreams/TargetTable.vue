<template>
  <div>
    <el-container>
      <el-aside width="12.5%"></el-aside>
      <el-main>
        <add-target ref="addTarget"></add-target>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px">
          <el-breadcrumb-item :to="{ path: '/info' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/upstreams' }">上游列表</el-breadcrumb-item>
          <el-breadcrumb-item>终端</el-breadcrumb-item>
          <!--          <template><el-breadcrumb-item></el-breadcrumb-item></template>-->
        </el-breadcrumb>
        <el-row>
          <el-col :span="12"><div></div></el-col>
          <el-col :span="12"><div style="text-align:right;position: absolute;bottom: -5px;right: 0px">
            <el-button size="small" @click="addTarget" type="primary">添加终端</el-button>
          </div></el-col>
        </el-row>
        <el-row>
          <el-table
            style="width: 100%;margin-top: 10px"
            :data="targets.slice((currentPage-1)*pageSize,currentPage*pageSize)">
            <el-table-column
              prop="id"
              label="id">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="target"
              label="终端名称">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.target }}</span>
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
<!--            <el-table-column-->
<!--              prop="health"-->
<!--              label="健康状态">-->
<!--              <template slot-scope="scope">-->
<!--                <i v-if="scope.row.health == 'HEALTHCHECKS_OFF'" class="el-icon-warning-outline"></i>-->
<!--                <span v-if="scope.row.health == 'HEALTHCHECKS_OFF'" style="margin-left: 0px">健康检查未开启</span>-->
<!--                <i v-if="scope.row.health == 'HEALTHY'" class="el-icon-success"></i>-->
<!--                <span v-if="scope.row.health == 'HEALTHY'" style="margin-left: 0px">健康</span>-->
<!--                <i v-if="scope.row.health == 'UNHEALTHY'" class="el-icon-error"></i>-->
<!--                <span v-if="scope.row.health == 'UNHEALTHY'" style="margin-left: 0px">不健康</span>-->
<!--                <i v-if="scope.row.health == 'DNS_ERROR'" class="el-icon-close"></i>-->
<!--                <span v-if="scope.row.health == 'DNS_ERROR'" style="margin-left: 0px">DNS解析出错</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
            <el-table-column
              prop="operation"
              label="操作">
              <template slot-scope="scope">
                <span style="margin-left: 0px">
                  <el-button size="small" type="danger" @click="deleteDialog(scope.$index,scope.row.id)">删除</el-button>
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
          :total="targets.length">
        </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  // 时间格式化工具
  import moment from 'moment'
  import AddTarget from './AddTarget'
  export default {
    name: 'TargetTable',
    inject: ['reload'],
    components: {AddTarget},
    data () {
      return {
        loading: true,
        currentPage: 1,
        pageSize: 6,
        targets: [],
        offset: '',
        offsetStack: [],
        isFlag: true,
        upstreamId: ''
      }
    },
    created () {
      if (!localStorage.tarCurrentPage) {
        localStorage.setItem('tarCurrentPage', this.currentPage)
      }
      // 如果为firstIndex为1，则讲页数置为1，否则页数为本地缓存的页数
      if (this.$store.state.tarFirstIndex === 1) {
        this.currentPage = 1
      } else {
        this.currentPage = parseInt(localStorage.tarCurrentPage)
      }
    },
    mounted () {
      // console.log(this.$route.params.upstreamId)
      this.upstreamId = this.$route.params.upstreamId
      // console.log(this.upstreamId)
      this.loadTargets()
      // console.log(this.targets)
      // this.loadHealth()
    },
    methods: {
      sortKey (array, key) {
        return array.sort(function (a, b) {
          var x = a[key]
          var y = b[key]
          return x > y ? -1 : x < y ? 1 : 0
        });
      },
      loadTargets () {
        let _this = this
        // let targetsHealth = []
        // this.$axios.get(localStorage.address + '/upstreams/' + this.upstreamId + '/health/')
        //   .then((response) => {
        //     // console.log(response.data.data)
        //     // targetsHealth = response.data.data
        //     // console.log(targetsHealth)
        //     for(var i = 0; i < response.data.data.length; i++) {
        //       targetsHealth[i] = response.data.data[i].health
        //     }
        //     // console.log(targetsHealth)
        //     // _this.targets = response.data.data
        //     // console.log(response.data.data)
        //     // _this.targets.map(function (target) {
        //     // let createDate = moment.unix(target.created_at)
        //     // target.health = response.data.data
        //     // target.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
        //     // })
        //   })
        //   .catch(() => {
        //     this.$Message.success('服务器内部出现问题~')
        //   })
        // console.log(targetsHealth)
        this.$axios.get(localStorage.address + '/upstreams/' + this.upstreamId + '/targets')
          .then((response) => {
            _this.targets = response.data.data
            _this.targets = this.sortKey(this.targets, 'created_at')
            // console.log(_this.targets)
            // for (var i = 0; i < _this.targets.length; i++) {
              //   _this.targets[i].health = targetsHealth[i]
              // }
            _this.targets.map(function (target) {
              let createDate = moment.unix(target.created_at)
              target.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
            })
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
          })
      },
      // loadHealth () {
      //   let _this = this
      //   this.$axios.get('/upstreams/' + this.upstreamId + '/health/')
      //     .then((response) => {
      //       // console.log(response.data.data)
      //       let targetsHealth = response.data.data
      //       // console.log(targetsHealth)
      //       for(var i = 0; i < targetsHealth.length; i++) {
      //         _this.targets[i].health = targetsHealth[i].health
      //       }
      //       // console.log(_this.targets)
      //       // _this.targets = response.data.data
      //       // console.log(response.data.data)
      //       // _this.targets.map(function (target) {
      //       // let createDate = moment.unix(target.created_at)
      //       // target.health = response.data.data
      //       // target.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
      //       // })
      //     })
      //   // .catch((e) => {
      //   //   console.log(e.response)
      //   // })
      // },
      handleCurrentChange: function (currentPage) {
        if (currentPage !== 1) {
          this.$store.commit('saveTarFirstIndex', 0)
        }
        this.currentPage = currentPage
        localStorage.tarCurrentPage = currentPage
        // console.log(this.currentPage)
      },
      addTarget () {
        // this.$store.state.addOrEdit = 'add'2
        this.$refs.addTarget.upstreamId = this.$route.params.upstreamId
        this.$refs.addTarget.dialogFormVisble = true
      },
      deleteDialog (index, targetId) {
        let _this = this
        this.$confirm('是否删除id为【' + targetId + '】的终端？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios.delete(localStorage.address + '/upstreams/' + this.upstreamId + '/targets/' + targetId)
            .then((response) => {
              if (response && response.status === 204) {
                this.$Message.success('id为【' + targetId + '】的终端已删除')
                this.loadTargets()
              }
            })
            .catch((error) => {
              // console.log(error.response)
              this.$Message.error(error.response.data.message)
            })
        }).catch(() => {
          this.$Message.info('已取消删除')
        })
      }
    }
  }
</script>

<style scoped>

</style>
