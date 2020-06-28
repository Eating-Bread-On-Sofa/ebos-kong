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
        <el-form-item class = "formItem" label = "载荷" :label-width = "formLabelWidth" prop = "key">
          <el-input style = "width: 550px;" v-model = "formData.key" autocomplete = "off" placeholder = "请输入载荷"></el-input>
          <br/><span>标识凭证的唯一字符串，若省略，它将自动生成。<br/>【注意】但是，在生成令牌token时必须使用此字段，这将在下一部分中指定</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "算法" :label-width = "formLabelWidth" prop = "algorithm">
          <el-select v-model="formData.algorithm" placeholder="请选择">
            <el-option
              v-for="item in algorithms"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
<!--          <el-input style = "width: 550px;" v-model = "formData.algorithm" autocomplete = "off" placeholder = "请输入客户端id"></el-input>-->
          <br/><span>选择用于验证令牌token签名的算法</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "RSA公钥" :label-width = "formLabelWidth" prop = "rsa_public_key">
          <el-input type="textarea" style = "width: 550px;" v-model = "formData.rsa_public_key" autocomplete = "off" placeholder = "请输入客户端密钥"></el-input>
          <br/><span>若选择RS256算法，此字段用于校验令牌token签名的的RSA公钥(以PEM格式)</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "密钥" :label-width = "formLabelWidth" prop = "secret ">
          <el-input style = "width: 550px;" v-model = "formData.secret " autocomplete = "off" placeholder = "请输入重定向URI"></el-input>
          <br/><span>若选择HS256算法，此字段用于签署此凭证的JWT。若省略，它将自动生成。
            <br/>如果算法为RS256，则此字段应填写用于验证令牌token签名的私钥（PEM格式）。</span>
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
    name: 'AddJWT',
    inject: ['reload'],
    data () {
      return {
        titleName: '创建JWT凭证',
        dialogFormVisble: false,
        formData: {
          key: '',
          algorithm: '',
          rsa_public_key: '',
          secret: ''
        },
        algorithms: ['HS256', 'RS256'],
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
          key: '',
          algorithm: '',
          rsa_public_key: '',
          secret: ''
        }
      },
      saveBasic () {
        let _this = this
        this.consumerId = this.$route.params.consumerId
        // console.log(this.$route.params.consumerId)
        if (!this.formData.rsa_public_key) {
           delete this.formData.rsa_public_key
        }
        if (!this.formData.secret) {
          delete this.formData.secret
        }
        if (!this.formData.key) {
          delete this.formData.key
        }
        if (!this.formData.algorithm) {
          delete this.formData.algorithm
        }
        this.$axios.post(localStorage.address + '/consumers/' + this.consumerId + '/jwt', this.formData)
          .then(() => {
            _this.$emit('refresh')
            _this.dialogFormVisble = false
            // _this.reload()
          })
          .catch((error) => {
            // let errorCode = error.response.status
            console.log(error.response)
            if (error.response.data.fields.rsa_public_key === 'required field missing') {
              this.$Message.error("采用RS256算法时'RSA'公钥字段不能为空")
            } else if (error.response.data.fields.rsa_public_key === 'invalid key') {
              this.$Message.error('您输入的RSA公钥无效')
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
