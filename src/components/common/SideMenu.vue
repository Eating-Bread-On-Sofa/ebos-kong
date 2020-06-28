<template>
<!--   @select="handleSelect"设置菜单选择事件的回调函数,菜单激活回调-->
  <el-menu
    class="categories el-menu-vertical-demo"
    router
    @select="handleSelect"
    :default-active='this.$route.path'
    active-text-color="red">
    <!--推荐用id作为key-->
    <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
      <i class="el-icon-menu"></i>
      <span>{{ item.navItem }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
  export default {
    name: 'SideMenu',
    data () {
      return {
        navList: [
          // {name: '/info', navItem: '首页'},
          {name: '/serverInfo', navItem: '物理信息'},
          {name: '/info', navItem: '服务信息'},
          {name: '/logInfo', navItem: '日志信息'},
          {name: '/services', navItem: '服务'},
          {name: '/routes', navItem: '路由'},
          {name: '/consumers', navItem: '消费者'},
          {name: '/plugins', navItem: '插件'},
          {name: '/upstreams', navItem: '代理网关'},
          {name: '/certificates', navItem: '证书'}
        ],
        index: ''
      }
    },
    methods: {
      handleSelect (index, indexPath) {
        this.index = index
        this.$emit('indexSelect')
      }
    }
  }
</script>

<style scoped>
  .categories {
    position: absolute;
    width: 12.5%;
    text-align: left;
  }

  .el-menu-item {
    margin-left: 0;
    font-size: 17px;
  }
</style>
