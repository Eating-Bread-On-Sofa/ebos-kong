<template>
  <div>
    <el-container>
      <el-aside width="12.5%"></el-aside>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px">
          <el-breadcrumb-item :to="{ path: '/info' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/plugins' }">插件列表</el-breadcrumb-item>
          <!--          <template><el-breadcrumb-item></el-breadcrumb-item></template>-->
        </el-breadcrumb>
        <el-row>
          <el-col :span="12"><div></div></el-col>
          <el-col :span="12"><div style="text-align:right;position: absolute;bottom: -5px;right: 0px">
            <!--@click="addService"-->
            <el-button size="small" @click="addPlugin" type="primary">添加插件</el-button>
          </div></el-col>
        </el-row>
        <el-row>
          <el-table
            style="width: 100%;margin-top: 10px"
            :data="plugins.slice((currentPage-1)*pageSize,currentPage*pageSize)">
            <el-table-column
              prop="id"
              label="id"
              width="160px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="插件名称"
              width="160px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="scope"
              label="作用域"
              width="100px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.scope }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="service"
              label="适用服务"
              width="180px"
              ref="appService">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.service == null ? '' : scope.row.service.id}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="route"
              label="适用路由"
              width="180px"
              ref="appRoute">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.route == null ? '' : scope.row.route.id}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="consumer"
              label="消费者"
              width="180px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.consumer == null ? '所有消费者' : scope.row.consumer }}</span>
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
              prop="operation"
              label="操作">
              <template slot-scope="scope">
                <span style="margin-left: 0px">
                  <!--@click="editCertificate(scope.$index,scope.row.id)"-->
                  <el-button size="small" @click="editPlugin(scope.$index,scope.row.id)" type="primary">查看</el-button>
                  <el-button size="small" @click="deletePlugin(scope.$index,scope.row.id)" type="danger">删除</el-button>
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
          :total="plugins.length">
        </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  // 时间格式化工具
  import moment from 'moment'
  export default {
    name: 'PluginsList',
    inject: ['reload'],
    components: {},
    data () {
      return {
        loading: true,
        currentPage: 1,
        pageSize: 6,
        offset: '',
        plugins: []
      }
    },
    created () {
      if (!localStorage.pluCurrentPage) {
        localStorage.setItem('pluCurrentPage', this.currentPage)
      }
      // 如果为firstIndex为1，则讲页数置为1，否则页数为本地缓存的页数
      if (this.$store.state.pluFirstIndex === 1) {
        this.currentPage = 1
      } else {
        this.currentPage = parseInt(localStorage.pluCurrentPage)
      }
    },
    mounted () {
      this.loadPlugins()
    },
    methods: {
      sortKey (array, key) {
        return array.sort(function (a, b) {
          var x = a[key]
          var y = b[key]
          return x > y ? -1 : x < y ? 1 : 0
        });
      },
      loadPlugins (offset) {
        let _this = this
        let url
        if (offset) {
          url = localStorage.address + '/plugins?offset=' + offset + '&size=10'
        } else {
          url = localStorage.address + '/plugins'
        }
        this.$axios.get(url)
          .then((response) => {
            // console.log(response.data.data)
            if (response && response.status === 200) {
              this.plugins = response.data.data
              this.plugins = this.sortKey(this.plugins, 'created_at')
              this.plugins.map(function (plugin) {
                let createDate = moment.unix(plugin.created_at)
                plugin.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
              })
              for(var i = 0; i < this.plugins.length; i++) {
                if (!this.plugins[i].service && !this.plugins[i].route) {
                  this.plugins[i].scope = '全局'
                } else if (!this.plugins[i].service && this.plugins[i].route) {
                  this.plugins[i].scope = '路由'
                } else if (this.plugins[i].service && this.plugins[i].route) {
                  this.plugins[i].scope = '服务、路由'
                } else {
                  this.plugins[i].scope = '服务'
                }
              }
              // console.log(this.plugins)
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
      editPlugin (index, pluginId) {
        this.$store.commit('saveIsAdd', false)
        this.$router.push('/plugins/edit/' + pluginId)
      },
      handleCurrentChange: function (currentPage) {
        if (currentPage !== 1) {
          this.$store.commit('savePluFirstIndex', 0)
        }
        this.currentPage = currentPage
        localStorage.pluCurrentPage = currentPage
        // console.log(this.currentPage)
      },
      deletePlugin (index, pluginId) {
        let _this = this
        this.$confirm('是否删除id为【' + pluginId + '】的插件？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios.delete(localStorage.address + '/plugins/' + pluginId)
            .then((response) => {
              if (response && response.status === 204) {
                this.$Message.success('id为【' + pluginId + '】的插件已删除')
                _this.reload()
              }
            })
        }).catch(() => {
          this.$Message.info('已取消删除')
        })
      },
      addPlugin () {
        this.$store.commit('saveIsAdd', true)
        this.$router.push('/plugins/add')
      }
    }
  }
</script>

<style scoped>

</style>
