<template>
  <div>
    <el-container>
      <el-aside width="12.5%"></el-aside>
      <el-main>
        <add-certificate ref="addCertificate"></add-certificate>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px">
          <el-breadcrumb-item :to="{ path: '/info' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/certificates' }">证书列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
          <el-col :span="12"><div></div></el-col>
          <el-col :span="12"><div style="text-align:right;position: absolute;bottom: -5px;right: 0px">
            <el-button size="small" @click="addCertificate" type="primary">添加证书</el-button>
          </div></el-col>
        </el-row>
        <el-row>
          <el-table
            style="width: 100%;margin-top: 10px"
            :data="certificates.slice((currentPage-1)*pageSize,currentPage*pageSize)">
            <el-table-column
              prop="id"
              label="id">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="snis"
              label="SNIS">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.snis }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="创建时间">
              <template slot-scope="scope">
                <span style="margin-left: 0px">{{ scope.row.createAtStr }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="operation"
              label="操作">
              <template slot-scope="scope">
                <span style="margin-left: 0px">
                  <!--"-->
                  <el-button size="small" @click="editCertificate(scope.$index,scope.row.id)" type="primary">查看</el-button>
                  <el-button size="small" @click="deleteDialog(scope.$index,scope.row.id)" type="danger">删除</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :pager-count="5"
          :total="certificates.length">
        </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  // 时间格式化工具
  import moment from 'moment'
  import AddCertificate from './AddCertificate'
  export default {
    name: 'CertificatesList',
    inject: ['reload'],
    components: {AddCertificate},
    data () {
      return {
        loading: true,
        currentPage: 1,
        pageSize: 6,
        certificates: [],
        offset: '',
        offsetStack: [],
        isFlag: true
      }
    },
    created () {
      if (!localStorage.cerCurrentPage) {
        localStorage.setItem('cerCurrentPage', this.currentPage)
      }
      // 如果为firstIndex为1，则讲页数置为1，否则页数为本地缓存的页数
      if (this.$store.state.cerFirstIndex === 1) {
        this.currentPage = 1
      } else {
        this.currentPage = parseInt(localStorage.cerCurrentPage)
      }
    },
    mounted () {
      // console.log(this.$route.params.upstreamId)
      this.loadCertificates()
    },
    methods: {
      sortKey (array, key) {
        return array.sort(function (a, b) {
          var x = a[key]
          var y = b[key]
          return x > y ? -1 : x < y ? 1 : 0
        });
      },
      loadCertificates (offset) {
        let url
        if (offset) {
          url = localStorage.address + '/certificates?offset=' + offset + '&size = 10'
        } else {
          url = localStorage.address + '/certificates'
          this.offsetStack = []
          this.offset = ''
        }
        this.$axios.get(url)
          .then((response) => {
            // console.log(response.data.data)
            this.certificates = response.data.data
            this.certificates = this.sortKey(this.certificates, 'created_at')
            // console.log(this.certificates)
              this.certificates.map(function (certificate) {
                let createDate = moment.unix(certificate.created_at)
                certificate.createAtStr = createDate.format('YYYY-MM-DD HH:mm:ss')
              })
          })
          .catch((error) => {
            if (error.response === undefined) {
              this.$Message.error('无法连接KONG网关~')
            } else {
              this.$Message.error(error.response.message)
            }
          })
      },
      editCertificate (index, certificateId) {
        this.$refs.addCertificate.titleName = '修改证书'
        this.$refs.addCertificate.certificateId = certificateId
        this.getCertificate(certificateId)
        this.$refs.addCertificate.dialogFormVisble = true
      },
      getCertificate (certificateId) {
        let _this = this
        this.$axios.get(localStorage.address + '/certificates/' + certificateId)
          .then((response) => {
            // console.log(response.data)
            this.$refs.addCertificate.formData = response.data
          })
      },
      handleCurrentChange: function (currentPage) {
        if (currentPage !== 1) {
          this.$store.commit('saveCerFirstIndex', 0)
        }
        this.currentPage = currentPage
        localStorage.cerCurrentPage = currentPage
        // console.log(this.currentPage)
      },
      addCertificate () {
        this.$refs.addCertificate.titleName = '添加证书'
        this.$refs.addCertificate.dialogFormVisble = true
      },
      deleteDialog (index, certificateId) {
        let _this = this
        this.$confirm('是否删除id为【' + certificateId + '】的证书？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios.delete(localStorage.address + '/certificates/' + certificateId)
            .then((response) => {
              if (response && response.status === 204) {
                this.$Message.success('id为【' + certificateId + '】的证书已删除')
                this.loadCertificates()
              }
            })
            .catch((error) => {
              // console.log(error.response)
              this.$Message.error(error.response.data.message)
            })
        }).catch(() => {
          this.$Message.info('已取消删除')
        })
      }
    }
  }
</script>

<style scoped>

</style>
