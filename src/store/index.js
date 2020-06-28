import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 存储kong节点admin地址
    address: window.localStorage.getItem('address' || '[]') == null ? '' : window.localStorage.getItem('address' || '[]'),
    // 存储Service细节的服务名称传递
    serviceName: '',
    serFirstIndex: 0,
    rouFirstIndex: 0,
    conFirstIndex: 0,
    upFirstIndex: 0,
    tarFirstIndex: 0,
    cerFirstIndex: 0,
    pluFirstIndex: 0,
    isAdd: true,
    isLogin: true,
    isLoad: false,
    selectedVal: '',
    logFirstIndex: 0
    // serviceId: ''
    // addOrEdit: 'add'
  },
  mutations: {
    // login (state, user) {
    //   state.user = user
    //   window.localStorage.setItem('user', JSON.stringify(user))
    // }
    saveAdmin (state, address) {
      state.address = address
      // window.localStorage.setItem('address', address)
    },
    saveServiceName (state, serviceName) {
      state.serviceName = serviceName
    },
    saveServiceId (state, serviceId) {
      state.serviceId = serviceId
    },
    // saveaddOrEdit (state, addOrEdit) {
    //   state.addOrEdit = addOrEdit
    // // }
    saveSerFirstIndex (state, serFirstIndex) {
      state.serFirstIndex = serFirstIndex
    },
    saveRouFirstIndex (state, rouFirstIndex) {
      state.rouFirstIndex = rouFirstIndex
    },
    saveConFirstIndex (state, conFirstIndex) {
      state.conFirstIndex = conFirstIndex
    },
    saveUpFirstIndex (state, upFirstIndex) {
      state.upFirstIndex = upFirstIndex
    },
    saveTarFirstIndex (state, tarFirstIndex) {
      state.tarFirstIndex = tarFirstIndex
    },
    saveCerFirstIndex (state, cerFirstIndex) {
      state.cerFirstIndex = cerFirstIndex
    },
    savePluFirstIndex (state, pluFirstIndex) {
      state.pluFirstIndex = pluFirstIndex
    },
    saveIsAdd (state, isAdd) {
      state.isAdd = isAdd
    },
    saveIsLogin (state, isLogin) {
      state.isLogin = isLogin
    },
    saveIsLoad (state, isLoad) {
      state.isLoad = isLoad
    },
    saveSelectedVal (state, selectedVal) {
      state.selectedVal = selectedVal
    },
    saveLogFirstIndex (state, logFirstIndex) {
      state.logFirstIndex = logFirstIndex
    }
  }
})
