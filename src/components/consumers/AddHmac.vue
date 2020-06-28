<template>
  <div>
    <el-dialog
      :visible.sync = "dialogFormVisble"
      top = "3vh"
      @close = "clear">
      <div slot = "title" style = "font-size: 20px;margin-top: 10px">
        <span>{{ titleName }}</span>
      </div>
      <el-form v-model = "formData" style = "text-align: left;" ref = "dataForm">
        <!--prop:表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的-->
        <el-form-item class = "formItem" label = "用户名" :label-width = "formLabelWidth" prop = "name">
          <!--autocomplete是否让浏览器自动记录之前输入的值-->
          <el-input style = "width: 550px;" v-model = "formData.username" autocomplete = "off" placeholder = "请输入用户名"></el-input>
          <br/><span>在HMAC签名验证中使用的用户名</span>
        </el-form-item>
        <el-form-item class = "formItem" label = "密钥" :label-width = "formLabelWidth" prop = "secret">
          <!--autocomplete是否让浏览器自动记录之前输入的值-->
          <el-input style = "width: 550px;" v-model = "formData.secret" autocomplete = "off" placeholder = "请输入密钥"></el-input>
          <br/><span>在HMAC签名验证中使用的密钥</span>
        </el-form-item>
      </el-form>
      <div slot = "footer" class = "dialog-footer">
        <el-button @click = "dialogFormVisble = false">取 消</el-button>
        <el-button type = "primary" @click = "saveBasic">确 定</el-button> <!--@click = "onSubmit"-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'AddHmac',
    inject: ['reload'],
    data () {
      return {
        titleName: '创建HMAC Auth凭证',
        dialogFormVisble: false,
        formData: {
          username: '',
          secret: ''
        },
        formLabelWidth: '150px',
        consumerId: ''
        // props: ['consumerId']
      }
    },
    methods: {
      clear () {
        this.formData = {
          username: '',
          secret: ''
        }
      },
      saveBasic () {
        let _this = this
        this.consumerId = this.$route.params.consumerId
        // console.log(this.$route.params.consumerId)
        this.$axios.post(localStorage.address + '/consumers/' + this.consumerId + '/hmac-auth', this.formData)
          .then(() => {
            _this.$emit('refresh')
            _this.dialogFormVisble = false
            // _this.reload()
          })
          .catch((error) => {
            let errorCode = error.response.status
            console.log(error.response)
            if (errorCode === 409) {
              this.$Message.error('用户名重复，请重新填写')
            } else if (error.response.data.fields.secret === 'length must be at least 1' || error.response.data.fields.username === 'length must be at least 1') {
              this.$Message.error('用户名和密码不能为空')
            } else {
              this.$Message.error(error.response.data.message)
            }
          })
      }
    }
  }
</script>

<style scoped>

</style>
