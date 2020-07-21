import React, { PureComponent, Suspense } from 'react';
import { getDspushmedia,customizeTag, areaPredictNum,addDsdemand, dsproductkeyword } from '@/services/demand';
import router from 'umi/router';

import {
  Table,
  TreeSelect,
  Radio,
  Layout,
  Upload,
  Row,
  Col,
  Card,
  Drawer,
  Form,
  Select,
  Modal,
  Button,
  Tree,
  Input,
  Spin,
  message
} from 'antd';
import style from './style.less';
const FormItem = Form.Item;
import { connect } from 'dva';
import { getDstag } from '@/services/demand';
const { Option } = Select;
import area from '@/utils/area';
const { TreeNode } = Tree;
const { Search, TextArea } = Input;
const x = 3;
const y = 2;
const z = 1;
const gData = [];
const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

var areaSelect = area.options.map((item, a) => {
  const newObj = {
    title: item.label,
    value: item.label,
    pinyin: item.pinyin,
    key: 0 + '-' + a,
  };
  if (item.children.length != 0) {
    newObj.children = [].concat(
      item.children.map((tag, b) => {
        return {
          title: tag.label,
          value: tag.value,
          pinyin: tag.pinyin,
          key: 0 + '-' + a + '-' + b,
        };
      }),
    );
  }
  return newObj;
});
console.log(areaSelect, 'areaSelect');
function DisplayRow(props) {
  const name = props.name;
  if (name == '地理位置') {
    return (
      <span>
        {name}包含{props.area}
      </span>
    );
  } else {
    return name;
  }
}

@connect(redux => {
  console.log(redux, 'redux');
  return {
    demandData: redux.demand.demandData,
    dstagcategory: redux.demand.dstagcategory,
    selectedTags: redux.demand.selectedTags,
    tagRowNum: redux.demand.tagRowNum,
    areaString: redux.demand.areaString,
    keywordList: redux.demand.keywordList,
    demandSaveOrUpdateDTO: redux.demand.demandSaveOrUpdateDTO
  };
})
@Form.create()
class choseTag extends PureComponent {
  constructor(props) {
    super(props);
  }
  

