import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { fakeAccountLogin,loginByUsername, getFakeCaptcha } from '@/services/login';
import { queryCurrent, query as queryUsers } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery,encryption } from '@/utils/utils';
import {getMenu} from '@/services/menu'
import { message } from 'antd';
const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    token:null,
  },
  effects: {
    *login({ payload }, { call, put }) {
      console.log(payload)
      const user = encryption({
        data: payload,
        key: 'pamirpamirpamirp',
        param: ['password']
      });
      const response = yield call(loginByUsername, user);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully
      console.log(response,'res')
      if(response.status==428){
        message.warning('请重新校验（验证码、用户名、密码错误）')
      }
      yield put({
        type:'changeToken',
        payload:response.access_token
      })
     
      localStorage.setItem("ggToken",response.access_token)
      console.log(response,'response')
      if (response.username) {
       
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        console.log(redirect)

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        const userInfo = yield call(queryCurrent);
      yield put({
        type: 'user/saveCurrentUser',
        payload: userInfo.data.sysUser,
      });
        var menu=yield call(getMenu,{})
        yield put({
          type:'menu/changeMenu',
          payload:menu
        })
        var indexJudge=false
        menu.data.forEach(element => {
            if(element.name=="首页"){
              indexJudge=true
            }
        })
        console.log(indexJudge,'indexJudgeindexJudgeindexJudgeindexJudge')
        if(indexJudge){
          // yield put(routerRedux.replace(redirect || '/'));
          yield put(routerRedux.replace('/welcome'));

        }else{
          console.log('执行跳转了吗?')
          yield put(routerRedux.replace('/adjustManage'));

        }
        
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      const { redirect } = getPageQuery(); // redirect

      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            // search: stringify({
            //   redirect: window.location.href,
            // }),
          }),
        );
      }
    },
    *detection({payload},{put}){
      yield put({
        type:"getToken",
        payload:window.localStorage.getItem("ggToken")
      })
    }
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority('admin');
      // setAuthority(payload.currentAuthority);
      // return { ...state, status: payload.status, type: payload.type };
      return { ...state, status:'ok', type: payload.type };
    },
    changeToken(state,{payload}){
      console.log(payload,'payload')
      window.localStorage.setItem("ggToken",payload)
      return {... state,token:payload}
    },
   
    getToken(state,{payload}){
      if(payload){
        return {...state,token:payload}
      }
    }
  },
};
export default Model;
