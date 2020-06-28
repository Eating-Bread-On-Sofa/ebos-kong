<template>
  <div>
    <el-dialog
      :visible.sync = "dialogFormVisble"
      top = "3vh"
      @close = "clear"
      width="1000px"
      :center="center">
      <div slot = "title" style = "font-size: 20px;margin-top: 10px">
        <span>{{ titleName }}</span>
      </div>
      <el-form  v-model = "formData" style = "text-align: left;margin-left: 50px" ref = "dataForm">
        <!--prop:表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的-->
        <el-form-item class = "formItem" label = "上游名称" :label-width = "formLabelWidth" prop = "name">
          <!--autocomplete是否让浏览器自动记录之前输入的值-->
          <el-input style = "width: 550px;" v-model = "formData.name" autocomplete = "off" placeholder = "请输入上游名称..."></el-input>
          <br/><span>上游服务器的主机名，必须与对应服务的主机名相同；<br/>不支持中文，特殊字符仅支持'., -, _, ~'</span>
        </el-form-item>
        <el-form-item class = "formItem" label = "哈希输入" :label-width = "formLabelWidth" prop = "hash_on">
          <!--          <el-input v-model = "formData.protocol" autocomplete = "off"></el-input>-->
          <el-radio-group v-model="formData.hash_on">
            <el-radio :label="'none'">none</el-radio>
            <el-radio :label="'consumer'">consumer</el-radio>
            <el-radio :label="'ip'">ip</el-radio>
            <el-radio :label="'header'">header</el-radio>
            <el-radio :label="'cookie'">cookie</el-radio>
          </el-radio-group>
          <br/><span>开启哈希算法，可将"none"，"consumer"，"ip"，"header"，"cookie"作为哈希输入值。<br/>默认为none，即不使用哈希算法而用加权轮询方案</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "哈希输入（备选项）" :label-width = "formLabelWidth" prop = "hash_fallback">
          <el-radio-group v-model="formData.hash_fallback">
            <el-radio :label="'none'">none</el-radio>
            <el-radio :label="'consumer'">consumer</el-radio>
            <el-radio :label="'ip'">ip</el-radio>
            <el-radio :label="'header'">header</el-radio>
