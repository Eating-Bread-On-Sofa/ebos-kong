<template>
  <div>
    <el-container>
      <el-aside width="12.5%"></el-aside>
      <el-main>
        <el-row>
          <div style="margin-bottom: 20px;margin-top: 10px">
            <el-date-picker v-model="startDate" type="date" placeholder="请选择开始日期" style="width: 160px"></el-date-picker>
            <el-date-picker v-model="endDate" type="date" placeholder="请选择结束日期" style="width: 160px; margin-left: 10px"></el-date-picker>
            <el-select v-model="category" clearable  placeholder="请选择查询类别" style="width: 400px; margin-left: 10px">
              <el-option v-for="item in categorys" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select v-model="method" clearable  placeholder="请选择请求方法" style="width: 150px; margin-left: 10px">
              <el-option v-for="item in methods" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button @click="search" style="margin-left: 10px">查询</el-button>
          </div>
        </el-row>
        <el-row>
          <!---->
          <el-table
            style="width: 100%;margin-top: 10px"
            :data="logs.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            @filter-change="filterChange">
            <el-table-column
              prop="编号"
              label="编号"
              width="50px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="clientIp"
              label="客户端IP">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.clientIp }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="consumer"
              label="消费者">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.consumer }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="service"
              label="服务">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.service }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="route"
              label="路由">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.route }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="requestUrl"
              label="请求地址"
              width="145px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.requestUrl }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="method"
              label="请求方法"
              width="80px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.method }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="响应状态"
              width="80px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.status }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="targetIp"
              label="源服务主机"
              width="100px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.targetIp}}:{{ scope.row.targetPort }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="userAgent"
              label="浏览器">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.userAgent }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="osName"
              label="操作系统"
              width="100px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.osName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="创建时间">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.createdAt }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="upstreamUri"
              label="源服务路径"
              width="100px">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.upstreamUri }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="category"
              label="所属类别"
              column-key="category"
              width="100px"
              :filters="[
            { text: '网关管理', value: 'gatewayconfig'},
            { text: '设备管理', value: 'device'},
            { text: '网关实例', value: 'gwinst'},
            { text: '设备指令', value: 'command'},
            { text: '场景管理', value: 'scenario'},
            { text: '消息路由', value: 'mqrouter'},
            { text: '模板管理', value: 'profile'},
            { text: '规则引擎', value: 'rule'},
            { text: '通知管理', value: 'notice'},
            { text: '服务管理', value: 'servmgmt'},
            { text: '运维监控', value: 'oam'},]"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.category }}</span>
              </template>
            </el-table-column>
