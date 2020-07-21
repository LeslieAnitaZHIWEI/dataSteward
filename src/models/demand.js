import { getDetail,getCategory } from '@/services/demand';
const demandModel = {
  namespace: 'demand',
  state: {
    demandDetail: {},
    dstagcategory:[],
    selectedTags:[],
    tagRowNum:0,
    areaString:'',
    keywordList:'',
    demandSaveOrUpdateDTO:{},
    tagInfo:'近30天',
    keywordNum:0
  },
  effects: {
      *getDetail({ payload }, { call, put, select }){
        console.log(payload,'获取detail')
        const response = yield call(getDetail,{id:payload});
        console.log(response,'获取detail')
        yield put({
            type: 'saveDemand',
            payload: response.data,
          });
      },
      *getCategory({ payload }, { call, put, select }){
        const response = yield call(getCategory,{});
        console.log(response,'获取标签')
        yield put({
            type: 'setCategory',
            payload: response.data,
          });

      }

},
reducers: {
  saveDemand(state, action) {
    console.log(action,'response')

    return { ...state, demandDetail: action.payload || {} };
  },
  setSelectedTags(state,action){
    console.log(action,state,'sssss')
    const {payload}=action
    const {selectedTags}=state
    var idArr=[]
    let allArr=[
      ...payload,
      ...selectedTags
    ]
    var newArr=[]
    allArr.forEach(ele=>{
      if(idArr.indexOf(ele.id)==-1){
        idArr.push(ele.id)
        newArr.push(ele)
      }
    })
    let tagRowNum=0
    newArr.forEach((ant,index)=>{
      if(ant.tag=='地理位置'){
        newArr[index].tagName =' : \n包含'+state.areaString

      }else if(ant.tag=='产品关键词'){
        newArr[index].tagName =' : '+state.keywordList.split('\n').join(' ')
        newArr[index].tagInfo=state.tagInfo
        newArr[index].predictNum=state.keywordNum
      }else if(ant.categoryId==0){
        ant.tagName='(自定义标签)'
      }
      else
      {
        newArr[index].tagName =ant.tag

      }
      tagRowNum+=ant.predictNum

    })
    return { ...state, 
      selectedTags:newArr,
      tagRowNum
    }

  },
  deleteSelectTag(state,action){
    var arr=state.selectedTags.filter(item=>{return item.tag!=action.payload.tag})
    let tagRowNum=0
    arr.forEach(ant=>{
      tagRowNum+=ant.predictNum
    })
    return { ...state, 
      selectedTags:arr,
      tagRowNum
    }
  },
  deleteAll(state,action){
    return {
      ...state,
      selectedTags:[],
      tagRowNum:0
    }
  },
  setCategory(state,action){
    return {
      ...state,
      dstagcategory: action.payload || {}
    }
  },
  setAreaString(state,action){
    console.log(action,'设置setAreaString')
    return {
      ...state,
      areaString:action.payload||''
    }
  },
  setKeywordList(state,action){
    return {
      ...state,
      keywordList:action.payload||''
    }
  },
  setKeywordNum(state,action){
    return {
      ...state,
      keywordNum:action.payload||''
    }
  },
  setDemandSaveOrUpdateDTO(state,action){
    console.log(action)
    return {
      ...state,
      demandSaveOrUpdateDTO:action.payload||''
    }
  },
  settagInfo(state,action){
    return {
      ...state,
      tagInfo:action.payload||''
    }
  }
},
};
export default demandModel;