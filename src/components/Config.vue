<template>
  <div>
    <el-form class="login-container" label-position="left"
             label-width="200px" :rules="ruleCustom" ref="form" :model="formItem">
      <h3 class="login_title">统一接入网关</h3>
      <el-form-item  label="Kong-Admin地址：" prop="address">
        <el-input style="width: 370px;float: right" type="text" v-model="formItem.address"
                  auto-complete="off" placeholder="http://192.168.0.200:8001"></el-input>
      </el-form-item>
<!--      <el-form-item label="Custom Headers:" prop="headers">-->
<!--        <el-input type="text" v-model="formItem.headers"-->
<!--                  auto-complete="off" placeholder='{"Authorization":"Basic YWRtaW46YWRtaW4="}'></el-input>-->
<!--      </el-form-item>-->
      <el-form-item >
        <el-button type="primary" @click="test" style="background: #505458;border: none;margin-left: -100px">进入</el-button>
        <el-button type="success" @click="clear" style="background: #505458;border: none;margin-right: 90px">清除地址</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'Config',
    data () {
      const validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入Kong管理接口地址'))
        } else {
          if (!value.startsWith('http://') && !value.startsWith('https://')) {
            callback(new Error('URL错误，必须是http:// 或 https://开头'))
            return
          }
          if(value.endsWith('/')) {
            callback(new Error('URL错误,不能以/结尾'))
            this.formItem.address = this.formItem.address.substr(0, this.formItem.address.length - 1)
            return
          }
          callback()
        }
      }
      // const headerValidator = (rule, value, callback) => {
      //   if (!value) {
      //     callback()
      //   } else {
      //     try {
      //       let headerMap = JSON.parse(value)
      //       console.log(headerMap)
      //       callback()
      //     } catch (e) {
      //       callback(new Error('header 格式错误，必须是json'))
      //     }
      //   }
      // }
      return {
        formItem: {
          address: ''
          // headers: ''
        },
        ruleCustom: {
          address: [
            {validator: validatePass, trigger: 'blur'}
          ]
          // headers: [
          //   {validator: headerValidator, trigger: 'blur'}
          // ]
        }
      }
    },
    mounted () {
      this.formItem.address = localStorage.address
      // this.formItem.headers = localStorage.headers
    },
    methods: {
      // 将登录的信息保存到本地缓存,然后跳往展示界面
      saveConfig () {
        // console.log(this.formItem)
        let url = this.formItem.address.trim()
        var result
        localStorage.address = this.formItem.address.trim()
        if(url.includes('localhost')) {
          result = 'localhost'
        } else {
          result = url.match(/(\d{1,3}\.){3}\d{1,3}/g)[0]
        }
        localStorage.ip = result
        // console.log(localStorage.ip)
        // for(let i = url.length; i >= 0; i--) {
        //   if(url[i] == ':') {
        //     continue
        //   }
        //
        // }
        // if (localStorage.headers !== this.formItem.headers) {
        //   localStorage.headers = this.formItem.headers
        // }
        var path = this.$route.query.redirect
        this.$store.commit('saveAdmin', this.formItem.address)
        this.$store.commit('saveIsLogin', true)
        // this.$store.commit('setLogin', 'true')
        this.$router.push({path: path === '/' || path === undefined ? '/serverInfo' : path})
        // this.$router.push('/info')
      },
      test () {

        let _this = this
        //验证地址
        this.$refs.form.validate((valid) => {
          if (valid) {
            let config = {}
            // 如果表单用户输入的header信息不为空就放到config对象里
            // if(this.formItem.headers) {
            //   config.headers = JSON.parse(this.formItem.headers)
            // }
            // console.log(config)
            _this.$axios
              .get(this.formItem.address.trim(), config)
              .then(response => {
                let kongInfo = response.data
                // console.log(kongInfo)
                let version = kongInfo.version
                if (version == null) {
                  this.$Message.error({
                    content: '无法获取Kong的版本号，请检查您输入的接口地址',
                    duration: 10
                  })
                }
                let versionArr = version.split('.')
                if (versionArr.length !== 3) {
                  this.versionNotSupport(version)
                  return
                }
                // 只要满足版本号大于0.14即可
                if (versionArr[0] > 0) {
                  this.saveConfig()
                  return
                }
                if (versionArr[1] >= 14) {
                  this.saveConfig()
                  return
                }
                this.versionNotSupport(version)
              })
              .catch(function () {
                _this.$Message.error(
                //   {
                //   content: '连接管理接口失败，请检测您输入的地址，或者您的网络没有权限访问管理接口',
                //   duration: 10
                // }
                  '连接管理接口失败，请检测您输入的地址，或者您的网络没有权限访问管理接口'
                )
              })
          } else {
            this.$Message.error('Kong管理接口地址错误')
          }
        })
      },
      // 版本不支持的方法
      versionNotSupport (version) {
        this.$Message.error({
          content: '不支持' + version + '版本,我们只支持 0.14.0或更高版本',
          duration: 10
        })
      },
      // 清除地址
      clear () {
        localStorage.removeItem('address')
        this.formItem.address = ''
      }
    }
  }
</script>

<style scoped>
  /*input {*/
  /*  margin-left: 20px;*/
  /*}*/

  .login-container {
    border-radius: 15px; /*添加圆角的边框*/
    /*background-clip: padding-box;  !*指定背景绘制区域。看https://www.runoob.com/try/try.php?filename=trycss3_background-clip*!*/
    margin: 90px auto; /*设置所有外边距属性 上右下左*/
    width: 500px;/*定义元素内容区的宽度*/
    padding: 35px 35px 15px 35px; /*设置所有内边距属性。指一个元素的内容和其边界之间的空间*/
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  body {
    margin: 0px;
  }
</style>
