<template>
  <div>
    <el-container>
      <el-aside width="12.5%"></el-aside>
      <el-main>
<!--&lt;!&ndash;        <el-row>&ndash;&gt;-->
<!--          <el-col :span="24"><div class="grid-content-title bg-purple-dark">Kong节点信息</div></el-col>-->
<!--        </el-row>-->
        <el-row>
          <el-table
            border
            style="width: 100%"
            :data="basicInfo.slice((currentPage-1)*pageSize,currentPage*pageSize)">
            <el-table-column
              prop="basicInfo_key"
              label="基本信息"
              width="300px"
              header-align="center"
            >
              <template slot-scope="scope">
                <span style="margin-left: 20px">{{ scope.row.basicInfo_key }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="basicInfo_value"
              label="">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.basicInfo_value }}</span>
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
            :total="basicInfo.length">
          </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'BasicInfo.vue',
    data () {
      return {
        currentPage: 1,
        pageSize: 10,
        basicInfo: [{
          basicInfo_key: 'hostname',
          basicInfo_value: ''
        }, {
          basicInfo_key: 'version',
          basicInfo_value: ''
        }, {
          basicInfo_key: 'node_id',
          basicInfo_value: ''
        }, {
          basicInfo_key: 'tagline',
          basicInfo_value: ''
        }, {
          basicInfo_key: '已配置插件',
          basicInfo_value: ''
        }, {
          basicInfo_key: 'prefix',
          basicInfo_value: ''
        }, {
          basicInfo_key: 'admin_listen',
          basicInfo_value: ''
        }, {
          basicInfo_key: 'proxy_listen',
          basicInfo_value: ''
        }, {
          basicInfo_key: '数据库更新频率',
          basicInfo_value: ''
        }, {
          basicInfo_key: 'nginx_conf',
          basicInfo_value: ''
        }, {
          basicInfo_key: 'nginx_pid',
          basicInfo_value: ''
        }, {
          basicInfo_key: '数据库类型',
          basicInfo_value: ''
        }, {
          basicInfo_key: 'pg_数据库',
          basicInfo_value: ''
        }, {
          basicInfo_key: 'pg_数据库端口',
          basicInfo_value: ''
        }, {
          basicInfo_key: '数据库连接状态',
          basicInfo_value: ''
        }, {
          basicInfo_key: '客户端请求总数',
          basicInfo_value: ''
        }, {
          basicInfo_key: '当前活动连接数',
          basicInfo_value: ''
        }, {
          basicInfo_key: '已接受的客户端连接数',
          basicInfo_value: ''
        }, {
          basicInfo_key: '已处理的客户端连接数',
          basicInfo_value: ''
        }, {
          basicInfo_key: 'Kong正在读取请求标头的当前连接数',
          basicInfo_value: ''
        }, {
          basicInfo_key: 'nginx正在响应客户端的当前连接数',
          basicInfo_value: ''
        }, {
          basicInfo_key: '当前等待请求的客户端连接数',
          basicInfo_value: ''
        }]
      }
    },
    created () {
      if (!localStorage.basicCurrentPage) {
        localStorage.setItem('basicCurrentPage', this.currentPage)
      }
      this.currentPage = parseInt(localStorage.basicCurrentPage)
    },
    mounted () {
      this.loadBasicInfo()
      this.loadStatus()
    },
    methods: {
      loadBasicInfo () {
        let _this = this
        this.$axios.get('/')
          .then(response => {
            if (response) {
              let kongInfo = response.data
              _this.basicInfo[0].basicInfo_value = kongInfo.hostname
              _this.basicInfo[1].basicInfo_value = kongInfo.version
              _this.basicInfo[2].basicInfo_value = kongInfo.node_id
              _this.basicInfo[3].basicInfo_value = kongInfo.tagline
              _this.basicInfo[4].basicInfo_value = kongInfo.plugins.enabled_in_cluster.toString()
              _this.basicInfo[5].basicInfo_value = kongInfo.configuration.prefix
              _this.basicInfo[6].basicInfo_value = kongInfo.configuration.admin_listen
              _this.basicInfo[7].basicInfo_value = kongInfo.configuration.proxy_listen
              _this.basicInfo[8].basicInfo_value = kongInfo.configuration.db_update_frequency + 's'
              _this.basicInfo[9].basicInfo_value = kongInfo.configuration.nginx_conf
              _this.basicInfo[10].basicInfo_value = kongInfo.configuration.nginx_pid
              _this.basicInfo[11].basicInfo_value = kongInfo.configuration.database
              _this.basicInfo[12].basicInfo_value = kongInfo.configuration.pg_database
              _this.basicInfo[13].basicInfo_value = kongInfo.configuration.pg_port
              // console.log(_this.basicInfo)
            }
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
          })
      },
      loadStatus () {
        let _this = this
        this.$axios.get('/status')
          .then(response => {
            if (response) {
              let kongStatus = response.data
              _this.basicInfo[14].basicInfo_value = kongStatus.database.reachable.toString()
              _this.basicInfo[15].basicInfo_value = kongStatus.server.total_requests
              _this.basicInfo[16].basicInfo_value = kongStatus.server.connections_active
              _this.basicInfo[17].basicInfo_value = kongStatus.server.connections_accepted
              _this.basicInfo[18].basicInfo_value = kongStatus.server.connections_handled
              _this.basicInfo[19].basicInfo_value = kongStatus.server.connections_reading
              _this.basicInfo[20].basicInfo_value = kongStatus.server.connections_writing
              _this.basicInfo[21].basicInfo_value = kongStatus.server.connections_waiting
            }
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
          })
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage
        localStorage.basicCurrentPage = currentPage
        console.log(this.currentPage)
      }
    }
  }
</script>

<style scoped>
  /*.bg-purple {*/
  /*  background: #d3dce6;*/
  /*}*/
  /*.grid-content {*/
  /*  border-radius: 0px;*/
  /*  min-height: 36px;*/
  /*}*/

  /*.el-main {*/
  /*  background-color: white;*/
  /*  color: #333;*/
  /*  text-align: center;*/
  /*  !*line-height: 800px;*!*/
  /*  !*margin-top: 0px;*!*/
  /*}*/

  /*.breadcrumb-item {*/
  /*  cursor: pointer;*/
  /*}*/
  /*.el-row {*/
  /*  margin-bottom: 20px;*/
  /*  &:last-child {*/
  /*     margin-bottom: 0;*/
  /*   }*/
  /*}*/
  /*.el-col {*/
  /*  border-radius: 4px;*/
  /*}*/
  /*.bg-purple-dark {*/
  /*  background: white;*/
  /*}*/
  /*.bg-purple {*/
  /*  background: #d3dce6;*/
  /*}*/
  /*.bg-purple-light {*/
  /*  background: #e5e9f2;*/
  /*}*/
  /*.grid-content-title {*/
  /*  border-radius: 4px;*/
  /*  min-height: 36px;*/
  /*  float: left;*/
  /*}*/

  /*.panel-title {*/
  /*  margin-top: 0;*/
  /*  margin-bottom: 0;*/
  /*  font-size: 15px;*/
  /*  border: 1px solid;*/
  /*  border-radius: 5px;*/
  /*  background-clip: padding-box;*/
  /*  background: #fff;*/
  /*  border: 1px solid #eaeaea;*/
  /*  box-shadow: 0 0 25px #cac6c6;*/
  /*  width: 800px;*/
  /*  height: 300px;*/
  /*}*/

</style>
