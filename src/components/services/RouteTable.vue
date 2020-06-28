<template>
    <div>
      <el-row>
        <add-route ref="addRoute"></add-route>
        <el-col :span="12" style="left: 0px"><div style="font-weight: bold;font-size: 24px;float: left;margin-left: 10px;margin-top: 20px">
          路由信息:
        </div></el-col>
        <el-col :span="12"><div style="text-align:right;position: absolute;bottom: 0px;right: 0px">
          <el-button size="small" type="primary" @click="addRoute" icon="el-icon-edit">添加路由</el-button>
        </div></el-col>
      </el-row>
      <el-row>
        <el-table
          :data="routes"
          style="width: 100%;margin-top: 10px">
          <el-table-column
            prop="id"
            label="id">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            prop="tags"-->
<!--            label="标签">-->
<!--            <template slot-scope="scope">-->
<!--              <span style="margin-left: 0px">{{ scope.row.tags }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
            prop="hosts"
            label="主机"
            width="160px">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.hosts }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="paths"
            label="路径"
            width="160px">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.paths }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="创建时间"
            width="160px">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.createAtStr }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="protocols"
            label="协议">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.protocols }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作">
            <template slot-scope="scope">
                <span style="margin-left: 0px">
                  <el-button size="mini" @click="editRoute(scope.$index, scope.row.id)" type="primary">查看</el-button>
                  <el-button size="mini" @click="deleteRoute(scope.$index, scope.row.id)" type="danger">删除</el-button>
                </span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
</template>

<script>
  import AddRoute from '../routes/AddRoute'
  export default {
    name: 'RouteTable',
    inject: ['reload'],
    components: {AddRoute},
    data () {
      return {
        routes: []
      }
    },
    methods: {
      addRoute () {
        this.$refs.addRoute.titleName = '添加路由'
        this.$refs.addRoute.dialogFormVisble = true
      },
      editRoute (index, routeId) {
        // console.log(routeId)
        this.$refs.addRoute.titleName = '修改路由'
        this.getRoute(routeId)
        this.$refs.addRoute.dialogFormVisble = true
      },
      // 当进行修改服务时，调用此方法获取到服务信息并回显
      getRoute (routeId) {
        this.$axios.get(localStorage.address + '/routes/' + routeId)
          .then(resp => {
            // console.log(resp.data)
            let formData = this.$refs.addRoute.formData
            formData.name = resp.data.name === null ? '' : resp.data.name
            formData.protocols = resp.data.protocols
            formData.methods = resp.data.methods === null ? [] : resp.data.methods
            formData.hosts = resp.data.hosts === null ? '' : resp.data.hosts
            formData.paths = resp.data.paths === null ? '' : resp.data.paths
            formData.regex_priority = resp.data.regex_priority
            formData.strip_path = resp.data.strip_path
            formData.preserve_host = resp.data.preserve_host
            formData.snis = resp.data.snis
            formData.sources = resp.data.sources
            formData.destinations = resp.data.destinations
            this.$refs.addRoute.routeId = resp.data.id
            // console.log(this.$refs.addRoute.routeId)
            // console.log(formData)
          })
      },
      deleteRoute (index, routeId) {
        let _this = this
        this.$confirm('是否删除id为【' + routeId + '】的路由？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios.delete(localStorage.address + '/routes/' + routeId)
            .then((response) => {
              if (response && response.status === 204) {
                this.$Message.success('id为【' + routeId + '】的路由已删除')
                this.reload()
              }
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
