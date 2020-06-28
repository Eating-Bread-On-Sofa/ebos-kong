<template>
  <div>
    <el-container>
      <el-aside width="12.5%"></el-aside>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="6"><div class="grid-content bg-purple">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px">
              <el-breadcrumb-item :to="{ path: '/info' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/consumers' }">消费者列表</el-breadcrumb-item>
              <el-breadcrumb-item>消费者</el-breadcrumb-item>
            </el-breadcrumb>
          </div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple">
            <el-tabs style="width: 240px;margin-left: 30%" v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="消费者信息" name="1"></el-tab-pane>
              <el-tab-pane label="ACL分组" name="2"></el-tab-pane>
              <el-tab-pane label="凭证" name="3"></el-tab-pane>
<!--              <el-tab-pane label="插件" name="4"></el-tab-pane>-->
            </el-tabs>
          </div></el-col>
        </el-row>
        <single-consumer-info v-if="this.activeName == 1" ref="singleConsumerTable"></single-consumer-info>
        <ACLGroup @sendConsumerId="show" :consumerId="consumerId" v-if="this.activeName == 2" ref="aclGroup"></ACLGroup>
        <credentials-list v-if="this.activeName == 3" ref="credentials"></credentials-list>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import SingleConsumerInfo from './SingleConsumerInfo'
  import ACLGroup from './ACLGroup'
  import CredentialsList from './CredentialsList'
  export default {
    name: 'ConsumersEdit',
    components: {CredentialsList, ACLGroup, SingleConsumerInfo},
    data () {
      return {
        serviceName: '',
        activeName: '1',
        consumerId: ''
      }
    },
    mounted () {
      // console.log(this.$route.params.consumerId)
      this.consumerId = this.$route.params.consumerId
      // this.$refs.aclGroup.consumerId = this.$route.params.consumerId
      // console.log(this.consumerId)
      if (this.activeName === '1') {
        this.$axios.get(localStorage.address + '/consumers/' + this.consumerId)
          .then(response => {
            // console.log(response.data)
            this.$refs.singleConsumerTable.formData.username = response.data.username
            this.$refs.singleConsumerTable.formData.custom_id = response.data.custom_id
          })
      }
      // this.loadSingleService()
    },
    methods: {
      handleClick (tab) {
        // console.log(tab.name)
        this.activeName = tab.name
        // 解决点击其他分栏后再点击消费者信息不回显的bug
        if (this.activeName === '1') {
          this.$axios.get(localStorage.address + '/consumers/' + this.consumerId)
            .then(response => {
              // console.log(response.data)
              this.$refs.singleConsumerTable.formData.username = response.data.username
              this.$refs.singleConsumerTable.formData.custom_id = response.data.custom_id
            })
        }
      },
      show () {

      }
    }
  }
</script>

<style scoped>
  .text {
    font-size: 16px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 480px;
  }
</style>
