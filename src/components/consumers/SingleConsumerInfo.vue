<template>
  <div>
      <el-form style="margin-left: 235px;margin-top: 40px" label-width="150px" :model="formData">
        <el-form-item label="用户名">
          <el-input style="width: 450px;float: left" v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="自定义id">
          <el-input style="width: 450px;float: left" v-model="formData.custom_id"></el-input>
        </el-form-item>
        <el-button @click="updateConsumer" style="margin-left: 210px;width: 300px;float: left" icon="el-icon-check" type="success">提交</el-button>
      </el-form>
  </div>
</template>

<script>
  export default {
    name: 'SingleConsumerInfo',
    inject: ['reload'],
    data () {
      return {
        formData: {
          username: '',
          custom_id: ''
        },
        consumerId: ''
      }
    },
    mounted () {
      // console.log(this.$route.params.id)
      this.consumerId = this.$route.params.consumerId
    },
    methods: {
      updateConsumer () {
        let _this = this
        if (this.formData.username === '') {
          this.formData.username = null
        }
        if (this.formData.custom_id === '') {
          this.formData.custom_id = null
        }

        this.$axios.patch(localStorage.address + '/consumers/' + _this.consumerId, _this.formData)
          .then((response) => {
            if (response && response.status === 200) {
              this.$Message.success('消费者信息修改成功')
              _this.$router.push('/consumers')
            }
          }).catch(error => {
            // console.log(error.response)
            if (error && error.response.status === 409) {
              this.$Message.error('消费者信息修改失败，用户名和自定义id不能重复')
            }
        })
      }
    }
  }
</script>

<style scoped>

</style>
