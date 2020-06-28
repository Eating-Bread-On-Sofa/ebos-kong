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
        <el-form-item class = "formItem" label = "路由名称" :label-width = "formLabelWidth" prop = "name">
          <!--autocomplete是否让浏览器自动记录之前输入的值-->
          <el-input style = "width: 550px;" v-model = "formData.name" autocomplete = "off" placeholder = "请输入路由名称..."></el-input>
          <br/><span>不支持中文，特殊字符仅支持'., -, _, ~'</span>
        </el-form-item>
        <el-form-item class = "formItem" label = "协议列表" :label-width = "formLabelWidth" prop = "protocols">
          <!--          <el-input v-model = "formData.protocol" autocomplete = "off"></el-input>-->
          <el-checkbox-group v-model = "formData.protocols">
            <el-checkbox label = "http"></el-checkbox>
            <el-checkbox label = "https"></el-checkbox>
            <el-checkbox label = "tcp"></el-checkbox>
            <el-checkbox label = "tls"></el-checkbox>
          </el-checkbox-group>
          <span>该路由允许的协议，默认为["http", "https"]，使用http或https协议时，'methods', 'hosts', 'paths', 'snis'至少设置一个</span>
        </el-form-item>
        <el-form-item class = "formItem" label = "HTTP方式" :label-width = "formLabelWidth" prop = "methods">
<!--          <el-input style = "width: 550px;" v-model = "formData.methods" autocomplete = "off"></el-input>-->
          <el-checkbox-group v-model = "formData.methods">
            <el-checkbox label = "GET"></el-checkbox>
            <el-checkbox label = "POST"></el-checkbox>
            <el-checkbox label = "DELETE"></el-checkbox>
            <el-checkbox label = "PATCH"></el-checkbox>
            <el-checkbox label = "PUT"></el-checkbox>
            <el-checkbox label = "HEAD"></el-checkbox>
            <el-checkbox label = "OPTIONS"></el-checkbox>
          </el-checkbox-group>
          <span>该路由允许的HTTP方法列表</span>
        </el-form-item>
        <el-form-item class = "formItem" label = "域名列表" :label-width = "formLabelWidth" prop = "hosts">
          <el-input style = "width: 550px;" v-model = "hosts" autocomplete = "off"></el-input>
          <br/><span>匹配该路由允许的域名列表，多个域名用半角状态的','隔开</span>
        </el-form-item>
        <el-form-item class = "formItem" label = "路径列表" :label-width = "formLabelWidth" prop = "paths">
          <el-input style = "width: 550px;" v-model = "paths" autocomplete = "off"></el-input>
          <br/><span>匹配该路由允许的路径列表，以"/"开头，不允许出现"//"，多个路径用半角状态的','隔开</span>
        </el-form-item>
<!--        <el-form-item class = "formItem" label = "https重定向状态码" :label-width = "formLabelWidth" prop = "https_redirect_status_code">-->
<!--          <el-input style = "width: 550px;" v-model = "formData.https_redirect_status_code" autocomplete = "off"></el-input>-->
<!--          <br/><span>【可选】请求上游服务器的路径，以"/"开头，不允许出现"//"</span>-->
<!--        </el-form-item>-->
        <el-form-item class = "formItem" label = "正则匹配优先级" :label-width = "formLabelWidth" prop = "regex_priority">
          <!--          <el-input v-model = "formData.connect_timeout" autocomplete = "off"></el-input>-->
          <el-input-number v-model = "formData.regex_priority" controls-position = "right" style = "width: 120px;"></el-input-number>
          <span>当多个路由同时使用正则表达式匹配时，用于选择哪个路由解析给定请求。当两条路由同时与路径匹配并具有相同的正则匹配优先级时，
            将选择最早创建的路由。请注意，非正则表达式路由的优先级不同（较长的非正则表达式路由在较短的路由之前匹配）</span>
        </el-form-item>
        <el-form-item class = "formItem" label = "是否删除匹配前缀" :label-width = "formLabelWidth" prop = "strip_path">
