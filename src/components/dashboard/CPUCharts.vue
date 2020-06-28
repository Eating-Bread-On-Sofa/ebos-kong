<template>
    <div>
      <el-row>
        <el-col :span="7"><div id="cpu" style="width: 400px;height:300px;margin-left: 0px;box-shadow:2px 2px 5px #909090;"></div></el-col>
      </el-row>
    </div>
</template>

<script>
  export default {
    name: 'CPUCharts',
    data () {
      return {
        chartsCpu: '',
        cpuRate: []
      }
    }
  }
</script>

<style scoped>

</style>
