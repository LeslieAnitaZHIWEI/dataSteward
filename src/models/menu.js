import {getMenu} from '@/services/menu'
const Model = {
    namespace: 'menu',
    state: {
      menu:[]
    },
    effects: {
        *menu({ payload }, { call, put }) {
            const menu=yield call(getMenu,{})
        yield put({
          type:'changeMenu',
          payload:menu
        })
        }
    },
    reducers: {
        changeMenu(state,{payload}){
            var indexS=-1
            let menu=payload.data.map ((item,index)=>{
                if(item.name=="首页"){
                    indexS=index
                }
                if(item.path=='/welcome'||item.path=='/demandManage'||item.path=='/adjustManage'||item.path=='/chooseTag'||item.path=='/messageManage'){
                    return {
                  path:item.path,
                  name:item.name,
                  icon:item.icon
                }
                }
               
            })
            if(indexS!=-1){
                var m=menu.splice(indexS,1)
                menu.unshift(m[0])
            }
            return {...state,menu:menu}
          },
    }


}
export default Model;
