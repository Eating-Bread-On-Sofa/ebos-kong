<template>
  <div>
    <nav-menu></nav-menu>
<!--    <el-container>-->
<!--      <el-aside style="width:12.5%;margin-top: 0px;">-->
<!--        &lt;!&ndash;        滑块开关&ndash;&gt;-->
<!--        <switch></switch>-->
        <SideMenu  @indexSelect="listByIndex" ref="sideMenu"></SideMenu>
<!--      </el-aside>-->
<!--      <el-main>-->
        <router-view/>
<!--      </el-main>-->
<!--    </el-container>-->

  </div>
</template>

<script>
  import NavMenu from './common/NavMenu'
  import SideMenu from './common/SideMenu'
  export default {
    name: 'Home',
    inject: ['reload'],
    components: {SideMenu, NavMenu},
    methods: {
      /*实现按分类查询
      * 点击左侧导航栏，向后端发送一个带有参数的 get 请求，然后同样是修改 data 里的数据以实现动态渲染*/
      listByIndex () {
        // var _this = this
        var index = this.$refs.sideMenu.index
        switch (index) {
          case '/services':
            this.$store.commit('saveSerFirstIndex', 1)
            break
          case '/routes':
            this.$store.commit('saveRouFirstIndex', 1)
            break
          case '/upstreams':
            this.$store.commit('saveUpFirstIndex', 1)
            break
          case '/consumers':
            this.$store.commit('saveConFirstIndex', 1)
            break
          case '/certificates':
            this.$store.commit('saveCerFirstIndex', 1)
            break
          case '/plugins':
            this.$store.commit('savePluFirstIndex', 1)
            break
          case '/logInfo':
            this.$store.commit('saveLogFirstIndex', 1)
            break
        }
        this.$router.push(index)
        this.reload()
        // this.$axios.get(url)
        //   .then(resp => {
        //     if (resp && resp.status === 200){
        //       _this.$refs.booksArea.books = resp.data
        //       //加上下行
        //       _this.$refs.booksArea.currentPage = 1
        //     }
        //   })
      }
    }
  }
</script>

<style scoped>

</style>
