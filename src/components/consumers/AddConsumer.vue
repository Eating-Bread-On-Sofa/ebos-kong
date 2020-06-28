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
          <el-input style = "width: 550px;" v-model = "formData.username" autocomplete = "off" placeholder = "请输入路由名称..."></el-input>
          <br/><span>消费者的唯一用户名，必须填写此字段或自定义id字段</span>
        </el-form-item>
        <el-form-item class = "formItem" label = "自定义id" :label-width = "formLabelWidth" prop = "name">
          <!--autocomplete是否让浏览器自动记录之前输入的值-->
          <el-input style = "width: 550px;" v-model = "formData.custom_id" autocomplete = "off" placeholder = "请输入路由名称..."></el-input>
          <br/><span>为消费者存储唯一ID的字段，将Kong与用户映射到现有数据库。必须填写此字段或用户名字段。
            不支持中文，特殊字符仅支持'., -, _, ~'</span>
        </el-form-item>
      </el-form>
      <div slot = "footer" class = "dialog-footer">
        <el-button @click = "dialogFormVisble = false">取 消</el-button>
        <el-button type = "primary" @click = "saveConsumer">确 定</el-button> <!--@click = "onSubmit"-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'AddConsumer',
    inject: ['reload'],
    data () {
      return {
        titleName: '添加消费者',
        dialogFormVisble: false,
        formData: {
          username: '',
          custom_id: ''
        },
        formLabelWidth: '150px'
      }
    },
    mounted () {
    },
    methods: {
      clear () {
        this.formData = {
          username: '',
          custom_id: ''
        }
      },
      saveConsumer () {
        let _this = this
        if (this.formData.username === '') {
          this.formData.username = null
        }
        if (this.formData.custom_id === '') {
          this.formData.custom_id = null
        }
        this.$axios.post(localStorage.address + '/consumers/', this.formData)
          .then(() => {
            _this.reload()
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
