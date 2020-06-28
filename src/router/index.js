import Vue from 'vue'
import Router from 'vue-router'
import Config from '../components/Config'
// import AppIndex from '../components/AppIndex'
import Home from '../components/Home'
// import BasicInfo from '../components/BasicInfo'

import ServicesList from '../components/services/ServicesList'
import ServiceDetail from '../components/services/ServiceDetail'
import RoutesList from '../components/routes/RoutesList'
import AddRoute from '../components/routes/AddRoute'
import ConsumersList from '../components/consumers/ConsumersList'
import ConsumersEdit from '../components/consumers/ConsumersEdit'
import UpstreamsList from '../components/upstreams/UpstreamsList'
import TargetTable from '../components/upstreams/TargetTable'
import CertificatesList from '../components/certificates/CertificatesList'
import PluginsList from '../components/plugins/PluginsList'
import RoutePluginTable from '../components/routes/RoutePluginTable'
import AddPlugin from '../components/plugins/AddPlugin'
import ConnectionLine from '../components/dashboard/ConnectionLine'
import ConnectionDiv from '../components/dashboard/ConnectionDiv'
import NodeInfo from '../components/dashboard/NodeInfo'
import DataStoreInfo from '../components/dashboard/DataStoreInfo'
import EnabledPlugin from '../components/dashboard/EnabledPlugin'
import Dashboard from '../components/dashboard/Dashboard'
// import ServerInfo from '../components/dashboard/ServerInfo'
import ServerInfo1 from '../components/dashboard/ServerInfo1'
import KongInfo from '../components/dashboard/KongInfo'
import LogInfo from '../components/dashboard/LogInfo'

Vue.use(Router)

// Vue router报错："NavigationDuplicated"}的解决方法
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: '/config',
      children: [
        // {
        //   path: '/info',
        //   name: 'basicInfo',
        //   component: BasicInfo,
        //   meta: {
        //     requireAuth: true
        //   }
        // },
        {
          path: '/info',
          name: 'basicInfo',
          component: KongInfo,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/serverInfo',
          name: 'serverInfo',
          component: ServerInfo1,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/logInfo',
          name: 'logInfo',
          component: LogInfo,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/services',
          name: 'servicesList',
          component: ServicesList,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'services/:id',
          name: 'serviceDetail',
          component: ServiceDetail,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/routes',
          name: 'routesList',
          component: RoutesList,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/routes/add',
          name: 'addRoute',
          component: AddRoute,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/consumers',
          name: 'consumersList',
          component: ConsumersList,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/consumers/edit/:consumerId',
          name: 'consumersEdit',
          component: ConsumersEdit,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/upstreams',
          name: 'upstreamsList',
          component: UpstreamsList,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/targets/:upstreamId',
          name: 'targetTable',
          component: TargetTable,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/certificates',
          name: 'certificatesList',
          component: CertificatesList,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/plugins',
          name: 'pluginsList',
          component: PluginsList,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/plugins/add',
          name: 'addPlugin',
          component: AddPlugin,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/plugins/:routeId',
          name: 'routePluginTable',
          component: RoutePluginTable,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/plugins/edit/:pluginId',
          component: AddPlugin,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/plugins/add/service/:idService',
          component: AddPlugin,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/plugins/add/consumer/:idConsumer',
          component: AddPlugin,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/plugins/add/route/:idRoute',
          component: AddPlugin,
          meta: {
            requireAuth: true
          }
        },
        // {
        //   path: '/chart',
        //   component: ConnectionLine,
        //   meta: {
        //     requireAuth: true
        //   }
        // },
        {
          path: '/conn',
          component: ConnectionDiv,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/node',
          component: NodeInfo,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/data',
          component: DataStoreInfo,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/enable',
          component: EnabledPlugin,
          meta: {
            requireAuth: true
          }
        }
      ]
    },
    {
      path: '/config',
      name: 'Config',
      component: Config
    }
    // {
    //   path: '/',
    //   name: 'AppIndex',
    //   component: AppIndex,
    //   redirect: '/home'
    // }

  ]
})
