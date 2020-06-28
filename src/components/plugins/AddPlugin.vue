<template>
  <div>
    <el-container>
      <el-aside width="12.5%"></el-aside>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px">
          <el-breadcrumb-item :to="{ path: '/info' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/plugins' }">插件列表</el-breadcrumb-item>
          <el-breadcrumb-item>添加插件</el-breadcrumb-item>
          <!--          <template><el-breadcrumb-item></el-breadcrumb-item></template>-->
        </el-breadcrumb>
        <el-row v-if="this.$store.state.isAdd">
          <el-col :span="24"><div class="grid-content bg-purple">
            <el-tabs style="width: 700px;margin-left: 19%;margin-bottom: 40px" v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="身份认证" name="1"></el-tab-pane>
              <el-tab-pane label="安全控制" name="2"></el-tab-pane>
              <el-tab-pane label="流量控制" name="3"></el-tab-pane>
              <el-tab-pane label="Serverless" name="4"></el-tab-pane>
              <el-tab-pane label="分析&监控" name="5"></el-tab-pane>
              <el-tab-pane label="转换" name="6"></el-tab-pane>
              <el-tab-pane label="日志" name="7"></el-tab-pane>
              <el-tab-pane label="其他插件" name="8"></el-tab-pane>
              <!--              <el-tab-pane label="插件" name="4"></el-tab-pane>-->
            </el-tabs>
          </div></el-col>
        </el-row>
        <el-form v-model="formItem" style="text-align: left;">
          <!--prop:表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的-->
          <el-form-item class="formItem" label="插件名称" :label-width="formLabelWidth">
            <!--autocomplete是否让浏览器自动记录之前输入的值-->
<!--            <el-input style="width: 550px;" v-model="formItem.name" autocomplete="off" placeholder="请输入服务名称..."></el-input>-->
            <el-select v-model="formItem.name" filterable placeholder="请选择" :disabled="isdisabled">
              <el-option
                v-for="item in enabledPlugins"
                :key="item"
                :label="item "
                :value="item">
                <span v-if="item == 'basic-auth'">basic-auth： 基本认证</span>
                <span v-if="item == 'key-auth'">key-auth： 密钥认证</span>
                <span v-if="item == 'oauth2'">oauth2： 开放授权</span>
                <span v-if="item == 'hmac-auth'">hmac-auth： 散列消息认证码</span>
                <span v-if="item == 'jwt'">jwt： JSON web token</span>
                <span v-if="item == 'ldap-auth'">ldap-auth： Ldap服务器认证</span>
                <span v-if="item == 'acl'">acl： 访问控制列表</span>
                <span v-if="item == 'cors'">cors： 跨域</span>
                <span v-if="item == 'ip-restriction'">ip-restriction： IP地址访问控制</span>
                <span v-if="item == 'bot-detection'">bot-detection： 机器人检测</span>
                <span v-if="item == 'rate-limiting'">rate-limiting： 流量限制</span>
                <span v-if="item == 'request-size-limiting'">request-size-limiting： 请求体范围限制</span>
                <span v-if="item == 'request-termination'">request-termination： 熔断</span>
                <span v-if="item == 'aws-lambda'">aws-lambda</span>
                <span v-if="item == 'pre-function'">pre-function</span>
                <span v-if="item == 'post-function'">post-function</span>
                <span v-if="item == 'azure-functions'">azure-functions</span>
                <span v-if="item == 'prometheus'">prometheus： 监控</span>
                <span v-if="item == 'zipkin'">zipkin： 监控</span>
                <span v-if="item == 'request-transformer'">request-transformer： 请求转换器</span>
                <span v-if="item == 'response-transformer'">response-transformer： 响应转换器</span>
                <span v-if="item == 'correlation-id'">correlation-id： 关联请求和响应</span>
                <span v-if="item == 'tcp-log'">tcp-log： TCP日志</span>
                <span v-if="item == 'udp-log'">udp-log： UDP日志</span>
                <span v-if="item == 'http-log'">http-log： HTTP日志</span>
                <span v-if="item == 'file-log'">file-log： 文件日志</span>
                <span v-if="item == 'syslog'">syslog： 系统日志</span>
                <span v-if="item == 'loggly'">loggly</span>
                <span v-if="item == 'proxy-cache'">proxy-cache： 代理缓存</span>
                <span v-if="item == 'acme'">acme</span>
                <span v-if="item == 'session'">session</span>
              </el-option>
            </el-select>
            <br/><span>要添加插件的名称</span>
          </el-form-item>

          <el-form-item class="formItem" label="服务" :label-width="formLabelWidth">
            <el-select v-model="serviceId" style="width: 400px" filterable ref="service" clearable placeholder="请选择" @change="selectDisposeCode" autocomplete="off">
              <el-option
                v-for="item in services"
                :key="item.id"
                :label="item.id + ' ' + item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <br/><span>若将插件只作用于'服务'，请保留'路由'和'消费者'字段为空白</span>
          </el-form-item>

          <el-form-item class="formItem" label="路由" :label-width="formLabelWidth">
            <el-select v-model="formItem.route.id" style="width: 400px"  filterable clearable placeholder="请选择">
              <el-option
                v-for="item in routes"
                :key="item.id"
                :label="item.id"
                :value="item.id">
              </el-option>
            </el-select>
            <br/><span>若将插件只作用于'路由'，请保留'服务'和'消费者'字段为空白</span>
          </el-form-item>

