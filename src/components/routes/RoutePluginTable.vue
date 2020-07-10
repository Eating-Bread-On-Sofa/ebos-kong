<template>
  <div>
  <el-container>
    <el-aside width="12.5%"></el-aside>
    <el-main>
    <el-row>
      <el-col :span="12" style="left: 0px"><div style="font-weight: bold;font-size: 24px;float: left;margin-left: 10px;margin-top: 20px">
        路由插件信息
      </div></el-col>
      <el-col :span="12"><div style="text-align:right;position: absolute;bottom: 0px;right: 0px">
        <el-button size="small" @click="addRoutePlugin" type="success" icon="el-icon-edit">添加插件</el-button>
      </div></el-col>
    </el-row>
    <el-row>
      <el-table
        style="width: 100%;margin-top: 10px"
        :data="plugins.slice((currentPage-1)*pageSize,currentPage*pageSize)">
        <el-table-column
          prop="id"
          label="id">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="插件名称">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="scope"
          label="作用域">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.scope }}</span>
          </template>
        </el-table-column>
<!--        <el-table-column-->
<!--          prop="service"-->
<!--          label="适用服务"-->
<!--          width="180px">-->
<!--          <template slot-scope="scope">-->
<!--            <span style="margin-left: 0px">{{ scope.row.service == null ? '' : scope.row.service.id}}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="route"-->
<!--          label="适用路由"-->
<!--          width="180px">-->
<!--          <template slot-scope="scope">-->
<!--            <span style="margin-left: 0px">{{ scope.row.route == null ? '' : scope.row.route.id}}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column
          prop="consumer"
          label="消费者">
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
    </el-main>
  </el-container>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'RoutePluginTable',
    inject: ['reload'],
    data () {
      return {
        routerId: '',
        plugins: [],
        value: [],
        currentPage: 1,
        pageSize: 6
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
      loadPlugins () {
        // let _this = this
        this.$axios.get(localStorage.address + '/routes/' + this.$route.params.routeId + '/plugins')
          .then(response => {
            this.plugins = response.data.data
            this.plugins = this.sortKey(this.plugins, 'created_at')
            this.plugins.map(function (plugin) {
              let createDate = moment.unix(plugin.created_at)
              plugin.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
            })
            for(var i = 0; i < this.plugins.length; i++) {
              this.plugins[i].scope = '路由'
            }
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
          })
      },
      addRoutePlugin () {
        // console.log(this.$route.params.routeId)
        this.$store.commit('saveIsAdd', true)
        this.$router.push('/plugins/add/route/' + this.$route.params.routeId)
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
      editPlugin (index, pluginId) {
        this.$store.commit('saveIsAdd', false)
        this.$router.push('/plugins/edit/' + pluginId)
      }
    }
  }
</script>

<style scoped>

</style>
