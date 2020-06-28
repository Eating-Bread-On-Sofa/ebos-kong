<template>
  <div>
    <el-dialog
      :visible.sync="dialogFormVisble"
      top="3vh"
      @close="clear">
      <div slot="title" style="font-size: 20px;margin-top: 10px">
        <span>{{ titleName }}</span>
      </div>
      <el-form v-model="formData" style="text-align: left;" ref="dataForm">
        <!--prop:表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的-->
        <el-form-item class="formItem" label="服务名称" :label-width="formLabelWidth" prop="name">
          <!--autocomplete是否让浏览器自动记录之前输入的值-->
          <el-input style="width: 550px;" v-model="formData.name" autocomplete="off" placeholder="请输入服务名称..."></el-input>
          <br/><span>【可选】不支持中文，特殊字符仅支持'., -, _, ~'</span>
        </el-form-item>
        <el-form-item class="formItem" label="重试次数" :label-width="formLabelWidth" prop="retries">
<!--          <el-input style="width: 550px;" v-model="formData.retries" autocomplete="off"></el-input>-->
          <el-input-number v-model = "formData.retries" controls-position = "right" style = "width: 120px;"></el-input-number>
          <br/><span>【可选】代理失败后要执行的重试次数，默认为5</span>
        </el-form-item>
        <el-form-item class="formItem" label="协议" :label-width="formLabelWidth" prop="protocol">
<!--          <el-input v-model="formData.protocol" autocomplete="off"></el-input>-->
          <el-radio v-model="formData.protocol" label="http">http</el-radio>
          <el-radio v-model="formData.protocol" label="https">https</el-radio>
          <span>【必填】与上游服务器通信的协议，http 或 https</span>
        </el-form-item>
        <el-form-item class="formItem" label="主机名" :label-width="formLabelWidth" prop="host">
          <el-input style="width: 550px;" v-model="formData.host" autocomplete="off"></el-input>
          <br/><span>【必填】上游服务器的主机名，若代理外部地址请填域名</span>
        </el-form-item>
        <el-form-item class="formItem" label="端口" :label-width="formLabelWidth" prop="port">
<!--          <el-input style="width: 550px;" v-model="formData.port" autocomplete="off"></el-input>-->
          <el-input-number v-model = "formData.port" controls-position = "right" style = "width: 120px;"></el-input-number>
          <br/><span>【必填】上游服务器的端口，默认为80</span>
        </el-form-item>
        <el-form-item class="formItem" label="路径" :label-width="formLabelWidth" prop="path">
          <el-input style="width: 550px;" v-model="formData.path" autocomplete="off"></el-input>
          <br/><span>【可选】请求上游服务器的路径，以"/"开头，不允许出现"//"</span>
        </el-form-item>
        <el-form-item class="formItem" label="连接超时时间" :label-width="formLabelWidth" prop="connect_timeout">
<!--          <el-input v-model="formData.connect_timeout" autocomplete="off"></el-input>-->
          <el-input-number v-model="formData.connect_timeout" controls-position="right" style="width: 120px;"></el-input-number>
          <span>【可选】与上游服务器建立连接的超时时间（单位：毫秒）</span>
        </el-form-item>
        <el-form-item class="formItem" label="写入超时时间" :label-width="formLabelWidth" prop="write_timeout">
<!--          <el-input v-model="formData.write_timeout" autocomplete="off"></el-input>-->
          <el-input-number v-model="formData.write_timeout" controls-position="right" style="width: 120px;"></el-input-number>
          <span>【可选】向上游服务器发送两个连续写操作的超时时间（单位：毫秒）</span>
        </el-form-item>
        <el-form-item class="formItem" label="读取超时时间" :label-width="formLabelWidth" prop="read_timeout">