<!--            <el-radio :label="'cookie'">cookie</el-radio>-->
          </el-radio-group>
          <br/><span>如果"哈希输入"字段不返回哈希值（例如，标头丢失或未标识消费者），则将此字段用作哈希输入的内容；<br/>
                只有"哈希输入"字段不为none前提下才可以使用此字段；<br/>
                如果"哈希输入"字段设置为cookie则此字段不可用。默认为none</span>
        </el-form-item>

        <el-form-item class = "formItem" v-if="formData.hash_on=='header'" label = "头部信息哈希" :label-width = "formLabelWidth" prop = "hash_on_header">
          <el-input style = "width: 550px;" v-model = "formData.hash_on_header" autocomplete = "off"></el-input>
          <br/><span>使用指定的header头部作为哈希输入，仅当"哈希输入"设置为"header"时才需要设置此字段。</span>
        </el-form-item>

        <el-form-item class = "formItem" v-if="formData.hash_fallback=='header'" label = "头部信息哈希（备选项）" :label-width = "formLabelWidth" prop = "hash_fallback">
          <el-input style = "width: 550px;" v-model = "formData.hash_fallback_header" autocomplete = "off"></el-input>
          <br/><span>使用指定的header头部作为哈希输入，仅当"哈希输入（备选项）"设置为"header"时才需要设置此字段。</span>
        </el-form-item>

        <el-form-item class = "formItem" v-if="formData.hash_on==='cookie'||formData.hash_fallback==='cookie'" label = "cookie哈希" :label-width = "formLabelWidth" prop = "hash_on_cookie">
        <el-input style = "width: 550px;" v-model = "formData.hash_on_cookie" autocomplete = "off"></el-input>
        <br/><span>获取到用户请求的cookie名称作为哈希输入，仅在"哈希输入"或"哈希输入（备选项）"设置为"cookie"时<br/>需要设置此字段。
          如果请求中没有指定的cookie，则Kong将生成一个值并在响应中设置cookie。</span>
      </el-form-item>

        <el-form-item class = "formItem" v-if="formData.hash_on==='cookie'||formData.hash_fallback==='cookie'" label = "cookie路径" :label-width = "formLabelWidth" prop = "hash_on_cookie_path">
          <el-input style = "width: 550px;" v-model = "formData.hash_on_cookie_path" autocomplete = "off"></el-input>
          <br/><span>Kong在响应头中设置的cookie路径,仅在"哈希输入"或"哈希输入（备选项）"设置为"cookie"时需要设置<br/>此字段，默认为"/"。
            以"/"开头，不允许出现"//"</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "插槽" :label-width = "formLabelWidth" prop = "slots">
          <!--          <el-input v-model = "formData.connect_timeout" autocomplete = "off"></el-input>-->
          <el-input-number v-model = "formData.slots" :min="10" :max="65536" controls-position = "right" style = "width: 120px;"></el-input-number>
          <span>负载均衡器算法中的插槽数（10- 65536）。默认为1000。</span>
        </el-form-item>

        <el-divider></el-divider>
        <p style="margin-bottom: 20px;font-size: 22px;font-weight: bold">主动健康检查</p>

        <el-form-item class = "formItem" label = "是否检查SSL证书" :label-width = "formLabelWidth" prop = "healthchecks.active.https_verify_certificate">
          <el-switch v-model = "formData.healthchecks.active.https_verify_certificate" active-color = "#13ce66" inactive-color = "#ff4949" active-text = "true" inactive-text = "false">
          </el-switch>
          <br/><span>使用HTTPS方式进行主动健康检查时是否检查远程主机的SSL证书的有效性。默认为true。</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "不健康时HTTP状态数组" :label-width = "formLabelWidth" prop = "healthchecks.active.unhealthy.http_statuses">
          <el-input style = "width: 550px;" v-model = "healthchecksActiveUnhealthyHttpStatuses" autocomplete = "off"></el-input>
          <br/><span>当进行主动健康检查的探针返回输入框中的HTTP状态数组时，表明终端状态不健康。<br/>默认为[429, 404, 500, 501, 502, 503, 504, 505]。</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "不健康时TCP失败次数" :label-width = "formLabelWidth" prop = "healthchecks.active.unhealthy.tcp_failures">
          <!--          <el-input v-model = "formData.connect_timeout" autocomplete = "off"></el-input>-->
          <el-input-number v-model = "formData.healthchecks.active.unhealthy.tcp_failures" :min="0" controls-position = "right" style = "width: 120px;"></el-input-number>
          <span>以TCP方式进行主动健康检查的探针中认为连接终端（服务器）不健康的失败次数。默认为0。</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "不健康时超时次数" :label-width = "formLabelWidth" prop = "healthchecks.active.unhealthy.timeouts">
          <!--          <el-input v-model = "formData.connect_timeout" autocomplete = "off"></el-input>-->
          <el-input-number v-model = "formData.healthchecks.active.unhealthy.timeouts" :min="0" controls-position = "right" style = "width: 120px;"></el-input-number>
          <span>设置主动健康检查中探针的超时次数，则认为连接终端不健康，默认为0</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "不健康时HTTP失败次数" :label-width = "formLabelWidth" prop = "healthchecks.active.unhealthy.http_failures">
          <!--          <el-input v-model = "formData.connect_timeout" autocomplete = "off"></el-input>-->
          <el-input-number v-model = "formData.healthchecks.active.unhealthy.http_failures" :min="0" controls-position = "right" style = "width: 120px;"></el-input-number>
          <span>以HTTP方式进行主动健康检查的探针中认为连接终端不健康的失败次数。默认为0。</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "不健康终端的检查间隔" :label-width = "formLabelWidth" prop = "healthchecks.active.unhealthy.interval">
          <!--          <el-input v-model = "formData.connect_timeout" autocomplete = "off"></el-input>-->
          <el-input-number v-model = "formData.healthchecks.active.unhealthy.interval" :min="0" controls-position = "right" style = "width: 120px;"></el-input-number>
          <br/><span>针对不健康终端的主动健康检查之间的间隔，单位为秒。默认为0，表示针对不健康目标的主动检查不再执行。</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "HTTP路径" :label-width = "formLabelWidth" prop = "healthchecks.active.http_path">
          <el-input style = "width: 550px;" v-model = "formData.healthchecks.active.http_path" autocomplete = "off"></el-input>
          <br/><span>向终端发送HTTP GET方式请求时应当设置的路径，作为主动健康检查的探针运行，默认为"/"</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "健康检查超时时间" :label-width = "formLabelWidth" prop = "healthchecks.active.timeout">
          <!--          <el-input v-model = "formData.connect_timeout" autocomplete = "off"></el-input>-->
          <el-input-number v-model = "formData.healthchecks.active.timeout" :min="1" controls-position = "right" style = "width: 120px;"></el-input-number>
          <span>主动健康检查探针的HTTP GET请求的连接超时时间，默认为1秒</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "健康时HTTP状态数组" :label-width = "formLabelWidth" prop = "healthchecks.active.healthy.http_statuses">
          <!--          <el-input v-model = "formData.connect_timeout" autocomplete = "off"></el-input>-->
          <el-input style = "width: 550px;" v-model = "healthchecksActiveHealthyHttpStatuses" autocomplete = "off"></el-input>
          <br/><span>当进行主动健康检查的探针返回输入框中的HTTP状态数组时，表明终端状态健康。</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "主动健康检查间隔" :label-width = "formLabelWidth" prop = "healthchecks.active.healthy.interval">
          <!--          <el-input v-model = "formData.connect_timeout" autocomplete = "off"></el-input>-->
          <el-input-number v-model = "formData.healthchecks.active.healthy.interval" :min="0" controls-position = "right" style = "width: 120px;"></el-input-number>
          <br/><span>针对健康终端的主动健康检查之间的间隔，单位为秒。默认为0，表示针对健康目标的主动检查不再执行。</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "视为健康的次数" :label-width = "formLabelWidth" prop = "healthchecks.active.healthy.successes">
          <!--          <el-input v-model = "formData.connect_timeout" autocomplete = "off"></el-input>-->
          <el-input-number v-model = "formData.healthchecks.active.healthy.successes" :min="0" controls-position = "right" style = "width: 120px;"></el-input-number>
          <span>主动健康检查探针将终端视为健康的次数</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "https SNI" :label-width = "formLabelWidth" prop = "healthchecks.active.https_sni">
          <!--          <el-input v-model = "formData.connect_timeout" autocomplete = "off"></el-input>-->
          <el-input style = "width: 550px;" v-model = "formData.healthchecks.active.https_sni" autocomplete = "off"></el-input>
          <br/><span>以HTTPS方式进行主动健康检查时用作SNI（服务器名称标识）的主机名。当使用IP地址配置终端时，<br/>
            此字段非常有用，便于使用正确的SNI验证目标主机的证书。</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "同时检查的终端数" :label-width = "formLabelWidth" prop = "healthchecks.active.concurrency">
          <el-input-number v-model = "formData.healthchecks.active.concurrency" :min="0" controls-position = "right" style = "width: 120px;"></el-input-number>
          <span>主动健康检查中同时检查的终端数</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "主动健康检查的方式" :label-width = "formLabelWidth" prop = "healthchecks.active.type">
          <el-radio-group v-model="formData.healthchecks.active.type">
            <el-radio :label="'tcp'">tcp</el-radio>
            <el-radio :label="'http'">http</el-radio>
            <el-radio :label="'https'">https</el-radio>
          </el-radio-group>
          <br/><span>选择以HTTP、HTTPS或TCP连接的方式进行主动健康检查</span>
        </el-form-item>

        <el-divider></el-divider>
        <p style="margin-bottom: 20px;font-size: 22px;font-weight: bold">被动健康检查</p>
        <!--被动健康检查-->
        <el-form-item class = "formItem" label = "不健康时HTTP失败次数" :label-width = "formLabelWidth" prop = "healthchecks.passive.unhealthy.http_failures">
          <!--          <el-input v-model = "formData.connect_timeout" autocomplete = "off"></el-input>-->
          <el-input-number v-model = "formData.healthchecks.passive.unhealthy.http_failures" :min="0" controls-position = "right" style = "width: 120px;"></el-input-number>
          <span>以HTTP方式进行被动健康检查的代理流量中认为连接终端不健康的失败次数。默认为0。</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "不健康时HTTP状态数组" :label-width = "formLabelWidth" prop = "healthchecks.passive.unhealthy.http_statuses">
          <el-input style = "width: 550px;" v-model = "healthchecksPassiveUnHealthyHttpStatuses"  autocomplete = "off"></el-input>
          <br/><span>当进行被动健康检查的代理流量返回输入框中的HTTP状态数组时，表明终端状态不健康。</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "不健康时TCP失败次数" :label-width = "formLabelWidth" prop = "healthchecks.passive.unhealthy.tcp_failures">
          <!--          <el-input v-model = "formData.connect_timeout" autocomplete = "off"></el-input>-->
          <el-input-number v-model = "formData.healthchecks.passive.unhealthy.tcp_failures" :min="0" controls-position = "right" style = "width: 120px;"></el-input-number>
          <span>以TCP方式进行被动健康检查的代理流量中认为连接终端（服务器）不健康的失败次数。默认为0。</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "不健康时超时次数" :label-width = "formLabelWidth" prop = "healthchecks.passive.unhealthy.timeouts">
          <!--          <el-input v-model = "formData.connect_timeout" autocomplete = "off"></el-input>-->
          <el-input-number v-model = "formData.healthchecks.passive.unhealthy.timeouts" :min="0" controls-position = "right" style = "width: 120px;"></el-input-number>
          <span>设置被动健康检查中代理流量的超时次数，则认为连接终端不健康，默认为0</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "被动健康检查的方式" :label-width = "formLabelWidth" prop = "healthchecks.passive.type">
          <el-radio-group v-model="formData.healthchecks.passive.type">
            <el-radio :label="'tcp'">tcp</el-radio>
            <el-radio :label="'http'">http</el-radio>
            <el-radio :label="'https'">https</el-radio>
          </el-radio-group>
          <br/><span>选择以HTTP、HTTPS或TCP连接的方式进行被动健康检查</span>
        </el-form-item>

        <el-form-item class="formItem" label="视为健康的次数" :label-width = "formLabelWidth" prop = "healthchecks.passive.healthy.successes">
          <!--          <el-input v-model = "formData.connect_timeout" autocomplete = "off"></el-input>-->
          <el-input-number v-model = "formData.healthchecks.passive.healthy.successes" :min="0" controls-position = "right" style = "width: 120px;"></el-input-number>
          <span>被动健康检查的代理流量将终端视为健康的次数，默认为0</span>
        </el-form-item>

        <el-form-item class = "formItem" label = "健康时HTTP状态数组" :label-width = "formLabelWidth" prop = "healthchecks.passive.healthy.http_statuses">
          <el-input style = "width: 550px;" v-model = "healthchecksPassiveHealthyHttpStatuses" autocomplete = "off"></el-input>
          <br/><span>当进行被动健康检查的代理流量返回输入框中的HTTP状态数组时，表明终端状态健康。</span>
        </el-form-item>
      </el-form>
      <div slot = "footer" class = "dialog-footer">
        <el-button @click = "dialogFormVisble = false">取 消</el-button>
        <el-button type = "primary" @click = "saveUpstream">确 定</el-button> <!--@click = "onSubmit"-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'AddUpstream',
    inject: ['reload'],
    data () {
      return {
        titleName: '添加上游',
        dialogFormVisble: false,
        center: true,
        formData: {
          name: '',
          hash_on: 'none',
          hash_fallback: 'none',
          hash_on_header: '',
          hash_fallback_header: '',
          hash_on_cookie: '',
          hash_on_cookie_path: '/',
          slots: 1000,
          healthchecks: {
            active: {
              https_verify_certificate: true,
              unhealthy: {
                http_statuses: [429, 404, 500, 501, 502, 503, 504, 505],
                tcp_failures: 0,
                timeouts: 0,
                http_failures: 0,
                interval: 0
              },
              http_path: '/',
              timeout: 1,
              healthy: {
                http_statuses: [200, 302],
                interval: 0,
                successes: 0
              },
              https_sni: '',
              concurrency: 10,
              type: 'http'
            },
            passive: {
              unhealthy: {
                http_failures: 0,
                http_statuses: [429, 500, 503],
                tcp_failures: 0,
                timeouts: 0
              },
              type: 'http',
              healthy: {
                successes: 0,
                http_statuses: [200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 300, 301, 302, 303, 304, 305, 306, 307, 308]
              }
            }
          }
        },
        upstreamNames: [],
        upstreamId: '',
        formLabelWidth: '180px'
      }
    },
    computed: {
      healthchecksActiveUnhealthyHttpStatuses: {
        get: function () {
          return this.formData.healthchecks.active.unhealthy.http_statuses.join(',')
        },
        set: function (newValue) {
          if (newValue) {
            this.formData.healthchecks.active.unhealthy.http_statuses = newValue.split(',').map((val) => { return parseInt(val) }).filter(val => !isNaN(val))
          } else {
            this.formData.healthchecks.active.unhealthy.http_statuses = []
          }
        }
      },
      healthchecksActiveHealthyHttpStatuses: {
        get: function () {
          return this.formData.healthchecks.active.healthy.http_statuses.join(',')
        },
        set: function (newValue) {
          if (newValue) {
            this.formData.healthchecks.active.healthy.http_statuses = newValue.split(',').map((val) => { return parseInt(val) }).filter(val => !isNaN(val))
          } else {
            this.formData.healthchecks.active.healthy.http_statuses = []
          }
        }
      },
      healthchecksPassiveUnHealthyHttpStatuses: {
        get: function () {
          return this.formData.healthchecks.passive.unhealthy.http_statuses.join(',')
        },
        set: function (newValue) {
          if (newValue) {
            this.formData.healthchecks.passive.unhealthy.http_statuses = newValue.split(',').map((val) => { return parseInt(val) }).filter(val => !isNaN(val))
          } else {
            this.formData.healthchecks.passive.unhealthy.http_statuses = []
          }
        }
      },
      healthchecksPassiveHealthyHttpStatuses: {
        get: function () {
          return this.formData.healthchecks.passive.healthy.http_statuses.join(',')
        },
        set: function (newValue) {
          if (newValue) {
            this.formData.healthchecks.passive.healthy.http_statuses = newValue.split(',').map((val) => { return parseInt(val) }).filter(val => !isNaN(val))
          } else {
            this.formData.healthchecks.passive.healthy.http_statuses = []
          }
        }
      },
    },
    mounted () {
    },
    methods: {
      clear () {
        this.formData = {
          name: '',
          hash_on: 'none',
          hash_fallback: 'none',
          hash_on_header: '',
          hash_fallback_header: '',
          hash_on_cookie: '',
          hash_on_cookie_path: '/',
          slots: 1000,
          healthchecks: {
            active: {
              https_verify_certificate: true,
              unhealthy: {
                http_statuses: [429, 404, 500, 501, 502, 503, 504, 505],
                tcp_failures: 0,
                timeouts: 0,
                http_failures: 0,
                interval: 0
              },
              http_path: '/',
              timeout: 1,
              healthy: {
                http_statuses: [200, 302],
                interval: 0,
                successes: 0
              },
              https_sni: '',
              concurrency: 10,
              type: 'http'
            },
            passive: {
              unhealthy: {
                http_failures: 0,
                http_statuses: [429, 500, 503],
                tcp_failures: 0,
                timeouts: 0
              },
              type: 'http',
              healthy: {
                successes: 0,
                http_statuses: [200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 300, 301, 302, 303, 304, 305, 306, 307, 308]
              }
            }
          }
        }
      },
      saveUpstream () {
        let _this = this
        if (this.formData.name === '') {
          this.formData.name = null
        }
        if (this.formData.hash_on_header === '') {
          this.formData.hash_on_header = null
        }
        if (this.formData.hash_fallback_header === '') {
          this.formData.hash_fallback_header = null
        }
        if (this.formData.hash_on_cookie === '') {
          this.formData.hash_on_cookie = null
        }
        if (this.formData.healthchecks.active.https_sni === '') {
          this.formData.healthchecks.active.https_sni = null
        }

        if (this.titleName === '添加上游') {
          this.$axios.post(localStorage.address + '/upstreams/', this.formData)
            .then((response) => {
              _this.reload()
              console.log(response)
            })
            .catch(error => {
              let errorCode = error.response.status
              console.log(error.response)
              if (errorCode === 409) {
                this.$Message.error('上游名称重复，请重新填写')
              } else if (errorCode === 400 & error.response.data.fields.name === 'required field missing' | error.response.data.fields.name === 'Invalid name; must be a valid hostname') {
                this.$Message.error('主机名不能为空，不允许出现中文字符、纯数字')
              } else if (errorCode === 400 && error.response.data.fields.hash_fallback && error.response.data.fields.hash_on_cookie) {
                this.$Message.error('当"哈希输入"字段为cookie时"哈希输入(备选项)"字段必须为none')
              } else if (errorCode === 400 && error.response.data.fields.hash_fallback === 'expected one of: none') {
                this.$Message.error('只有"哈希输入"字段不为none前提下才可以使用"哈希输入(备选项)"字段')
              } else if (errorCode === 400 && error.response.data.fields.hash_on_cookie) {
                this.$Message.error('cookie哈希字段未填写')
              } else if (errorCode === 400 && error.response.data.fields.hash_on_header) {
                this.$Message.error("'头部信息哈希'字段未填写")
              } else if (errorCode === 400 && error.response.data.fields.hash_fallback_header) {
                this.$Message.error("'头部信息哈希(备选项)'字段未填写'")
              } else if (errorCode === 400 && error.response.data.fields.hash_fallback_header) {
                this.$Message.error("'头部信息哈希(备选项)'字段未填写'")
              } else {
                this.$Message.error(error.response.data.message)
              }
            })
        } else {
          // console.log(this.upstreamId)
          let upstreamId = _this.upstreamId
          this.$axios.patch(localStorage.address + '/upstreams/' + upstreamId, this.formData)
            .then((response) => {
              if (response && response.status === 200) {
                _this.reload()
              }
              // console.log(response)
            })
            .catch(error => {
              let errorCode = error.response.status
              console.log(error.response)
              if (errorCode === 409) {
                this.$Message.error('上游名称重复，请重新填写')
              } else if (errorCode === 400 & error.response.data.fields.name === 'required field missing' | error.response.data.fields.name === 'Invalid name; must be a valid hostname') {
                this.$Message.error('主机名不能为空，不允许出现中文字符、纯数字')
              } else if (errorCode === 400 && error.response.data.fields.hash_fallback && error.response.data.fields.hash_on_cookie) {
                this.$Message.error('当"哈希输入"字段为cookie时"哈希输入(备选项)"字段必须为none')
              } else if (errorCode === 400 && error.response.data.fields.hash_fallback === 'expected one of: none') {
                this.$Message.error('只有"哈希输入"字段不为none前提下才可以使用"哈希输入(备选项)"字段')
              } else if (errorCode === 400 && error.response.data.fields.hash_on_cookie) {
                this.$Message.error('cookie哈希字段未填写')
              } else if (errorCode === 400 && error.response.data.fields.hash_on_header) {
                this.$Message.error("'头部信息哈希'字段未填写")
              } else if (errorCode === 400 && error.response.data.fields.hash_fallback_header) {
                this.$Message.error("'头部信息哈希(备选项)'字段未填写'")
              } else if (errorCode === 400 && error.response.data.fields.hash_fallback_header) {
                this.$Message.error("'头部信息哈希(备选项)'字段未填写'")
              } else {
                this.$Message.error(error.response.data.message)
              }
            })
        }
      }
      // addSource () {
      //   if (this.formData.sources === null) {
      //     this.formData.sources = []
      //   }
      //   this.formData.sources.push({ip: '', port: ''})
      // },
      // addDestination () {
      //   if (this.formData.destinations === null) {
      //     this.formData.destinations = []
      //   }
      //   this.formData.destinations.push({ip: '', port: ''})
      // }
    }
  }
</script>

<style scoped>
  .formItem {
    bottom: 14px;
  }
</style>
