<template>
  <el-row class="el-row">
<!--    <a href="/serverInfo">-->
    <el-col :span="3"><div class="grid-content bg-purple">
      统一接入网关
    </div></el-col>
<!--    </a>-->
    <el-col :span="21">
      <div class="grid-content bg-purple-light">
        <el-dropdown @command="handleCommand"  trigger="click" style="float: right;margin-right: 20px;padding-top: -5px">
          <span class="el-dropdown-link" >
            <i class="el-icon-user-solid"></i>
            <span style="padding-top: 0px;right: 43%;font-size: 16px;">你好，BJTU
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          </span>
          <el-dropdown-menu slot="dropdown" style="width: 120px">
            <el-dropdown-item command="loginout" icon="el-icon-switch-button">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'NavMenu',
    data () {
      return {

      }
    },
    methods: {
      handleCommand (command) {
        // this.$message('click on item ' + command);
        this.$store.commit('saveIsLogin', false)
        this.$router.push('/config')
      }
    }
  }
</script>

<style scoped>
  .bg-purple {
    background: #708090;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 0px;
    min-height: 45px;
    text-align: center;
    padding-top: 15px;
    font-size: 20px;
    color: white;
  }

  a:link {color:white;}      /* 未访问链接*/
  a:visited {color:white;}  /* 已访问链接 */
  a:hover {color:white;}  /* 鼠标移动到链接上 */
  a:active {color:white;}  /* 鼠标点击时 */

  .el-icon-user-solid {
    font-size: 33px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: black;
    font-size: 15px;
    padding-top: 10px;
  }
  .el-icon-arrow-down {
    font-size: 15px;
  }
  .el-row {
    margin-bottom: 0px;
  }
</style>
