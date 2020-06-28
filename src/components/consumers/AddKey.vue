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
        <el-form-item class = "formItem" label = "用户名" :label-width = "formLabelWidth" prop = "key">
          <!--autocomplete是否让浏览器自动记录之前输入的值-->
          <el-input style = "width: 550px;" v-model = "formData.key" autocomplete = "off" placeholder = "请输入密钥"></el-input>
          <br/><span>此字段通过设置唯一的密钥来认证客户端；若不填写，后台会自动生成一串随机密钥</span>
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
    name: 'AddKey',
    inject: ['reload'],
    data () {
      return {
        titleName: '创建Key-Auth凭证',
        dialogFormVisble: false,
        formData: {
          key: ''
        },
        formLabelWidth: '150px',
        consumerId: ''
        // props: ['consumerId']
      }
    },
    // mounted () {
    //
    // },
    methods: {
      clear () {
        this.formData = {
          key: ''
        }
      },
      saveBasic () {
        if(!this.formData.key) {
          delete this.formData.key
        }
        let _this = this
        this.consumerId = this.$route.params.consumerId
        // console.log(this.$route.params.consumerId)
        this.$axios.post(localStorage.address + '/consumers/' + this.consumerId + '/key-auth', this.formData)
          .then(() => {
            _this.$emit('refresh')
            // this.formData.key = null
            _this.dialogFormVisble = false
            // _this.reload()
          })
          .catch((error) => {
            let errorCode = error.response.status
            // console.log(error.response)
            if (errorCode === 409) {
              this.$Message.error('密钥名称重复，请重新填写')
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
