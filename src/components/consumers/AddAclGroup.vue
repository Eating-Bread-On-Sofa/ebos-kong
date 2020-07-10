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
        <el-form-item class = "formItem" label = "分组名称" :label-width = "formLabelWidth">
          <!--autocomplete是否让浏览器自动记录之前输入的值-->
          <el-input style = "width: 550px;" v-model = "formData.group" autocomplete = "off" placeholder = "请输入分组名称..."></el-input>
          <br/><span>ACL分组的名称</span>
        </el-form-item>
      </el-form>
      <div slot = "footer" class = "dialog-footer">
        <el-button @click = "dialogFormVisble = false">取 消</el-button>
        <el-button type = "primary" @click = "saveGroup">确 定</el-button> <!--@click = "onSubmit"-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'AddAclGroup',
    inject: ['reload'],
    data () {
      return {
        titleName: '添加分组',
        dialogFormVisble: false,
        formData: {
          group: ''
        },
        formLabelWidth: '150px'
      }
    },
    mounted () {

    },
    methods: {
      clear () {
        this.formData = {
          group: ''
        }
      },
      saveGroup () {
        // console.log(this.$route.params.consumerId)
        this.$axios.post(localStorage.address + '/consumers/' + this.$route.params.consumerId + '/acls', this.formData)
          .then(() => {
            this.dialogFormVisble = false
            this.$emit('refresh')
            // this.reload()
          })
          .catch((error) => {
            this.$Message.error(error.response.message)
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
