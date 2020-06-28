<template>
  <div>
    <el-row>
      <add-service ref="serviceadd"></add-service>
      <el-col :span="12" style="left: 0px"><div style="font-weight: bold;font-size: 24px;float: left;margin-left: 10px">
        服务信息:
      </div></el-col>
      <el-col :span="12"><div style="text-align:right;position: absolute;bottom: 0px;right: 0px">
        <el-button size="small" type="primary" @click="updateService" icon="el-icon-edit">修改服务</el-button>
      </div></el-col>
    </el-row>
    <el-row>
      <el-table
        :data="services"
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
<!--        <el-table-column-->
<!--          prop="tags"-->
<!--          label="标签">-->
<!--          <template slot-scope="scope">-->
<!--            <span style="margin-left: 0px">{{ scope.row.tags }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column
          prop="host"
          label="主机">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.host }}</span>
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
          prop="protocol"
          label="协议">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.protocol }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="port"
          label="端口">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.port }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.path }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updated_at"
          label="更新时间">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.updatedAtStr }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  import AddService from './AddService'
  export default {
    name: 'SingleServiceInfo',
    components: {AddService},
    data () {
      return {
        services: []
      }
    },
    methods: {
      updateService () {
        // this.$store.state.addOrEdit = 'edit'
        // this.$store.commit('saveaddOrEdit', 'edit')
        this.$refs.serviceadd.titleName = '修改服务'
        let serviceId = this.$route.params.id
        this.getService(serviceId)
        this.$refs.serviceadd.dialogFormVisble = true
      },

      // 当进行修改服务时，调用此方法获取到服务信息并回显
      getService (serviceId) {
        this.$axios.get(localStorage.address + '/services/' + serviceId)
          .then(resp => {
            // console.log(resp.data)
            let formData = this.$refs.serviceadd.formData
            formData.name = resp.data.name
            formData.retries = resp.data.retries
            formData.protocol = resp.data.protocol
            formData.host = resp.data.host
            formData.port = resp.data.port
            formData.path = resp.data.path
            formData.connect_timeout = resp.data.connect_timeout
            formData.write_timeout = resp.data.write_timeout
            formData.read_timeout = resp.data.read_timeout
            // console.log(formData)
          })
      }
    }
  }
</script>

<style scoped>

</style>
