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
        <el-form-item class = "formItem" label = "名称" :label-width = "formLabelWidth" prop = "name">
          <el-input style = "width: 550px;" v-model = "formData.name" autocomplete = "off" placeholder = "请输入名称"></el-input>
          <br/><span>该名称与凭证相关联，在OAuth 2.0中代表第三方应用的名称</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "客户端id" :label-width = "formLabelWidth" prop = "client_id">
          <el-input style = "width: 550px;" v-model = "formData.client_id" autocomplete = "off" placeholder = "请输入客户端id"></el-input>
          <br/><span>设置唯一的客户端id，若不填写，后台会自动生成</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "客户端密钥" :label-width = "formLabelWidth" prop = "client_secret">
          <el-input style = "width: 550px;" v-model = "formData.client_secret" autocomplete = "off" placeholder = "请输入客户端密钥"></el-input>
          <br/><span>设置唯一的客户端密钥，若不填写，后台会自动生成</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "重定向URI" :label-width = "formLabelWidth" prop = "redirect_uris ">
          <el-input style = "width: 550px;" v-model = "redirect_uris " autocomplete = "off" placeholder = "请输入重定向URI"></el-input>
          <br/><span>用户经过授权认证后所重定向的地址，若输入多个地址请用半角状态下','间隔</span>
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
    name: 'AddOAuth2',
    inject: ['reload'],
    data () {
      return {
        titleName: '创建OAuth2凭证',
        dialogFormVisble: false,
        formData: {
          name: '',
          client_id: '',
          client_secret: '',
          redirect_uris: []
        },
        formLabelWidth: '150px',
        consumerId: ''
        // props: ['consumerId']
      }
    },
    // mounted () {
    //
    // },
    computed: {
      redirect_uris: {
        get () {
          if (this.formData.redirect_uris.length > 0) {
            return this.formData.redirect_uris.join(',')
          }
          return ''
        },
        set (newValue) {
          if (newValue) {
            this.formData.redirect_uris = newValue.split(',')
          } else {
            this.formData.redirect_uris = []
          }
        }
      }
    },
    methods: {
      clear () {
        this.formData = {
          name: '',
          client_id: '',
          client_secret: '',
          redirect_uris: []
        }
      },
      saveBasic () {
        let _this = this
        this.consumerId = this.$route.params.consumerId
        // console.log(this.$route.params.consumerId)
        if(!this.formData.client_id) {
          delete this.formData.client_id
        }
        if(!this.formData.client_secret ) {
          delete this.formData.client_secret
        }
        this.$axios.post(localStorage.address + '/consumers/' + this.consumerId + '/oauth2', this.formData)
          .then(() => {
            _this.$emit('refresh')
            _this.dialogFormVisble = false
            // _this.reload()
          })
          .catch((error) => {
            let errorCode = error.response.status
            console.log(error.response)
            if (errorCode === 409 && error.response.data.fields.client_id) {
              this.$Message.error('客户端id不能重复')
            } else if (error.response.data.fields.name === 'length must be at least 1' || error.response.data.fields.username === 'length must be at least 1') {
              this.$Message.error('名称和重定向URI不能为空')
            } else if (error.response.data.fields.redirect_uris) {
              this.$Message.error('您输入的重定向URI有误，请重新填写')
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
