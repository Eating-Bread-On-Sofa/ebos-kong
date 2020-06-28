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
        <el-form-item class = "formItem" label = "证书" :label-width = "formLabelWidth" prop = "cert">
          <!--autocomplete是否让浏览器自动记录之前输入的值-->
          <el-input type="textarea" :autosize="{ minRows: 10}" style = "width: 550px;" v-model = "formData.cert" autocomplete = "off" placeholder = "请输入证书"></el-input>
          <br/><span>PEM编码的SSL密钥对的证书公钥.一般以.crt为后缀，复制里面的内容。</span>
        </el-form-item>
        <el-form-item class = "formItem" label = "私钥" :label-width = "formLabelWidth" prop = "key">
          <el-input style = "width: 550px;" type="textarea" :autosize="{ minRows: 10}"  v-model = "formData.key" autocomplete = "off" placeholder = "请输入私钥"></el-input>
          <br/><span>PEM编码的SSL密钥对的证书私钥.一般以.key为后缀，复制里面的内容。</span>
        </el-form-item>
        <el-form-item class = "formItem" label = "SNIS" :label-width = "formLabelWidth" prop = "snis">
          <el-input style = "width: 550px;" v-model = "snis_str" autocomplete = "off" placeholder = "请输入服务器名称标识"></el-input>
          <br/><span>证书的域名，若输入多个sni请用半角状态的','隔开<br/>例如ssl-example.com,other-ssl-example.com</span>
        </el-form-item>
      </el-form>
      <div slot = "footer" class = "dialog-footer">
        <el-button @click = "dialogFormVisble = false">取 消</el-button>
        <el-button type = "primary" @click="saveCertificates">确 定</el-button> <!--@click = "onSubmit"-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'AddCertificate',
    inject: ['reload'],
    data () {
      return {
        titleName: '添加证书',
        dialogFormVisble: false,
        formData: {
          cert: '',
          key: '',
          snis: []
        },
        certificateId: '',
        formLabelWidth: '150px'
      }
    },
    mounted () {

    },
    methods: {
      clear () {
        this.formData = {
          cert: '',
          key: '',
          snis: []
        }
      },
      saveCertificates () {
        let _this = this
        if (this.formData.cert === '') {
          delete this.formData.cert
        }
        if (this.formData.tags === '') {
          delete this.formData.tags
        }

        if (this.titleName === '添加证书') {
          this.$axios.post(localStorage.address + '/certificates/', this.formData)
            .then((response) => {
              // console.log(response)
              _this.reload()
            })
            .catch((error) => {
              // console.log(error.response)
              let errorCode = error.response.status
              if (errorCode === 400 && error.response.data.fields.cert === 'required field missing' && error.response.data.fields.key === 'length must be at least 1') {
                this.$Message.error("证书'和'私钥'字段不能为空")
              } else if (errorCode === 400 && error.response.data.fields.cert.indexOf('invalid certificate') !== -1 && error.response.data.fields.key.indexOf('invalid key') !== -1) {
                this.$Message.error("输入的'证书'和'私钥'无效")
              } else if (errorCode === 400 && error.response.data.fields.key === 'length must be at least 1') {
                this.$Message.error("请输入'私钥'")
              } else if (errorCode === 400 && error.response.data.fields.cert === 'required field missing') {
                this.$Message.error("请输入'证书'")
              } else {
                this.$Message.error(error.response.data.message)
              }
            })
        } else {
          // edit
          this.$axios.patch(localStorage.address + '/certificates/' + this.certificateId, this.formData)
            .then((response) => {
              _this.reload()
            })
            .catch((error) => {
              console.log(error.response)
              let errorCode = error.response.status
              let cert = error.response.data.fields.cert
              let key = error.response.data.fields.key

              if (errorCode === 400 && error.response.data.fields.key === 'length must be at least 1') {
                this.$Message.error("证书'和'私钥'字段不能为空")
              } else if (errorCode === 400 && key && cert && error.response.data.fields.cert.indexOf('invalid certificate') !== -1 && error.response.data.fields.key.indexOf('invalid key') !== -1) {
                this.$Message.error("输入的'证书'或'私钥'无效")
              } else if (errorCode === 400 && key && error.response.data.fields.key.indexOf('invalid key') !== -1) {
                this.$Message.error("请输入正确的'私钥'")
              } else if (errorCode === 400 && cert && error.response.data.fields.cert.indexOf('invalid cert') !== -1) {
                this.$Message.error("请输入正确的'证书'")
              } else {
                this.$Message.error(error.response.data.message)
              }
            })
        }
      }
    },
    computed: {
      snis_str: {
        get () {
          if (this.formData.snis.length > 0) {
            return this.formData.snis.join(',')
          }
          return ''
        },
        set (newValue) {
          if (newValue) {
            this.formData.snis = newValue.split(',')
          } else {
            this.formData.snis = []
          }
        }
      }
    }
  }
</script>

<style scoped>
  .formItem {
    bottom: 14px;
  }
</style>