<!--          <el-input style = "width: 550px;" v-model = "formData.strip_path" autocomplete = "off"></el-input>-->
          <el-switch
            v-model = "formData.strip_path"
            active-color = "#13ce66"
            inactive-color = "#ff4949"
            active-text = "true"
            inactive-text = "false">
          </el-switch>
          <br/><span>当通过路径匹配路由，向上游服务器的请求中删除掉匹配到的路径前缀(即不带路径).</span>
        </el-form-item>
        <el-form-item class = "formItem" label = "是否保留该域名" :label-width = "formLabelWidth" prop = "preserve_host">
          <el-switch
            v-model = "formData.preserve_host"
            active-color = "#13ce66"
            inactive-color = "#ff4949"
            active-text = "true"
            inactive-text = "false">
          </el-switch>
          <br/><span>当通过域名匹配路由，若为true，向上游服务的请求中header使用该域名，若为false，使用服务中设置的主机名。默认为false</span>
        </el-form-item>
        <el-form-item class = "formItem" label = "SNI列表" :label-width = "formLabelWidth" prop = "snis">
          <el-input style = "width: 550px;" v-model = "snis" autocomplete = "off"></el-input>
          <br/><span>当使用流路由时，与此路由匹配的SNI列表。</span>
        </el-form-item>
        <el-form-item class = "formItem" label = "IP源列表" :label-width = "formLabelWidth" prop = "sources">
          <el-row style = "margin-left: 0px" :gutter = "20" v-for = "(item, index) in formData.sources" :key = "index">
            <el-col :span = "6">
              <el-input style = "width: 150px" v-model = "item.ip" placeholder = "10.1.0.0/16" ></el-input>
            </el-col>
            <el-col :span = "4">
              <el-input style = "width: 100px;" type = "number" v-model.number = "item.port" placeholder = "1234"  ></el-input>
            </el-col>
            <el-col :span = "6">
              <el-button style = "margin-left: 20px" @click = "formData.sources.splice(index,1)">Delete</el-button>
            </el-col>
          </el-row>
          <el-row :gutter = "20">
            <el-col :span = "6">
              <el-button type = "dashed" long @click = "addSource" icon = "el-icon-plus">Add item</el-button>
            </el-col>
          </el-row>
<!--          <el-input style = "width: 550px;" v-model = "formData.sources" autocomplete = "off"></el-input>-->
          <span>使用流路由时，与此路由匹配的传入连接的IP源列表。每个条目都是一个对象，
          其字段为“ ip”（可选，使用CIDR范围表示法）和/或“ port”</span>
        </el-form-item>
        <el-form-item class = "formItem" label = "IP目标列表" :label-width = "formLabelWidth" prop = "destinations">
<!--          <el-input style = "width: 550px;" v-model = "formData.destinations" autocomplete = "off"></el-input>-->
          <el-row style = "margin-left: 0px" :gutter = "20" v-for = "(item, index) in formData.destinations" :key = "index">
            <el-col :span = "6">
              <el-input style = "width: 150px" v-model = "item.ip" placeholder = "10.1.0.0/16" ></el-input>
            </el-col>
            <el-col :span = "4">
              <el-input style = "width: 100px;" type = "number" v-model.number = "item.port" placeholder = "1234"  ></el-input>
            </el-col>
            <el-col :span = "6">
              <el-button style = "margin-left: 20px" @click = "formData.destinations.splice(index,1)">Delete</el-button>
            </el-col>
          </el-row>
          <el-row :gutter = "20">
            <el-col :span = "6">
              <el-button type = "dashed" long @click = "addDestination" icon = "el-icon-plus">Add item</el-button>
            </el-col>
          </el-row>
          <span>使用流路由时，与此路由匹配的传入连接的IP目标列表。每个条目都是一个对象，
          其字段为“ ip”（可选，使用CIDR范围表示法）和/或“ port”。</span>
        </el-form-item>
        <el-form-item class = "formItem" label = "所属服务id" :label-width = "formLabelWidth" prop = "service">
          <el-input style = "width: 550px;" v-model = "formData.service.id" autocomplete = "off" disabled></el-input>
          <br/><span>该路由所关联的服务</span>
        </el-form-item>