<!--          <el-form-item class="formItem" label="消费者" :label-width="formLabelWidth">-->
<!--            <el-select v-model="formItem.consumer.id" style="width: 400px"  filterable clearable placeholder="请选择">-->
<!--              <el-option-->
<!--                v-for="item in consumers"-->
<!--                :key="item.id"-->
<!--                :label="item.id + ' ' + item.username"-->
<!--                :value="item.id">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--            <br/><span>若将插件只作用于'路由'，请保留'服务'和'消费者'字段为空白</span>-->
<!--          </el-form-item>-->

          <el-form-item class="formItem" label="是否开启" :label-width="formLabelWidth">
            <el-switch v-model = "formItem.enabled" active-color = "#13ce66" inactive-color = "#ff4949" active-text = "true" inactive-text = "false">
            </el-switch>
            <br/><span></span>
          </el-form-item>

          <el-form-item v-for="field in flatFields" class="formItem" :label="field.fieldName+':'"
                        :key="field.fieldName" :label-width="formLabelWidth">
            <el-input style="width: 550px;" v-if="field.fieldType==='string'" :name="field.fieldName"
                      @input="valueChange($event,field)" v-model="field.defaultValue" ></el-input>

            <el-input style="width: 550px;" v-if="field.fieldType==='array'&&field.elementType==='string'" :name="field.fieldName"
                      @input="valueChange($event,field)" placeholder="多个值请用半角状态下','隔开"
                      v-model="field.defaultValue"></el-input>

            <el-input style="width: 550px;" v-if="field.fieldType==='set'&&field.elementType==='string'" :name="field.fieldName"
                      @input="valueChange($event,field)" placeholder="多个值请用半角状态下','隔开"
                      v-model="field.defaultValue"></el-input>

            <el-input-number controls-position="right" style="width: 220px;"
                             v-if="field.fieldType==='number'" :name="field.fieldName"
                             @input="valueChange($event,field)"
                             v-model="field.defaultValue"></el-input-number>

            <el-input-number controls-position="right" style="width: 120px;"
                             v-if="field.fieldType==='integer'" :name="field.fieldName"
                             @input="valueChange($event,field)"
                             v-model="field.defaultValue"></el-input-number>

            <el-switch active-color = "#13ce66" inactive-color = "#ff4949" active-text = "true" inactive-text = "false"
                       v-if="field.fieldType==='boolean'" :name="field.fieldName" size="large"
                       @input="valueChange($event,field)"
                       v-model="field.defaultValue">
            </el-switch>
          </el-form-item>
          <el-form-item>
