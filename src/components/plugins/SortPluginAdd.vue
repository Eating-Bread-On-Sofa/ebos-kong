<template>
  <div>
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple">
        <el-tabs style="width: 700px;margin-left: 19%;margin-bottom: 40px" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="身份认证" name="1"></el-tab-pane>
          <el-tab-pane label="安全控制" name="2"></el-tab-pane>
          <el-tab-pane label="流量控制" name="3"></el-tab-pane>
          <el-tab-pane label="Serverless" name="4"></el-tab-pane>
          <el-tab-pane label="分析&监控" name="5"></el-tab-pane>
          <el-tab-pane label="转换" name="6"></el-tab-pane>
          <el-tab-pane label="日志" name="7"></el-tab-pane>
          <el-tab-pane label="其他插件" name="8"></el-tab-pane>
          <!--              <el-tab-pane label="插件" name="4"></el-tab-pane>-->
        </el-tabs>
      </div></el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'SortPluginAdd'
  }
</script>

<style scoped>

</style>