<!--            <el-table-column-->
<!--              prop="operation"-->
<!--              label="操作">-->
<!--              <template slot-scope="scope">-->
<!--                <span style="margin-left: 0px">-->
<!--                  &lt;!&ndash; @click="handleEdit(scope.$index,scope.row.id)&ndash;&gt;-->
<!--                  &lt;!&ndash; @click="deleteDialog(scope.$index,scope.row.id)"&ndash;&gt;-->
<!--&lt;!&ndash;                  <el-button size="mini" @click="addRoute(scope.$index,scope.row.id)" type="primary">查看</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;                  <el-button size="mini" @click="listPlugin(scope.$index,scope.row.id)"  type="success">插件</el-button>&ndash;&gt;-->
<!--                  <el-button size="mini" @click="deleteRoute(scope.$index,scope.row.id)" type="danger">删除</el-button>-->
<!--                </span>-->
<!--              </template>-->
<!--            </el-table-column>-->
          </el-table>
        </el-row>
        <!--当前页数--><!--每页显示条目个数--><!--总条目数-->
        <!-- current-change	currentPage 改变时会触发。回调参数为当前页-->
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :pager-count="5"
          :total="logs.length">
        </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'LogInfo',
    data () {
      return {
        loading: true,
        currentPage: 1,
        pageSize: 6,
        logs: [],
        curNum: 0,
        firstDate: '',
        lastDate: '',
        category: '',
        startDate: '',
        endDate: '',
        categorys: [{label: '所有类别', value: ''},
        { label: '网关管理', value: 'gatewayconfig'},
        { label: '设备管理', value: 'device'},
        { label: '网关实例', value: 'gwinst'},
        { label: '设备指令', value: 'command'},
        { label: '场景管理', value: 'scenario'},
        { label: '消息路由', value: 'mqrouter'},
        { label: '模板管理', value: 'profile'},
        { label: '规则引擎', value: 'rule'},
        { label: '通知管理', value: 'notice'},
        { label: '服务管理', value: 'servmgmt'},
        { label: '运维监控', value: 'oam'}],
        method: '',
        methods: [{label: '所有方法', value: ''},
          {label: 'post', value: 'post'},
          {label: 'get', value: 'get'},
          {label: 'put', value: 'put'},
          {label: 'delete', value: 'delete'}]
      }
    },
    mounted () {
      this.loadAllLog()
    },
    created () {
      if (!localStorage.logCurrentPage) {
        localStorage.setItem('logCurrentPage', this.currentPage)
      }
      // 如果为firstIndex为1，则讲页数置为1，否则页数为本地缓存的页数
      if (this.$store.state.logFirstIndex === 1) {
        this.currentPage = 1
      } else {
        this.currentPage = parseInt(localStorage.logCurrentPage)
      }
    },
    methods: {
      search () {
        let url
        let _this = this
        // console.log(this.startDate)
        if (!this.startDate && !this.endDate) {
          // 去掉日期字段
          if (this.method === '' && this.category !== '') {
            url = 'http://' + localStorage.ip + ':8866/api/konglog/log?category=' + this.category
          } else if (this.method !== '' && this.category === '') {
            url = 'http://' + localStorage.ip + ':8866/api/konglog/log?method=' + this.method
          } else if (this.method !== '' && this.category !== '') {
            url = 'http://' + localStorage.ip + ':8866/api/konglog/log?method=' + this.method + '&category=' + this.category
          } else {
            url = 'http://' + localStorage.ip + ':8866/api/konglog/log'
          }
        } else if (this.startDate && this.endDate) {
          let startDate = this.startDate.getFullYear() + '/' + (this.startDate.getMonth() + 1) + '/' + this.startDate.getDate()
          let endDate = this.endDate.getFullYear() + '/' + (this.endDate.getMonth() + 1) + '/' + this.endDate.getDate()
          if (this.method === '' && this.category !== '') {
            url = 'http://' + localStorage.ip + ':8866/api/konglog/log?category=' + this.category + '&startDate=' + startDate + '&endDate=' + endDate
          } else if (this.method !== '' && this.category === '') {
            url = 'http://' + localStorage.ip + ':8866/api/konglog/log?method=' + this.method + '&startDate=' + startDate + '&endDate=' + endDate
          } else if (this.method !== '' && this.category !== '') {
            url = 'http://' + localStorage.ip + ':8866/api/konglog/log?method=' + this.method + '&category=' + this.category + '&startDate=' + startDate + '&endDate=' + endDate
          } else {
            url = 'http://' + localStorage.ip + ':8866/api/konglog/log?' + '&startDate=' + startDate + '&endDate=' + endDate
          }
        } else {
          this.$Message.error('要查询的日期范围必须【同时存在】或【同时为空】')
        }
        // console.log(url)
        if (url) {
          this.$axios.get(url)
            .then((resp) => {
              // console.log(resp)
              _this.currentPage = 1
              _this.logs = resp.data.data
            })
            .catch((error) => {
              // console.log(error.response.data.message)
              this.$Message.error(error.response.data.message)
            })
        }
        // console.log(endDate)
      },
      loadAllLog () {
        let _this = this
        this.$axios.get('http://' + localStorage.ip + ':8866/api/konglog')
          .then((response) => {
            // console.log(response)
            if (response && response.status === 200) {
              _this.logs = response.data.data
            }
          })
      },
      filterChange (filterObj) {
        //解决重置按钮不起作用
        if (filterObj.category.length === 0) {
          this.loadAllLog()
          return
        }
        let _this = this
        // console.log(filterObj.category)
        // console.log(filterObj)
        _this.$axios.get('http://' + localStorage.ip + ':8866/api/konglog/category/' + filterObj.category[_this.curNum])
          .then((response) => {
            if (_this.curNum === 0) {
              _this.logs = []
            }

            // console.log(response)
            // _this.logs.concat(response.data.data)
            // console.log(response.data.data)
            _this.logs = _this.logs.concat(response.data.data)
            // console.log(_this.logs)
            _this.curNum++
            if (_this.curNum >= filterObj.category.length) {
              _this.curNum = 0
              _this.currentPage = 1
              return
            }
            _this.filterChange(filterObj)
          })
          .catch((error) => {
            _this.curNum++
            _this.$Message.error(error.response.message)
            _this.filterChange(filterObj)
          })

      },
      handleCurrentChange: function (currentPage) {
        if (currentPage !== 1) {
          this.$store.commit('saveLogFirstIndex', 0)
        }
        this.currentPage = currentPage
        localStorage.logCurrentPage = currentPage
        // console.log(this.currentPage)
      }
    }
  }
</script>

<style scoped>

</style>