<!--          <el-input v-model="formData.read_timeout" autocomplete="off"></el-input>-->
          <el-input-number v-model="formData.read_timeout" controls-position="right" style="width: 120px;"></el-input-number>
          <span>【可选】从上游服务器两次连续读取操作的超时时间（单位：毫秒）</span>
        </el-form-item>
        <el-form-item v-if="this.titleName == '添加服务'" class="formItem" label="url" :label-width="formLabelWidth" prop="url">
          <el-input style="width: 550px;" v-model="formData.url" autocomplete="off"></el-input>
          <br/><span>【可选】能同时设置protocol, host, port 和 path(如,http://mockbin.org)，正确填写后无需<br/>设置protocol, host, port 和 path字段</span>
        </el-form-item>
<!--        <el-form-item prop="id" style="height: 0">-->
<!--          <el-input type="hidden" v-model="formData.id" autocomplete="off"></el-input>-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisble = false">取 消</el-button>
        <el-button type="primary" @click="saveService">确 定</el-button> <!--@click="onSubmit"-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'AddService',
    inject: ['reload'],
    data () {
      return {
        titleName: '添加服务',
        dialogFormVisble: false,
        formData: {
          name: '',
          retries: 5,
          protocol: 'http',
          host: '',
          port: 80,
          path: '',
          connect_timeout: 60000,
          write_timeout: 60000,
          read_timeout: 60000,
          url: ''
        },
        formLabelWidth: '120px'
      }
    },
    // created () {
    //   if (this.$store.state.addOrEdit === 'add') {
    //     this.titleName = '添加服务'
    //   } else {
    //     this.titleName = '修改服务'
    //   }
    // },
    // mounted () {
    //   if (this.titleName === '修改服务') {
    //     let serviceId = this.$route.params.id
    //     console.log(serviceId)
    //     this.getService(serviceId)
    //   }
    // },
    methods: {
      clear () {
        this.formData = {
          name: '',
          retries: 5,
          protocol: 'http',
          host: '',
          port: 80,
          path: '',
          connect_timeout: 60000,
          write_timeout: 60000,
          read_timeout: 60000,
          url: ''
        }
      },
      saveService () {
        let _this = this
        // 深拷贝
        let formData = JSON.parse(JSON.stringify(this.formData))
        console.log(formData)
        // 如果名称为空必须删除，否则出错，若不为空，则去除头尾空格
        if (formData.name === '' || formData.name === null) {
          delete formData.name
        } else {
          formData.name = formData.name.trim()
        }
        if (formData.host === '') {
          delete formData.host
        } else {
          formData.host = formData.host.trim()
        }
        if (formData.path === '' || formData.path === null) {
          delete formData.path
        } else {
          formData.path = formData.path.trim()
        }
        if (formData.url === '') {
          delete formData.url
        } else {
          formData.url = formData.url.trim()
        }
        if (this.titleName === '添加服务') {
          _this.$axios.post(localStorage.address + '/services', formData)
            .then(response => {
              // console.log(response)
              if (response && response.status === 201) {
                _this.dialogFormVisble = false
                // _this.$router.push('/services')
                _this.reload()
              }

            })
            .catch(error => {
              let errorCode = error.response.status
              // console.log(error.response)
              if (errorCode === 409) {
                this.$Message.error('服务名称重复，请重新填写')
              } else if (errorCode === 400 && error.response.data.fields.host) {
                this.$Message.error('主机名不能为空，不允许出现中文字符、纯数字')
              } else if (errorCode === 400 && error.response.data.fields.name) {
                this.$Message.error('服务名称含有不合法字符')
              } else if (errorCode === 400 && error.response.data.fields.path) {
                this.$Message.error('请填写正确的路径选项')
              } else {
                this.$Message.error(error.response.data.message)
              }
            })
        } else {
          //edit
          // // 先获取到要修改的服务的信息回显在表单
          // console.log(this.$route.params.id)
          let serviceId = this.$route.params.id
          _this.$axios.patch(localStorage.address + '/services/' + serviceId, formData)
            .then((response) => {
              _this.dialogFormVisble = false
              // _this.$router.push('/services/' + serviceId)
              // _this.$router.go(0)
              _this.reload()
            })
            .catch(error => {
              let errorCode = error.response.status
              console.log(error.response)
              if (errorCode === 409) {
                this.$Message.error('服务名称重复，请重新填写')
              } /* else if (errorCode === 400 && error.response.data.fields.host) {
                this.$Message.error('主机名不能为空，不允许出现中文字符、纯数字')
              }*/ else if (errorCode === 400 && error.response.data.fields.name) {
                this.$Message.error('服务名称含有不合法字符')
              } else if (errorCode === 400 && error.response.data.fields.path) {
                this.$Message.error('请填写正确的路径选项')
              } else {
                this.$Message.error(error.response.data.message)
              }
            })
          // console.log(formData)
          // this._patch('/services/' + this.serviceId, formData, () => {
          //   _this.$router.go(-1)
          // })
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
