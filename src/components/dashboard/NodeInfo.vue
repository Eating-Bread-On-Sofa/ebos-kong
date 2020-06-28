<template>
  <div>
    <el-container>
      <el-header height="40px">
        <span class="el-icon-kongicon-test1" style="margin-top: 2px"></span>
        <span>节点信息</span>
      </el-header>
<!--      <el-main>-->
<!--        <div style="float: left">主机名&emsp;&emsp;&emsp;&emsp;{{ hostname }}</div>-->
<!--        <div style="float: left">tagline&emsp;&emsp;&emsp;&emsp;{{ tagline }}</div>-->
<!--        <div style="float: left">tagline&emsp;&emsp;&emsp;&emsp;{{ tagline }}</div>-->
        <el-table
          :data="basicInfo"
          style="width: 305px;margin-left: 3%;box-shadow:2px 2px 3px #909090;"
          :show-header="false"
          :border="true">
          <el-table-column
            prop="basicInfo_key"
            label=""
            width="100px"
            class="el-table">
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
    name: 'NodeInfo',
    data () {
      return {
        hostname: '',
        tagline: '',
        version: '',
        LUA_Version: '',
        admin_listen: '',
        basicInfo: [{
          basicInfo_key: '主机名',
          basicInfo_value: ''
        }, {
          basicInfo_key: 'tagline',
          basicInfo_value: ''
        }, {
          basicInfo_key: '版本',
          basicInfo_value: ''
        }, {
          basicInfo_key: 'LUA版本',
          basicInfo_value: ''
        },{
          basicInfo_key: 'admin_listen',
          basicInfo_value: ''
        }]
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
      //         _this.basicInfo[0].basicInfo_value = kongInfo.hostname
      //         _this.basicInfo[1].basicInfo_value = kongInfo.tagline
      //         _this.basicInfo[2].basicInfo_value = kongInfo.version
      //         _this.basicInfo[3].basicInfo_value = kongInfo.lua_version
      //         _this.basicInfo[4].basicInfo_value = kongInfo.configuration.admin_listen.toString()
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
    width: 305px;
    margin-left: 3%;
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
    width: 250px;
    margin-left: 8%;
    height: 400px;
  }

  /*.el-table{*/
  /*  !*color: #6B91CE;*!*/
  /*  font-size: 13px;*/
  /*  font-family: 微软雅黑;*/
  /*}*/
</style>
