<template>
  <div>
    <el-container>
      <el-header>
        <span class="el-icon-kongchajian" style="margin-top: 2px"></span>
        <span>已配置插件</span>
      </el-header>
      <el-main>
        <div class="plugin" v-for="(item,i) in plugins" :key="i">
          {{ item }}
        </div>
<!--        <div style="float: left;width: auto;height:20px;margin-left: 20px;background: white;text-align: center;padding-top: 5px;padding-left: 5px;padding-right: 5px;margin-right: 10px">key-auth</div>-->
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'EnabledPlugin',
    data () {
      return {
        plugins: []
      }
    },
    mounted () {
      // this.loadBasicInfo()
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
      //         _this.plugins = kongInfo.plugins.enabled_in_cluster
      //         console.log(_this.plugins)
      //         // _this.basicInfo[3].basicInfo_value = kongInfo.lua_version
      //         // _this.basicInfo[5].basicInfo_value = kongInfo.configuration.prefix
      //         // _this.basicInfo[4].basicInfo_value = kongInfo.configuration.admin_listen.toString()
      //         // _this.basicInfo[7].basicInfo_value = kongInfo.configuration.proxy_listen
      //         // _this.basicInfo[8].basicInfo_value = kongInfo.configuration.db_update_frequency + 's'
      //         // _this.basicInfo[9].basicInfo_value = kongInfo.configuration.nginx_conf
      //         // _this.basicInfo[10].basicInfo_value = kongInfo.configuration.nginx_pid
      //         // _this.basicInfo[11].basicInfo_value = kongInfo.configuration.database
      //         // _this.basicInfo[12].basicInfo_value = kongInfo.configuration.pg_database
      //         // _this.basicInfo[13].basicInfo_value = kongInfo.configuration.pg_port
      //         // console.log(_this.basicInfo)
      //       }
      //     })
      // }
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #F0F0F0;
    color: #333;
    width: 1300px;
    margin-left: 0;
    /*float: right;*/
    font-weight: bold;
    text-align: left;
    line-height: 60px;
    box-shadow:2px 2px 5px #909090;
  }

  .plugin {
    background: #1abb9c;
    border-radius: 6px;
    color: white;
    float: left;
    width: auto;
    height:20px;
    margin-left: 20px;
    text-align: center;
    padding: 5px;
    margin-right: 10px;
    margin-bottom: 15px;
    box-shadow:2px 2px 5px #909090;
  }
  .el-main {
    background-color: white;
    color: #333;
    /*text-align: center;*/
    /*line-height: 160px;*/
    width: 1300px;
    border-left: 1px solid #D8D8D8;
    border-right: 1px solid #D8D8D8;
    border-bottom: 1px solid #D8D8D8;
    margin-left: 0%;
    height: 240px;
    box-shadow:2px 2px 3px #909090;
  }
</style>