<!--            <div slot="footer" class="dialog-footer">-->
<!--              &lt;!&ndash;@click="savePlugin"&ndash;&gt;-->
              <el-button style="margin-left: 40%" @click="savePlugin" type="primary">提 交</el-button> <!---->
<!--            </div>-->
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import SortPluginAdd from './SortPluginAdd'
  export default {
    name: 'AddPlugin',
    components: {SortPluginAdd},
    data () {
      return {
        serviceId: '',
        pluginId: '',
        activeName: '1',
        routeId: '',
        formItem: {
          name: '',
          consumer: {},
          service: {},
          route: {},
          config: {},
          enabled: true
        },
        formLabelWidth: '300px',
        enabledPlugins: [],
        AuthenticationPlugins: [],
        SecurityPlugins: [],
        TrafficControlPlugins: [],
        ServerlessPlugins: [],
        AnalyticsMonitoringPlugins: [],
        TransformationsPlugins: [],
        LoggingPlugins: [],
        OtherPlugins: [],
        schemaFields: [],
        flatFields: [],
        consumers: [],
        services: [],
        routes: [],
        runOns: ['first', 'second', 'all']
      }
    },
    // computed: {
    //   isdisabledFn () {
    //     if (this.$store.state.isAdd) {
    //       this.isdisabled = false
    //       return this.isdisabled
    //     } else {
    //       this.isdisabled = true
    //       return this.isdisabled
    //     }
    //   }
    // },
    watch: {
      name: function (newVal, oldVal) {
        if (oldVal) {
          this.formItem.config = {}
        }
        this.loadPluginSchema()
      }
    },
    computed: {
      name () {
        return this.formItem.name
      },
      isdisabled () {
        return !this.$store.state.isAdd
      }
    },
    mounted () {
      this.routeId = this.$route.params.idRoute
      if (this.routeId) {
        this.setRouteId(this.routeId)
      }
      this.serviceId = this.$route.params.idService
      if (this.serviceId) {
        this.selectDisposeCode(this.serviceId)
      }
      this.formItem.consumer.id = this.$route.params.consumerId;
      this.pluginId = this.$route.params.pluginId
      if (this.pluginId) {
        this.loadPlugin()
        this.$store.commit('saveIsAdd', false)
      } else {
        this.loadPlugins()
        this.loadConsumers()
        this.loadServices()
      }
    },
    methods: {
      handleClick (tab) {
        // console.log(tab.name)
        this.activeName = tab.name
        // this.enabledPlugins = []
        this.formItem.name = ''
        if (this.activeName === '1') {
          this.enabledPlugins = this.AuthenticationPlugins
        } else if (this.activeName === '2') {
          this.enabledPlugins = this.SecurityPlugins
        } else if (this.activeName === '3') {
          this.enabledPlugins = this.TrafficControlPlugins
        } else if (this.activeName === '4') {
          this.enabledPlugins = this.ServerlessPlugins
        } else if (this.activeName === '5') {
          this.enabledPlugins = this.AnalyticsMonitoringPlugins
        } else if (this.activeName === '6') {
          this.enabledPlugins = this.TransformationsPlugins
        } else if (this.activeName === '7') {
          this.enabledPlugins = this.LoggingPlugins
        } else if (this.activeName === '8') {
          this.enabledPlugins = this.OtherPlugins
        }
      },
      loadPlugin () {
        this.$axios.get(localStorage.address + '/plugins/' + this.pluginId)
          .then((response) => {
            this.formItem = response.data
            // console.log(this.formItem)
            this.serviceId = this.formItem.service === null ? '' : this.formItem.service.id
            // console.log(this.serviceId)
            if (!this.formItem.consumer) {
              this.formItem.consumer = {}
            }
            if (!this.formItem.route) {
              this.formItem.route = {}
            }
            if (!this.formItem.service) {
              this.formItem.service = {}
            }
            this.loadPlugins()
            this.loadConsumers()
            this.loadServices()
          })
      },
      loadPlugins () {
        let _this = this
        this.$axios.get(localStorage.address + '/plugins/enabled')
          .then((response) => {
            for (var i = 0; i < response.data.enabled_plugins.length; i++) {
              let plugin = response.data.enabled_plugins[i]
              if (plugin === 'basic-auth' || plugin === 'key-auth' || plugin === 'oauth2' || plugin === 'hmac-auth' || plugin === 'jwt' || plugin === 'ldap-auth') {
                _this.AuthenticationPlugins.push(plugin)
              } else if (plugin === 'acl' || plugin === 'cors' || plugin === 'ip-restriction' || plugin === 'bot-detection') {
                _this.SecurityPlugins.push(plugin)
              } else if (plugin === 'rate-limiting' || plugin === 'request-size-limiting' || plugin === 'request-termination') {
                _this.TrafficControlPlugins.push(plugin)
              } else if (plugin === 'aws-lambda' || plugin === 'pre-function' || plugin === 'post-function' || plugin === 'azure-functions') {
                _this.ServerlessPlugins.push(plugin)
              } else if (plugin === 'prometheus' || plugin === 'zipkin') {
                _this.AnalyticsMonitoringPlugins.push(plugin)
              } else if (plugin === 'request-transformer' || plugin === 'response-transformer' || plugin === 'correlation-id') {
                _this.TransformationsPlugins.push(plugin)
              } else if (plugin === 'tcp-log' || plugin === 'udp-log' || plugin === 'http-log' || plugin === 'file-log' || plugin === 'syslog' || plugin === 'loggly') {
                _this.LoggingPlugins.push(plugin)
              } else if (plugin === 'proxy-cache' || plugin === 'acme' || plugin === 'session') {
                _this.OtherPlugins.push(plugin)
              }
            }
            //
            // let enabled = []
            this.enabledPlugins = this.AuthenticationPlugins
            // console.log(this.AuthenticationPlugins)
          })
      },
      // 查看插件所需配置的字段
      loadPluginSchema () {
        if (this.name) {
          this.$axios.get(localStorage.address + '/plugins/schema/' + this.name)
            .then((response) => {
              // 得到需要配置的字段
              // console.log(response.data)
              this.schemaFields = response.data.fields
              this.flatFields = []
              this.unpackFields(this.schemaFields, 'config')
              // for (let field of this.flatFields) {
              //   if (field.fieldType === 'map' || field.elementType === 'record') {
              //     this.$Message.warning('Sorry,We not support this plugin yet')
              //     this.flatFields = []
              //     break
              //   }
              // }
            })
        }
      },
      unpackFields (fields, parent) {
        for (let i = 0; i < fields.length; i++) {
          let field = fields[i]
          // 把一个对象的键值以数组的形式遍历出来
          let entries = Object.entries(field)
          // console.log(entries)
          let fieldName = entries[0][0]
          // console.log(fieldName)
          let fieldValue = entries[0][1]
          let type = fieldValue.type
          // console.log(type)
          if (type === 'record') {
            let fieldObj = Object.entries(fieldValue.fields)
            // console.log(fieldObj)
            this.unpackRecord(fieldObj, parent + '.' + fieldName)
          } else {
            let elementType
            let defaultValue = fieldValue.default
            if (fieldValue.elements) {
              elementType = fieldValue.elements.type
              defaultValue = fieldValue.elements.default
            }
            // console.log(elementType)
            // console.log(defaultValue)
            let finalFieldName = parent + '.' + fieldName
            // console.log(finalFieldName)
            let formField = this.formField(finalFieldName, type, elementType, defaultValue, fieldValue.values)
            this.flatFields.push(formField)
            this.valueChange(formField.defaultValue, formField)
          }
        }
      },
      unpackRecord (fields, parent) {
        for (let i = 0; i < fields.length; i++) {
          let field = fields[i]
          // console.log(field)
          let fieldName = field[0]
          console.log(field[1])
          if (field[1].body) {
            if (!isNaN(fieldName)) {
              let elementType
              let defaultValue = field[1].default
              elementType = field[1].body.elements.type
              // console.log(elementType)
              defaultValue = field[1].body.elements.default
              // console.log(defaultValue)
              // if (field[1].elements) {
              //   // console.log(field[1])
              //   elementType = field[1].elements.type
              //   defaultValue = field[1].elements.default
              // }
              let finalFieldName = parent + '.body'
              let formField = this.formField(finalFieldName, field[1].body.type, elementType, defaultValue, field[1].body.values)
              // console.log(formField)
              this.flatFields.push(formField)
              // console.log(this.flatFields)
              this.valueChange(formField.defaultValue, formField)
            }
          }
          if (field[1].headers) {
            this.formatForRequestTran(fieldName, field[1], field[1].headers, 'headers', parent)
          }
          if (field[1].querystring) {
            this.formatForRequestTran(fieldName, field[1], field[1].querystring, 'querystring', parent)
          }
          if (field[1].uri) {
            this.formatForRequestTran(fieldName, field[1], field[1].uri, 'uri', parent)
          }
          if (field[1].json) {
            this.formatForRequestTran(fieldName, field[1], field[1].json, 'json', parent)
          }
          if (field[1].json_types) {
            this.formatForRequestTran(fieldName, field[1], field[1].json_types, 'json_types', parent)
          }
        }
      },
      formatForRequestTran (fieldName, field1, info, val, parent) {
        if (!isNaN(fieldName)) {
          let elementType
          let defaultValue = field1.default
          elementType = val !== 'uri' ? info.elements.type : undefined
          // console.log(elementType)
          defaultValue = val !== 'uri' ? info.elements.default : undefined
          // console.log(defaultValue)
          let finalFieldName = parent + '.' + val
          let formField = this.formField(finalFieldName, info.type, elementType, defaultValue, info.values)
          // console.log(formField)
          this.flatFields.push(formField)
          // console.log(this.flatFields)
          this.valueChange(formField.defaultValue, formField)
        }
      },
      formField (fieldName, fieldType, elementType, defaultValue, mapValueFields) {
        let array = fieldName.split('.')
        // console.log(array)
        let obj = this.formItem.config
        // console.log(obj)
        for (let i = 1; i < array.length; i++) {
          let name = array[i]
          if (i < array.length - 1) {
            // not the last one
            if (!obj[name]) {
              break
            }
            obj = obj[name]
          } else {
            let value = obj[name]
            if (value) {
              if (fieldType === 'array' || fieldType === 'set') {
                defaultValue = value.join(',')
              } else {
                defaultValue = value
              }
            }
          }
        }
        return {
          fieldName: fieldName,
          fieldType: fieldType,
          defaultValue: defaultValue,
          elementType: elementType,
          mapValueFields: mapValueFields
        }
      },
      loadConsumers () {
        let url = localStorage.address + '/consumers'
        this.$axios.get(url)
          .then((response) => {
            this.consumers = response.data.data
          })
      },
      loadServices () {
        this.$axios.get(localStorage.address + '/services')
          .then((response) => {
            this.services = response.data.data
          })
      },
      loadRoutes () {
        this.routes = []
        let url = localStorage.address + '/routes'
        if (this.formItem.service.id) {
          url = localStorage.address + '/services/' + this.formItem.service.id + '/routes'
        }
        this.$axios.get(url)
          .then((response) => {
            this.routes = response.data.data
          })
      },
      selectDisposeCode (value) {
        this.serviceId = value
        this.formItem.service.id = value
        this.loadRoutes()
        // this.$forceUpdate()
      },
      setRouteId (val) {
        this.formItem.route.id = val
      },
      // 只要框里有内容输入或改变就调用此函数
      valueChange: function (val, formField) {
        this.$forceUpdate()
        // console.log(val)
        if (val == null) {
          return
        }
        let fieldName = formField.fieldName
        let fieldType = formField.fieldType
        let elementType = formField.elementType
        if (fieldType === 'array' && elementType === 'string') {
          val = val.split(',')
        }
        if (fieldType === 'array' && elementType === 'number') {
          let tmpStrArray = val.split(',')
          val = []
          tmpStrArray.forEach(str => {
            val.push(parseInt(str))
          })
        }

        let nameArr = fieldName.split('.')
        let obj = this.formItem.config
        for (let i = 1; i < nameArr.length; i++) {
          let name = nameArr[i]
          if (i < nameArr.length - 1) {
            // not the last one
            if (!obj[name]) {
              obj[name] = {}
            }
            obj = obj[name]
          } else {
            obj[name] = val
          }
        }
      },
      savePlugin () {
        let _this = this
        let formData = JSON.parse(JSON.stringify(this.formItem))
        // console.log(formData)
        // console.log(formData)
        if (!formData.service.id) {
          formData.service = null
        }
        if (!formData.consumer.id) {
          formData.consumer = null
        }
        if (!formData.route.id) {
          formData.route = null
        }

        if (!this.pluginId) {
          if (formData.name === 'request-transformer') {
            this.isRequestTranAdd(formData)
          }
          if (formData.name === 'response-transformer') {
            this.isResponseTranAdd(formData)
          }
          this.$axios.post(localStorage.address + '/plugins', formData)
            .then(() => {
              _this.$router.go(-1)
            })
            .catch((error) => {
              this.$Message.error(error.response.data.message)
            })
        } else {
          if (formData.name === 'request-transformer') {
            this.isRequestTranEdit(formData)
          }
          if (formData.name === 'response-transformer') {
            this.isResponseTranEdit(formData)
          }
          this.$axios.patch(localStorage.address + '/plugins/' + this.pluginId, formData)
            .then(() => {
              _this.$router.go(-1)
            })
            .catch((error) => {
              // console.log(error.response)
              this.$Message.error(error.response.data.message)
            })
        }
      },
      isRequestTranAdd (formData) {
        if (!formData.config.rename) {
          formData.config.rename = {}
        }
        if (!formData.config.remove) {
          formData.config.remove = {}
        }
        if (!formData.config.replace) {
          formData.config.replace = {}
        }
        if (!formData.config.append) {
          formData.config.append = {}
        }
        if (!formData.config.add) {
          formData.config.add = {}
        }
      },
      isResponseTranAdd (formData) {
        if (!formData.config) {
          formData.config.rename = {}
          formData.config.remove = {}
          formData.config.replace = {}
          formData.config.append = {}
          formData.config.add = {}
        }
        if (!formData.config.rename) {
          formData.config.rename = {}
        }
        if (!formData.config.remove) {
          formData.config.remove = {}
        }
        if (!formData.config.replace) {
          formData.config.replace = {}
        }
        if (!formData.config.append) {
          formData.config.append = {}
        }
        if (!formData.config.add) {
          formData.config.add = {}
        }
      },
      isRequestTranEdit (formData) {
        if (formData.config.rename && formData.config.rename.body.length === 1 && formData.config.rename.body[0] === '') {
          formData.config.rename.body = []
        }
        if (formData.config.rename && formData.config.rename.headers.length === 1 && formData.config.rename.headers[0] === '') {
          formData.config.rename.headers = []
        }
        if (formData.config.rename && formData.config.rename.querystring.length === 1 && formData.config.rename.querystring[0] === '') {
          formData.config.rename.querystring = []
        }

        if (formData.config.remove && formData.config.remove.body.length === 1 && formData.config.remove.body[0] === '') {
          formData.config.remove.body = []
        }
        if (formData.config.remove && formData.config.remove.headers.length === 1 && formData.config.remove.headers[0] === '') {
          formData.config.remove.headers = []
        }
        if (formData.config.remove && formData.config.remove.querystring.length === 1 && formData.config.remove.querystring[0] === '') {
          formData.config.remove.querystring = []
        }

        if (formData.config.replace && formData.config.replace.body.length === 1 && formData.config.replace.body[0] === '') {
          formData.config.replace.body = []
        }
        if (formData.config.replace && formData.config.replace.headers.length === 1 && formData.config.replace.headers[0] === '') {
          formData.config.replace.headers = []
        }
        if (formData.config.replace && formData.config.replace.querystring.length === 1 && formData.config.replace.querystring[0] === '') {
          formData.config.replace.querystring = []
        }

        if (formData.config.append && formData.config.append.body.length === 1 && formData.config.append.body[0] === '') {
          formData.config.append.body = []
        }
        if (formData.config.append && formData.config.append.headers.length === 1 && formData.config.append.headers[0] === '') {
          formData.config.append.headers = []
        }
        if (formData.config.append && formData.config.append.querystring.length === 1 && formData.config.append.querystring[0] === '') {
          formData.config.append.querystring = []
        }

        if (formData.config.add && formData.config.add.body.length === 1 && formData.config.add.body[0] === '') {
          formData.config.add.body = []
        }
        if (formData.config.add && formData.config.add.headers.length === 1 && formData.config.add.headers[0] === '') {
          formData.config.add.headers = []
        }
        if (formData.config.add && formData.config.add.querystring.length === 1 && formData.config.add.querystring[0] === '') {
          formData.config.add.querystring = []
        }
      },
      isResponseTranEdit (formData) {
        if (formData.config.rename && formData.config.rename.headers.length === 1 && formData.config.rename.headers[0] === '') {
          formData.config.rename.headers = []
        }

        if (formData.config.remove && formData.config.remove.json.length === 1 && formData.config.remove.json[0] === '') {
          formData.config.remove.json = []
        }
        if (formData.config.remove && formData.config.remove.headers.length === 1 && formData.config.remove.headers[0] === '') {
          formData.config.remove.headers = []
        }

        if (formData.config.replace && formData.config.replace.json.length === 1 && formData.config.replace.json[0] === '') {
          formData.config.replace.json = []
        }
        if (formData.config.replace && formData.config.replace.headers.length === 1 && formData.config.replace.headers[0] === '') {
          formData.config.replace.headers = []
        }
        if (formData.config.replace && formData.config.replace.json_types.length === 1 && formData.config.replace.json_types[0] === '') {
          formData.config.replace.json_types = []
        }

        if (formData.config.append && formData.config.append.json.length === 1 && formData.config.append.json[0] === '') {
          formData.config.append.json = []
        }
        if (formData.config.append && formData.config.append.headers.length === 1 && formData.config.append.headers[0] === '') {
          formData.config.append.headers = []
        }
        if (formData.config.append && formData.config.append.json_types.length === 1 && formData.config.append.json_types[0] === '') {
          formData.config.append.json_types = []
        }

        if (formData.config.add && formData.config.add.json.length === 1 && formData.config.add.json[0] === '') {
          formData.config.add.json = []
        }
        if (formData.config.add && formData.config.add.headers.length === 1 && formData.config.add.headers[0] === '') {
          formData.config.add.headers = []
        }
        if (formData.config.add && formData.config.add.json_types.length === 1 && formData.config.add.json_types[0] === '') {
          formData.config.add.json_types = []
        }
      }
    }
  }
</script>

<style scoped>

</style>