  componentWillMount() {
    // generateList2(test)
    // this.setState({
    //   testData:test
    // })
    console.log(this.props,'prop')
    var dataList = [];
    const { dispatch } = this.props;
    if(this.props.location.query.chooseId){
      this.setState({
        Sk:[this.props.location.query.chooseId]
      })
      this.initSelectKey(this.props.location.query.chooseId)
    }
    
    const { dstagcategory } = this.props;
    
    dispatch({
      type: 'demand/getCategory',})
    // }).then(_ => {

      this.generateList2(areaSelect, dataList);
      console.log(dataList, 'dataListdataList');
      this.setState({
        dataList: dataList,
      });
      
      console.log(dstagcategory,'dstagcategory')
     
    // });
  }
  componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return;
    };
  }
  componentDidMount() {
    const { form } = this.props;
    form.setFieldsValue({
      areaValue: undefined,
    });
    
  }
  componentDidUpdate() {
    const { dstagcategory } = this.props;
    if(!this.props.location.query.chooseId &&this.state.Sk.length==0){
       if(dstagcategory.length!=0){
         if(dstagcategory[0].children.length!=0){
           if(dstagcategory[0].children[0].children.length!=0){
             this.setState({
               Sk:[dstagcategory[0].children[0].children[0].id.toString()],
             })
             this.initSelectKey(dstagcategory[0].children[0].children[0].id.toString())
           }else{
             console.log('有吗')
             this.setState({
               Sk:[dstagcategory[0].children[0].id.toString()],
               Sk:[dstagcategory[0].children[0].id.toString()]
             })
             this.initSelectKey(dstagcategory[0].children[0].id.toString())
           }
         }else{
           this.setState({
             Sk:[dstagcategory[0].id.toString()]
           })
           this.initSelectKey(dstagcategory[0].id.toString())
         }
       }
       
     }
  }
  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    dataList: [],
    dataSource: [],
    tagVisible: false,
    areaVisible: false,

    areaValue: undefined,
    tableLoading: false,
    selectedRowKeys: [],
    projectVisible: false,
    areaObj: {},
    proObj: {},
    predictNum: 0,
    spinningLoading: false,
    keywordsOpt: [],
    keywordValue: '',
    keywordListArr: [],
    value3:'近30天',
    selectedKeys:[],
    Sk:[],
    addTagVisible:false
  };
  generateList2 = (data, list) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { title, key, parentId, value } = node;
      list.push({ key, title, parentId: parentId, value });
      if (node.children) {
        this.generateList2(node.children, list);
      }
    }
  };
  formatTypeTree(data, level = 1) {
    return data.map(item => {
      const newData = {
        key: item.id.toString(),
        title: item.name,
        projectId: item.projectId,
        parentId: item.parentId,
        level,
      };

      if (item.childList.length !== 0) {
        newData.children = this.formatTypeTree(item.childList, level + 1);
      } else {
        newData.children = [];
      }

      if (item.userTagList.length !== 0) {
        newData.children = newData.children.concat(
          item.userTagList.map(tag => {
            return {
              key: tag.id.toString(),
              title: tag.name,
              projectId: tag.projectId,
              parentId: item.id,
              /** 这里的 isLeaf 是没有子 */
              isLeaf: true,
              version: tag.version,
            };
          }),
        );
      }

      return newData;
    });
  }
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  onSelect = (cloumn, e) => {
    console.log(cloumn, e);
    this.setState({
      Sk:cloumn
    })
    if (e.selectedNodes.length != 0&&e.selectedNodes[0].props.children.length == 0  ) {
      this.setState({
        tableLoading: true,
        selectedRowKeys: [],
      });
      this.initSelectKey(cloumn.toString())
      
    }
  };
  initSelectKey=(key)=>{

    getDstag({
      categoryId: key.toString(),
    }).then(({ data }) => {
      this.setState({
        dataSource: data,
      });
      this.setState({
        tableLoading: false,
      });
      this.initTable();
    });
  }
  initTable = () => {
    const { selectedTags } = this.props;
    let arr = [];
    selectedTags.forEach(ele => {
      this.state.dataSource.forEach((item, index) => {
        if (ele.id == item.id) {
          arr.push(index);
        }
      });
    });
    this.setState({
      selectedRowKeys: arr,
    });
  };
  onSearch = e => {
    // const { value } = e.target;

    const { dstagcategory } = this.props;
    this.setState({
      tableLoading: true,
      selectedRowKeys: [],
    });
    console.log('search', e);
    getDstag({
      tag: e,
    }).then(({ data }) => {
      this.setState({
        dataSource: data,
      });
      this.setState({
        tableLoading: false,
      });
      this.initTable();
    });
    // const expandedKeys = this.state.dataList
    //   .map(item => {
    //     if (item.title.indexOf(value) > -1) {
    //       return getParentKey(item.key, dstagcategory);
    //     }
    //     return null;
    //   })
    //   .filter((item, i, self) => item && self.indexOf(item) === i);
    // this.setState({
    //   expandedKeys,
    //   searchValue: value,
    //   autoExpandParent: true,
    // });
  };
  showDrawer = name => {
    switch (name) {
      case 'area':
        this.setState({
          areaVisible: true,
        });
        break;
      case 'project':
        this.setState({
          projectVisible: true,
        });

        break;
      case 'tag':
        console.log(33);
        this.setState({
          tagVisible: true,
        });
        break;
    }
  };
  closeTag=()=>{
    this.setState({
      tagVisible: false,
    });
    this.initTable()
  }
  onClose = name => {
    const { selectedTags } = this.props;

    switch (name) {
      case 'area':
        let areaIndex = -1;
        let arr = [];
        this.state.dataSource.forEach((item, index) => {
          if (item.tag == '地理位置') {
            areaIndex = index;
          }
        });
        arr = selectedTags.filter(ele => ele != areaIndex);
        this.setState({
          areaVisible: false,
          selectedRowKeys: arr,
        });
        this.initTable()

        break;
      case 'project':
        let projectIndex = -1;
        let projectarr = [];
        this.state.dataSource.forEach((item, index) => {
          if (item.tag == '产品关键词') {
            projectIndex = index;
          }
        });
        projectarr = selectedTags.filter(ele => ele != projectIndex);
        console.log(projectarr,'消失的狗')
        this.setState({
          projectVisible: false,
          selectedRowKeys: projectarr,
          keywordListArr:[]
        });
        this.initTable()
        this.props.dispatch({
          type:'demand/setKeywordList',
          payload:''
        })
        // this.props.form.setFieldsValue({
        //   keywordList: '',
        // });
        break;
      case 'tag':
         
         var tagList=this.props.selectedTags.map(item=>{
          if(item.tag=='产品关键词'||item.tag=='地理位置'){
            
            return {
              "predictNum": item.predictNum,
        "tagInfo": item.tagInfo||'',
        "tagName": item.tag+item.tagName,
            }
            }else{
              return {
                "predictNum": item.predictNum,
          "tagInfo": item.tagInfo||'',
          "tagName": item.tagName,
              }
            }
          
        })
        var dto={
          ...this.props.demandSaveOrUpdateDTO,
          tagList
        }
        console.log(dto,'dto')
        console.log(this.props.demandSaveOrUpdateDTO,'this.props.demandSaveOrUpdateDTO')
        if(Object.keys(this.props.demandSaveOrUpdateDTO).length==0){
          router.push({ pathname: '/addDemand', add: true,tagDto:tagList });

          return false
        }
        if(dto.id){
          addDsdemand(dto).then(res => {
                if (res.code == 0) {
                  message.success('修改成功');
                  this.props.dispatch({
                    type:'demand/setDemandSaveOrUpdateDTO',
                    payload: {
                     
                    }
                  })
                  router.push({ pathname: '/demandManage', remark: 'update' });
                }
              })
        }else{
          addDsdemand(dto).then(res => {
            if (res.code == 0) {
                message.success('新增成功');
                this.props.dispatch({
                  type:'demand/setDemandSaveOrUpdateDTO',
                  payload: {
                   
                  }
                })
              router.push({ pathname: '/demandManage', remark: 'update' });
            }
          })
        }
        this.props.dispatch({
          type:'demand/deleteAll',
          payload:''
        })
        this.setState({
          tagVisible: false,
        });
        break;
    }
  };
  onSelectChange = value => {
    console.log(value);
    var arr = value;
    value.forEach((item, index) => {
      areaSelect.forEach(ele => {
        if (item == ele.title) {
          ele.children.forEach(mm => {
            arr.push(mm.value);
          });
        }
      });
    });
    arr = arr.filter(function(current) {
      return !/^[\u4e00-\u9fa5]+$/.test(current);
    });
    arr.forEach((ant, index) => {
      arr[index] = parseInt(arr[index]);
    });
    console.log(arr, 'arrValue');
    this.setState({ areaValue: arr, spinningLoading: true });
    if(arr.length==0){
      this.setState({
        predictNum: 0,
        spinningLoading: false,
      });
      return ;
    }
    areaPredictNum(arr).then(({ data }) => {
      console.log(data);

      if (data) {
        this.setState({
          predictNum: data,
          spinningLoading: false,
        });
      } else {
        this.setState({
          predictNum: 0,
          spinningLoading: false,
        });
      }
    });
  };
  deleteRow = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'demand/deleteSelectTag',
      payload: record,
    })
      
    
    // var arr=this.state.selectedRowKeys
    // console.log(arr,record)
    // arr=arr.filter(item=>item!=record.id)
    // this.setState({
    //   selectedRowKeys:arr
    // })
  };
  setArea = area => {
    const { form, dispatch } = this.props;
    const { areaValue, areaObj } = this.state;
    form.validateFields(['areaValue'], (err, values) => {
      if (!err) {
        console.log(areaValue);
        let arr = [];
        this.state.dataList.forEach(ant => [
          areaValue.forEach(hel => {
            if (ant.value == hel) {
              arr.push(ant.title);
            }
          }),
        ]);
        areaObj.predictNum=this.state.predictNum
        dispatch({
          type: 'demand/setAreaString',
          payload: arr.join('、'),
        });

        dispatch({
          type: 'demand/setSelectedTags',
          payload: [areaObj],
        });

        this.setState({
          areaVisible: false,
        });
      }
    });
  };
  setProject=()=>{
    const { form, dispatch } = this.props;
    const {  proObj } = this.state;
    
    form.validateFields(['keywordList'], (err, values) => {
      if (!err) {
        
        
        dispatch({
          type: 'demand/setSelectedTags',
          payload: [proObj],
        });

        this.setState({
          projectVisible: false,
        });
      }
    });
  }
  addKeyword = () => {
    let keyword = this.state.keywordValue;
    const { dispatch } = this.props;
    this.setState({
      keywordValue: '',
    });
    if (keyword) {
      this.state.keywordListArr.push(keyword);
      let arr = Array.from(new Set(this.state.keywordListArr));
      var keywordList = arr.join('\n');
      var num=0
      this.state.keywordsOpt.forEach(item=>{
        arr.forEach(ele=>{
          if(item.keyword==ele){
            num+=item.predictNum
          }
        })
      })
      this.setState({
        keywordListArr: arr,
      });
      // this.props.form.setFieldsValue({
      //   keywordList: keywordList,
      // });
      console.log(num,'numnum')
      dispatch({
        type: 'demand/setKeywordList',
        payload: keywordList,
      });
      dispatch({
        type: 'demand/setKeywordNum',
        payload: num,
      });
    }
  };
  onTextAreaChange=(value)=>{
    // const { dispatch } = this.props;

    // var keywordList =value
    // var keywordListArr
    // if(value){
    //   keywordListArr=value.split('\n')

    // }else{
    //   keywordListArr=[]
    // }
    // dispatch({
    //   type: 'demand/setKeywordList',
    //   payload: keywordList,
    // });
    // this.setState({
    //   keywordListArr: keywordListArr,
    // });
  }
  handleSelect = value => {
    console.log(value); // { key: "lucy", label: "Lucy (101)" }
    this.setState({
      keywordValue: value,
    });
  };
  handleSearch = value => {
    if (value) {
      this.setState({
        keywordValue: value,
      });
    } 
  };
  onChange3=value=>{
    console.log(value.target.value)
    this.setState({
      value3: value.target.value,
    });
    this.props.dispatch({
      type:"demand/settagInfo",
      payload:value.target.value
    })
  }
  showModal = () => {
    this.setState({
      addTagVisible: true,
    });
  };
  handleOk = e => {
    console.log(e);
    this.props.form.validateFields(['custom'],(err, values) => {
    //   customizeTag(
    //     {tag:values.custom}
    //   ).then(({data})=>{
    //     console.log(data)
    //     var Id
    //     this.props.dstagcategory.forEach(ele=>{
    //       if(ele.title=='自定义标签'){
    //         Id=ele.id
    //       }
    //     })
    //     this.setState({
    //       Sk:[Id.toString()]
    //     })
    //   this.initSelectKey(Id.toString())

    // message.success('添加成功');

    //   })
      
      console.log(values)
      this.props.dispatch({
        type: 'demand/setSelectedTags',
        payload: [{
          tag:values.custom+' (自定义标签)',
          predictNum:0
        }],
      });

    })
    this.setState({
      addTagVisible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      addTagVisible: false,
    });
  };
  clearProvince=()=>{
    this.props.form.setFieldsValue({
      areaValue: undefined,
    });
    this.onSelectChange([])
  }
  removeKeyword=(keyword)=>{
    console.log(keyword)
    var arr=this.state.keywordListArr
    arr=arr.filter(item=>item!=keyword)
    this.setState({
      keywordListArr:arr

    }
    )
  }
  render() {
    const { form, dstagcategory, selectedTags, tagRowNum, areaString } = this.props;
    const {
      selectedRowKeys,
      tableLoading,
      areaValue,
      dataSource,
      searchValue,
      expandedKeys,
      autoExpandParent,
      predictNum,
      spinningLoading,
      selectedKeys,
      Sk
    } = this.state;
    const columns = [
      {
        title: <b>标签</b>,
        dataIndex: 'tag',
        key: 'tag',
      },
      {
        title: <b>描述</b>,
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: <b>预估人数</b>,
        dataIndex: 'predictNum',
        key: 'predictNum',
        render: text => {
          if(text==-1){
            return ''
          }else{
            return text
          }
        },
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
      },
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        const { dispatch } = this.props;
        console.log(
          `selectedRowKeys:`,
          'selectedRows: ',
          record,
          selected,
          selectedRows,
          nativeEvent,
          window.event.clientX,
          window.event.clientY
        );
        console.log(document.getElementById('selected').getBoundingClientRect());
        if (selected) {
          const arriveX = document.getElementById('selected').getBoundingClientRect().x + 35 + 'px';
          const arriveY = document.getElementById('selected').getBoundingClientRect().y + 35 + 'px';
          var  nowX = window.event.clientX - 5 + 'px';
          var nowY = window.event.clientY - 5 + 'px';
          let ele = document.createElement('div');
          ele.className = 'redBall';
          ele.style.top = nowY;
          ele.style.left = nowX;
          document.styleSheets[0].insertRule(
            `@keyframes hor-animation {from {left: ${nowX}} to {left: ${arriveX}}}`,
            0,
          );
          document.styleSheets[0].insertRule(
            `@keyframes ver-animation {from {top: ${nowY}} to {top:  ${arriveY}}}`,
            0,
          );
          document.querySelector('.ant-card-body').appendChild(ele);
          setTimeout(function() {
            
            document.styleSheets[0].deleteRule(
              `@keyframes hor-animation {from {left: ${nowX}} to {left: ${arriveX}}}`,
              0,
            );
            document.styleSheets[0].deleteRule(
              `@keyframes ver-animation {from {top: ${nowY}} to {top:  ${arriveY}}}`,
              0,
            );
            document.querySelector('.ant-card-body').removeChild(ele);
          }, 700);
          if (record.tag == '地理位置') {
            this.setState({
              areaVisible: true,
              areaObj: record,
            });
          } else if (record.tag == '产品关键词') {
            this.setState({
              projectVisible: true,
              proObj: record,
            });
            dsproductkeyword({}).then(({ data }) => {
              console.log(data);
              this.setState({
                keywordsOpt: data,
              });
            });
          }
          else {
            selectedRows.forEach(ant=>{
              if(ant.predictNum==-1){
                ant.predictNum=null

              }
              
            })
            
            dispatch({
              type: 'demand/setSelectedTags',
              payload: selectedRows,
            });
          }
        } else {
          dispatch({
            type: 'demand/deleteSelectTag',
            payload: record,
          });
        }
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    const options = this.state.keywordsOpt.map(d => (
      <Option key={d.id} value={d.keyword}>
        {d.keyword}
      </Option>
    ));
    const listItems = selectedTags.map(demand => (
      <Row key={demand.id}>
        <Col style={{ lineHeight: '24px' }} span={12}>
          {/* <DisplayRow name={demand.tag} area={areaString}></DisplayRow> */}
          <b>{demand.tag}</b>{demand.tag=='地理位置'?demand.tagName:''}{demand.tag=='产品关键词'?demand.tagName:''}{demand.categoryId==0?demand.tagName:''}
        </Col>
        <Col style={{ lineHeight: '24px' }} span={7} offset={1}>
          {demand.predictNum}
        </Col>
        <Col span={4}>
          <Button
            style={{ color: 'red' }}
            type="link"
            size="small"
            onClick={() => this.deleteRow(demand)}
            shape="circle"
            icon="close"
          />
        </Col>
      </Row>
    ));

    const loop = data =>
     data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={title} />;
      });
  
      const { getFieldDecorator } = this.props.form;
    return (
      <Card>
        <Row>
          <Col span={5}>
            <Search style={{ marginBottom: 8 }} placeholder="请输入标签名称" onSearch={this.onSearch} />
           {Sk.length!=0 &&<Tree
              // onExpand={this.onExpand}
              // expandedKeys={expandedKeys}
              // autoExpandParent={autoExpandParent}
              onSelect={this.onSelect}
              defaultSelectedKeys={this.state.selectedKeys}
              defaultExpandAll={true}
              selectedKeys={this.state.Sk}
              // autoExpandParent={true}
            >
              {loop(dstagcategory)}
            </Tree>} 
          </Col>
          <Col span={18} offset={1} className={style.noAllCheck}>
            <div style={{textAlign:'right'}}>当前标签不能满足需求？ <Button type="primary" onClick={this.showModal.bind(this)}>添加自定义标签</Button></div>
            <Table
              loading={tableLoading}
              rowSelection={rowSelection}
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </Col>
        </Row>
        <Modal
          visible={this.state.addTagVisible}
          onOk={this.handleOk}
          okText="保存"
          closable={false}
          width={400}
          cancelText="关闭"
          footer={[
            <Button style={{textAlign:'center'}} key="submit" type="primary" onClick={this.handleOk}>
              保存
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
              关闭
            </Button>
            ,
          ]}
          onCancel={this.handleCancel}
          
        >
         <h2 style={{textAlign:'center',fontWeight:700}}>添加自定义标签</h2>
         <Form layout="inline">
        <Form.Item label="标签名称">
          {getFieldDecorator('custom', {
            
          })(<Input style={{width:'240px'}}/>)}
        </Form.Item>
        </Form>
        </Modal>
        <div id="selected" className={style.selected} onClick={() => this.showDrawer('tag')}>
          已选标签
          <span style={{color:'red'}}>{selectedTags.length+' '}</span>个
        </div>
        <div className={style.redBall}></div>

        <Drawer
          title="已选标签"
          placement="right"
          closable={false}
          width="512"
          visible={this.state.tagVisible}
        >
          <Row className={style.selectedL}>
            <Col span={4}></Col>

            <Col span={10}><b>标签名称</b></Col>
            <Col offset={1} span={9}><b>预估人数</b></Col>
          </Row>
          <Row style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          {/* <Col span={4}>{selectedTags.length>0&&<span>且</span>} </Col> */}
          <Col span={4}></Col>
            <Col span={20}>{listItems}</Col>
          </Row>
          <div className={style.selectedB}>
            <Row>
              <Col span={16}>
                <b>预估人数</b>
                <div>{tagRowNum}人</div>
              </Col>
              <Col span={8}>
                <Button type="primary" onClick={() => this.onClose('tag')}>
                  生成需求
                </Button>
                <Button type="link" onClick={() => this.closeTag()}>
                  关闭
                </Button>
              </Col>
            </Row>
          </div>
        </Drawer>
        <Drawer
          title="地理位置"
          placement="right"
          closable={false}
          width="512"
          visible={this.state.areaVisible}
        >
          <Form labelAlign="right">
            <FormItem
              key={1}
              wrapperCol={{ span: 13 }}
              labelCol={{ xxl: 7, md: 6 }}
              label="包含省份/城市"
            >
              {form.getFieldDecorator('areaValue', {
                initialValue: '',
                rules: [{ required: true, message: '请选择省份' }],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={areaSelect}
                  placeholder="支持中文搜索"
                  multiple
                  showCheckedStrategy="SHOW_PARENT"
                  showSearch={true}
                  treeCheckable
                  onChange={this.onSelectChange}
                />,
              )}
            </FormItem>
            <Button onClick={()=>this.clearProvince()} style={{position:'absolute',right:'4px',top:'60px'}}>清除条件</Button>
            <FormItem
              key={2}
              wrapperCol={{ span: 13 }}
              labelCol={{ xxl: 7, md: 6 }}
              label="预估人数"
            >
              {spinningLoading && <Spin size="small"></Spin>}
              {!spinningLoading && <span><span style={{color:'red'}}>{predictNum+' '}</span><span>人</span></span>}
            </FormItem>
          </Form>
          <div className={style.selectedB}>
            <Row justify="center" type="flex">
              <Col span={10}>
                <Button style={{marginRight:'10px'}} type="primary" onClick={() => this.setArea()}>
                  确认选择
                </Button>
                <Button onClick={() => this.onClose('area')}>返回</Button>
              </Col>
            </Row>
          </div>
        </Drawer>
        <Drawer
          title="产品关键词"
          placement="right"
          closable={false}
          width="512"
          visible={this.state.projectVisible}
        >
          <Form labelAlign="right">
            <FormItem
              key={1}
              wrapperCol={{ span: 13 }}
              labelCol={{ xxl: 7, md: 6 }}
              label="时间范围"
            >
              <Radio.Group value={this.state.value3} onChange={this.onChange3} buttonStyle="solid">
                <Radio.Button value="近30天">近30天</Radio.Button>
                <Radio.Button value="近60天">近60天</Radio.Button>
                <Radio.Button value="近90天">近90天</Radio.Button>
              </Radio.Group>
            </FormItem>
            <FormItem
              key={2}
              wrapperCol={{ span: 13 }}
              labelCol={{ xxl: 7, md: 6 }}
              label="搜索关键词"
            >
              {form.getFieldDecorator('s', {
                // initialValue: '',
              })(
                <div>
                  <Select
                    value={this.state.keywordValue}
                    onSelect={this.handleSelect.bind(this)}
                    style={{ width: 160 }}
                    // showSearch
                    // onSearch={this.handleSearch}
                  >
                    {options}
                  </Select>
                  <Button type="primary" onClick={() => this.addKeyword()}>
                    添加
                  </Button>
                </div>,
              )}
            </FormItem>
            <FormItem
              key={3}
              wrapperCol={{ span: 13 }}
              labelCol={{ xxl: 7, md: 6 }}
              label="产品关键词列表"
              style={{position:'relative'}}
            >
              {/* {form.getFieldDecorator('keywordList', {
                // initialValue: '',
                rules: [{ required: true, message: '请填写关键词列表' }],
              })(
                  <TextArea onChange={this.onTextAreaChange.bind(this)} rows={4} allowClear  />
                  
              )} */}
              {this.state.keywordListArr.length==0&& '--'}
              {this.state.keywordListArr.map(ele=>{
                return (<div key={ele}>{ele}<Button
                  style={{ color: 'red' }}
                  type="link"
                  size="small"
                  onClick={() => this.removeKeyword(ele)}
                  shape="circle"
                  icon="close"
                /></div>)
              })}
            </FormItem>
            <FormItem
              key={3}
              wrapperCol={{ span: 13 }}
              labelCol={{ xxl: 7, md: 6 }}
              label="产品关键词个数："
              style={{position:'relative'}}
            >
              <div><b style={{color:'red',}}>{this.state.keywordListArr.length}</b></div>
             </FormItem>
            
          </Form>
          <div className={style.selectedB}>
            <Row justify="center" type="flex">
              <Col span={10}>
                <Button type="primary" style={{marginRight:'10px'}}  onClick={() => this.setProject()}>确认选择</Button>
                <Button onClick={() => this.onClose('project')}>返回</Button>
              </Col>
            </Row>
          </div>
        </Drawer>
      </Card>
    );
  }
}
export default choseTag;