<!--        <el-form-item v-if = "this.titleName  =  =  '添加服务'" class = "formItem" label = "url" :label-width = "formLabelWidth" prop = "url">-->
<!--          <el-input style = "width: 550px;" v-model = "formData.url" autocomplete = "off"></el-input>-->
<!--          <br/><span>【可选】能同时设置protocol, host, port 和 path(如,http://mockbin.org)，正确填写后无需<br/>设置protocol, host, port 和 path字段</span>-->
<!--        </el-form-item>-->
        <!--        <el-form-item prop = "id" style = "height: 0">-->
        <!--          <el-input type = "hidden" v-model = "formData.id" autocomplete = "off"></el-input>-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot = "footer" class = "dialog-footer">
        <el-button @click = "dialogFormVisble = false">取 消</el-button>
        <el-button type = "primary" @click = "saveRoute">确 定</el-button> <!--@click = "onSubmit"-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'AddRoute',
    inject: ['reload'],
    data () {
      return {
        titleName: '添加路由',
        dialogFormVisble: false,
        formData: {
          name: '',
          protocols: ['http', 'https'],
          methods: [],
          hosts: [],
          paths: [],
          // https_redirect_status_code: 426,
          regex_priority: 0,
          strip_path: true,
          preserve_host: false,
          snis: [],
          sources: [],
          destinations: [],
          service: {id: ''}
        },
        serviceId: '',
        routeId: '',
        formLabelWidth: '150px'
      }
    },
    mounted () {
      // this.routeId = localStorage.getItem()
      // 如果相等说明是同一个路由，已经保存本路由的id;如果不相等说明是新路由
      if (this.$route.params.id && localStorage.getItem('serviceId') !== this.$route.params.id) {
        localStorage.setItem('serviceId', this.$route.params.id)
      }
      this.serviceId = localStorage.getItem('serviceId')
      // console.log(this.serviceId)
      if (this.serviceId !== null) {
        this.formData.service.id = this.serviceId
      }
    },
    computed: {
      hosts: {
        set: function (newValue) {
          if (newValue) {
            this.formData.hosts = newValue.split(',')
          } else {
            this.formData.hosts = []
          }
        },
        get: function () {
          return this.formData.hosts ? this.formData.hosts.join(',') : ''
        }
      },
      paths: {
        set: function (newValue) {
          if (newValue) {
            this.formData.paths = newValue.split(',');
          } else {
            this.formData.paths = []
          }
        },
        get: function () {
          return this.formData.paths ? this.formData.paths.join(',') : ''
        }
      },
      snis: {
        set: function (newValue) {
          if (newValue) {
            this.formData.snis = newValue.split(',')
          } else {
            this.formData.snis = []
          }
        },
        get: function () {
          if (this.formData.snis) {
            return this.formData.snis.join(',')
          }
          return ''
        }
      }
    },
    // created () {
    //   if (this.$store.state.addOrEdit  =  =  =  'add') {
    //     this.titleName  =  '添加服务'
    //   } else {
    //     this.titleName  =  '修改服务'
    //   }
    // },
    // mounted () {
    //   if (this.titleName  =  =  =  '修改服务') {
    //     let serviceId  =  this.$route.params.id
    //     console.log(serviceId)
    //     this.getService(serviceId)
    //   }
    // },
    methods: {
      clear () {
        this.formData = {
          name: '',
          protocols: ['http', 'https'],
          methods: [],
          hosts: [],
          paths: [],
          regex_priority: 0,
          strip_path: true,
          preserve_host: false,
          snis: [],
          sources: [],
          destinations: [],
          service: {id: localStorage.getItem('serviceId')}
        }
      },
      saveRoute () {
        let _this = this
        let param = {}
        if (this.formData.id) {
          param.id = this.formData.id
        }
        if (this.formData.name) {
          param.name = this.formData.name
        }
        if (this.formData.url) {
          param.url = this.formData.url
        }
        if (this.formData.sources != null && this.formData.sources.length > 0) {
          param.sources = this.formData.sources
        } else {
          param.sources = null
        }
        if (this.formData.destinations != null && this.formData.destinations.length > 0) {
          param.destinations = this.formData.destinations
        } else {
          param.destinations = null
        }
        if (this.formData.protocols != null && this.formData.protocols.length>0) {
          param.protocols = this.formData.protocols
        } else {
          param.protocols = null
        }
        if (this.formData.hosts != null && this.formData.hosts.length > 0) {
          param.hosts = this.formData.hosts
        } else {
          param.hosts = null
        }
        if (this.formData.methods != null && this.formData.methods.length > 0) {
          param.methods = this.formData.methods
        } else {
          param.methods = null
        }
        if (this.formData.paths != null && this.formData.paths.length > 0) {
          param.paths = this.formData.paths
        } else {
          param.paths = null
        }

        param.regex_priority = this.formData.regex_priority
        param.strip_path = this.formData.strip_path
        param.preserve_host = this.formData.preserve_host

        if (this.formData.snis != null && this.formData.snis.length > 0) {
          param.snis = this.formData.snis
        } else {
          param.snis = null
        }
        param.service = this.formData.service

        if (_this.titleName === '添加路由') {
          _this.$axios.post(localStorage.address + '/routes/', param)
            .then(response => {
              // _this.$router.push('/routes')
              this.reload()
            })
            .catch(error => {
              let errorCode = error.response.status
              console.log(error.response)
              if (errorCode === 409) {
                this.$Message.error('服务名称重复，请重新填写')
              } else if (errorCode === 400 && error.response.data.fields.hosts) {
                this.$Message.error('主机名不能为空，不允许出现中文字符、纯数字')
              } else if (errorCode === 400 && error.response.data.fields.name) {
                this.$Message.error('服务名称含有不合法字符')
              } else if (errorCode === 400 && error.response.data.fields.paths) {
                this.$Message.error('请填写正确的路径选项')
              } else if (errorCode === 400 && error.response.data.message === "schema violation (must set one of 'methods', 'hosts', 'headers', 'paths', 'snis' when 'protocols' is 'https')") {
                this.$Message.error('methods, hosts, paths, snis字段至少设置一个')
              } else if (errorCode === 400 && error.response.data.fields.protocols) {
                this.$Message.error('协议不能为空')
              } else if (errorCode === 400 && error.response.data.message === "schema violation (methods: cannot set 'methods' when 'protocols' is 'tcp' or 'tls')") {
                this.$Message.error('当协议为tcp或tls时不能设置http方式')
              } else {
                this.$Message.error(error.response.data.message)
              }
            })
        } else {
          // 修改路由
          // console.log(this.routeId)
          this.$axios.patch(localStorage.address + '/routes/' + this.routeId, param)
            .then(() => {
              this.reload()
            })
            .catch(error => {
              let errorCode = error.response.status
              console.log(error.response)
              if (errorCode === 409) {
                this.$Message.error('服务名称重复，请重新填写')
              } else if (errorCode === 400 && error.response.data.fields.hosts) {
                this.$Message.error('主机名不能为空，不允许出现中文字符、纯数字')
              } else if (errorCode === 400 && error.response.data.fields.name) {
                this.$Message.error('服务名称含有不合法字符')
              } else if (errorCode === 400 && error.response.data.fields.paths) {
                this.$Message.error('请填写正确的路径选项')
              } else if (errorCode === 400 && error.response.data.message === "schema violation (must set one of 'methods', 'hosts', 'headers', 'paths', 'snis' when 'protocols' is 'https')") {
                this.$Message.error('methods, hosts, paths, snis字段至少设置一个')
              } else if (errorCode === 400 && error.response.data.fields.protocols) {
                this.$Message.error('协议不能为空')
              } else if (errorCode === 400 && error.response.data.message === "schema violation (methods: cannot set 'methods' when 'protocols' is 'tcp' or 'tls')") {
                this.$Message.error('当协议为tcp或tls时不能设置http方式')
              } else {
                this.$Message.error(error.response.data.message)
              }
            })
        }
      },
      addSource () {
        if (this.formData.sources === null) {
          this.formData.sources = []
        }
        this.formData.sources.push({ip: '', port: ''})
      },
      addDestination () {
        if (this.formData.destinations === null) {
          this.formData.destinations = []
        }
        this.formData.destinations.push({ip: '', port: ''})
      }
    }
  }
</script>

<style scoped>
  .formItem {
    bottom: 14px;
  }
</style>
