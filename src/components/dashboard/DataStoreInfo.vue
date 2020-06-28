<template>
  <div>
    <el-container>
      <el-header height="40px">
        <span class="el-icon-kongicon-test1" style="margin-top: 2px"></span>
        <span>数据库信息</span>
      </el-header>
      <!--      <el-main>-->
      <!--        <div style="float: left">主机名&emsp;&emsp;&emsp;&emsp;{{ hostname }}</div>-->
      <!--        <div style="float: left">tagline&emsp;&emsp;&emsp;&emsp;{{ tagline }}</div>-->
      <!--        <div style="float: left">tagline&emsp;&emsp;&emsp;&emsp;{{ tagline }}</div>-->
      <el-table
        :data="basicInfo"
        style="width: 280px;margin-left: 10%;box-shadow:2px 2px 3px #909090;"
        :show-header="false"
        :border="true">
        <el-table-column
          prop="basicInfo_key"
          label="">
        </el-table-column>
        <el-table-column
          prop="basicInfo_value"
          label="">
        </el-table-column>
      </el-table>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'DataStoreInfo',
    data () {
      return {
        hostname: '',
        tagline: '',
        version: '',
        LUA_Version: '',
        admin_listen: '',
        basicInfo: [{
          basicInfo_key: '数据库类型',
          basicInfo_value: ''
        }, {
          basicInfo_key: '主机',
          basicInfo_value: ''
        }, {
          basicInfo_key: 'pg_数据库',
          basicInfo_value: ''
        }, {
          basicInfo_key: '数据库连接状态',
          basicInfo_value: ''
        },{
          basicInfo_key: '端口',
          basicInfo_value: ''
        }]
      }
    },
    mounted () {
      // this.loadBasicInfo()
      // this.loadStatus()
    },
    methods: {
      // loadBasicInfo () {
      //   let _this = this
      //   this.$axios.get('/')
      //     .then(response => {
      //       if (response) {
      //         let kongInfo = response.data
      //         // _this.basicInfo[0].basicInfo_value = kongInfo.hostname
      //         // _this.basicInfo[2].basicInfo_value = kongInfo.node_id
      //         // _this.basicInfo[1].basicInfo_value = kongInfo.tagline
      //         // _this.basicInfo[2].basicInfo_value = kongInfo.version
      //         // _this.basicInfo[4].basicInfo_value = kongInfo.plugins.enabled_in_cluster.toString()
      //         // _this.basicInfo[3].basicInfo_value = kongInfo.lua_version
      //         // _this.basicInfo[5].basicInfo_value = kongInfo.configuration.prefix
      //         // _this.basicInfo[4].basicInfo_value = kongInfo.configuration.admin_listen.toString()
      //         // _this.basicInfo[7].basicInfo_value = kongInfo.configuration.proxy_listen
      //         // _this.basicInfo[8].basicInfo_value = kongInfo.configuration.db_update_frequency + 's'
      //         // _this.basicInfo[9].basicInfo_value = kongInfo.configuration.nginx_conf
      //         // _this.basicInfo[10].basicInfo_value = kongInfo.configuration.nginx_pid
      //         _this.basicInfo[0].basicInfo_value = kongInfo.configuration.database
      //         _this.basicInfo[1].basicInfo_value = kongInfo.configuration.pg_host
      //         _this.basicInfo[2].basicInfo_value = kongInfo.configuration.pg_database
      //         _this.basicInfo[4].basicInfo_value = kongInfo.configuration.pg_port
      //         // console.log(_this.basicInfo)
      //       }
      //     })
      // },
      // loadStatus () {
      //   let _this = this
      //   this.$axios.get('/status')
      //     .then(response => {
      //       if (response) {
      //         let kongInfo = response.data
      //         _this.basicInfo[3].basicInfo_value = kongInfo.database.reachable.toString() === 'true' ? '已连接' : '未连接'
      //       }
      //     })
      // }
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #E0E0E0;
    color: #333;
    width: 280px;
    margin-left: 10%;
    /*float: right;*/
    font-weight: bold;
    text-align: left;
    line-height: 42px;
    box-shadow:2px 2px 3px #909090;
  }

  .el-main {
    background-color: #F8F8F8;
    color: #333;
    /*text-align: center;*/
    /*line-height: 160px;*/
    width: 300px;
    margin-left: 18%;
    height: 400px;
  }
</style>
