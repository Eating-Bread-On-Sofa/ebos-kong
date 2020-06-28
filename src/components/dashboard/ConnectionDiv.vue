<template>
  <div>
    <el-container>
      <el-header height="40px">
        <span class="el-icon-kongmyicon-"></span>
        <span>客户端连接数</span>
        <span style="float: right;font-weight: lighter;font-family: Microsoft YaHei UI">HTTP总请求数： <span style="font-weight: bold">{{ total_requests }}</span></span>
      </el-header>
      <el-main>
        <div style="float: left;width: 200px;height:60px;margin-left: 0px;background: white;text-align: center;padding-top: 20px">
         <span class="span1">当前活动的客户端连接数:</span><br/>
          <span class="span2">{{active}}</span>
        </div>
        <div style="float: left;width: 190px;height:60px;margin-left: 15px;background: white;text-align: center;padding-top: 20px;margin-right: 0px">
          <span class="span1">网关正在读取的请求数:</span><br/>
          <span class="span2">{{reading}}</span>
        </div>
        <div style="float: left;width: 190px;height:60px;margin-left: 15px;background: white;text-align: center;padding-top: 20px;">
          <span class="span1">网关正在响应的连接数:</span><br/>
          <span class="span2">{{writing}}</span>
        </div><br/>
        <div style="float: left;width: 225px;margin-top: 30px;height:60px;margin-left: 0px;background: white;text-align: center;padding-top: 20px;">
          <span class="span1">等待请求的空闲客户端连接数:</span><br/>
          <span class="span2">{{waiting}}</span>
        </div>
        <div style="float: left;width: 180px;margin-top: 30px;height:60px;margin-left: 15px;background: white;text-align: center;padding-top: 20px;margin-right: 0px">
          <span class="span1">已接收的客户端连接数:</span><br/>
          <span class="span2">{{accepted}}</span>
        </div>
        <div style="float: left;width: 180px;margin-top: 30px;height:60px;margin-left: 15px;background: white;text-align: center;padding-top: 20px">
          <span class="span1">已处理的客户端连接数:</span><br/>
          <span class="span2">{{handled}}</span>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'ConnectionDiv',
    data () {
      return {
        total_requests: '',
        active: '',
        reading: '',
        waiting: '',
        writing: '',
        accepted: '',
        handled: ''
      }
    },
    methods: {
      // loadStatus () {
      //   let _this = this
      //   this.$axios.get('/status')
      //     .then(response => {
      //       if (response) {
      //         let kongStatus = response.data
      //         _this.total_requests = kongStatus.server.total_requests
      //         _this.active = kongStatus.server.connections_active
      //         _this.accepted = kongStatus.server.connections_accepted
      //         _this.handled = kongStatus.server.connections_handled
      //         _this.reading = kongStatus.server.connections_reading
      //         _this.writing = kongStatus.server.connections_writing
      //         _this.waiting = kongStatus.server.connections_waiting
      //       }
      //     })
      // }
    },
    mounted () {
      // this.loadStatus()
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #E0E0E0;
    color: #333;
    width: 670px;
    margin-left: 0%;
    /*float: right;*/
    text-align: center;
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
    width: 670px;
    margin-left: 0%;
    height: 232px;
    box-shadow:2px 2px 5px #909090;
  }

  .span1 {
    font-family: NSimSun;
    font-weight: bold;
    color: #909090;
  }

  .span2 {
    font-family: Microsoft JhengHei;
    font-weight: bold;
    font-size: 20px;
    color: #444;
    line-height: 1.5
  }
</style>
