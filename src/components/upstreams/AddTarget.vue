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
        <el-form-item class = "formItem" label = "所属上游" :label-width = "formLabelWidth" prop = "targetId">
          <!--autocomplete是否让浏览器自动记录之前输入的值-->
          <el-input style = "width: 550px;" disabled v-model = "upstreamId" autocomplete = "off" placeholder = "请输入终端名称"></el-input>
          <br/><span></span>
        </el-form-item>
        <el-form-item class = "formItem" label = "终端名称" :label-width = "formLabelWidth" prop = "target">
          <!--autocomplete是否让浏览器自动记录之前输入的值-->
          <el-input style = "width: 550px;" v-model = "formData.target" autocomplete = "off" placeholder = "请输入终端名称..."></el-input>
          <br/><span>格式为终端地址（IP或主机名）和端口（如，192.168.1.1:8080），默认为8000端口
            <br/>如果主机名解析为SRV记录，则端口值将被dns记录中的值覆盖。</span>
        </el-form-item>
        <el-form-item class = "formItem" label = "权重" :label-width = "formLabelWidth" prop = "weight">
          <!--autocomplete是否让浏览器自动记录之前输入的值-->
          <el-input-number v-model="formData.weight" :min="1" label="权重"></el-input-number>
<!--          <el-input style = "width: 550px;" v-model = "formData.weight" autocomplete = "off" placeholder = "请输入权重"></el-input>-->
          <br/><span>终端权重的范围是上游负载均衡器的插槽数量（即[0,1000]）<br/>如果主机名解析为SRV记录，则权重值将被dns记录中的值覆盖。</span>
        </el-form-item>
      </el-form>
      <div slot = "footer" class = "dialog-footer">
        <el-button @click = "dialogFormVisble = false">取 消</el-button>
        <el-button type = "primary" @click = "saveTarget">确 定</el-button> <!--@click = "onSubmit"-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'AddTarget',
    inject: ['reload'],
    data () {
      return {
        titleName: '添加终端',
        dialogFormVisble: false,
        formData: {
          target: '',
          weight: 100
        },
        upstreamId: '',
        formLabelWidth: '150px'
      }
    },
    mounted () {

    },
    methods: {
      clear () {
        this.formData = {
          target: '',
          weight: 100
        }
      },
      saveTarget () {
        let _this = this
        this.$axios.post(localStorage.address + '/upstreams/' +  this.upstreamId + '/targets', this.formData)
          .then((response) => {
            // console.log(response)
            if (response && response.status === 201) {
              _this.reload()
            }
          })
          .catch((error) => {
            // console.log(error.response)
            let errorCode = error.response.status
            if (errorCode === 400 && error.response.data.fields.target) {
              this.$Message.error('终端名称不能为空，不允许出现中文字符、纯数字')
            } else if (errorCode === 400 && error.response.data.fields.weight === 'value should be between 0 and 1000') {
              this.$Message.error('权重范围为[0,1000]')
            } else {
              this.$Message.error(error.response.data.message)
            }
          })
      }
    }
  }
</script>

<style scoped>
  .formItem {
    bottom: 14px;
  }
</style>
