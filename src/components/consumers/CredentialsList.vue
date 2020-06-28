<template>
  <div>
    <el-container style="margin-top: 30px;border: 1px solid #eee">
      <el-aside width="130px" style="height: 282px;background-color: rgb(238, 241, 246)">
        <el-menu
          class="categories el-menu-vertical-demo"
          @select="handleSelect"
          default-active="1"
          active-text-color="red">
          <!--推荐用id作为key-->
          <el-menu-item style="text-align: left" v-for="(item,i) in navList" :key="i" :index="item.name">
<!--            <i class="el-icon-menu"></i>-->
            <span>{{ item.navItem }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
<!--      <el-container>-->
        <el-main>
          <basic-auth-config-table v-if="index == 1" ref="basic"></basic-auth-config-table>
          <key-auth-config-table v-if="index == 2" ref="key"></key-auth-config-table>
          <h-m-a-c-auth-config-table v-if="index == 3" ref="hmac"></h-m-a-c-auth-config-table>
          <o-auth2-config-table v-if="index == 4" ref="oauth2"></o-auth2-config-table>
          <j-w-t-config-table v-if="index == 5" ref="JWT"></j-w-t-config-table>
        </el-main>
<!--      </el-container>-->
    </el-container>
  </div>
</template>

<script>
  import BasicAuthConfigTable from './BasicAuthConfigTable'
  import KeyAuthConfigTable from './KeyAuthConfigTable'
  import HMACAuthConfigTable from './HMACAuthConfigTable'
  import OAuth2ConfigTable from './OAuth2ConfigTable'
  import JWTConfigTable from './JWTConfigTable'
  export default {
    name: 'CredentialsList',
    components: {JWTConfigTable, OAuth2ConfigTable, HMACAuthConfigTable, KeyAuthConfigTable, BasicAuthConfigTable},
    data () {
      return {
        navList: [
          {name: '1', navItem: 'Basic Auth'},
          {name: '2', navItem: 'Key Auth'},
          {name: '3', navItem: 'HMAC Auth'},
          {name: '4', navItem: 'OAUTH2.0'},
          {name: '5', navItem: 'JWT'}
        ],
        basics: [],
        index: 1
      }
    },
    methods: {
      handleSelect (index, indexPath) {
        this.index = index
      }
    }
  }
</script>

<style scoped>
  .categories {
    text-align: left;
  }
</style>
