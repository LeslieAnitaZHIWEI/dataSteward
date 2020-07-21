import React, { PureComponent, Suspense } from 'react';
import { Route, Redirect } from 'umi';
import {getStatistics,getDsdemand,deleteDsdemand,getDetail} from '@/services/demand'

import { Table,Layout,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Modal,
  message
  } from 'antd';
import style from './style.less';
import { router } from 'umi';
const FormItem = Form.Item;
const { TextArea } = Input;
import { connect } from 'dva';
const { confirm } = Modal;



  /**
   * 页面
   */
  @connect(({ demand }) => ({
    demandDetail: demand.demandDetail,
  }))
@Form.create()
class TableList extends PureComponent {
    state = {
      modalVisible: false,
      updateModalVisible: false,
      expandForm: false,
      selectedRows: [],
      formValues: {},
      stepFormValues: {},
      pagination:{
        current:1,
        pageSize:10,
        total:0
      },
      dataSource:[]
    };
    handleSearch = e => {
      e.preventDefault();
  
      const {  form } = this.props;
  
      form.validateFields((err, fieldsValue) => {
        if (err) return;
  
        const values = {
          ...fieldsValue
        };
  
        this.setState({
          formValues: values,
        }, () => {
          this.getData()

        });
        console.log(values,'vvvvv')
        // dispatch({
        //   type: 'rule/fetch',
        //   payload: values,
        // });
      });
    };
    handleModalVisible= flag => {
      this.setState({
        modalVisible: !!flag,
      });

    }
    addDemand=()=>{
      router.push('/addDemand')
    }
    /**
     * 保存需求
     */
    handleAdd = fields => {
      // const { dispatch } = this.props;
      // dispatch({
      //   type: 'rule/add',
      //   payload: {
      //     desc: fields.desc,
      //   },
      // });
  
      message.success('添加成功');
      this.handleModalVisible();
    };
    getData=()=>{
      const {formValues}=this.state
     
      getDsdemand({
        
        ...formValues
      }).then(({data})=>{
        console.log(data,'getDsdemand')
        this.setState({
          dataSource:data.records,
          pagination:{
            current:data.current,
            pageSize:data.size,
            total:data.total
          }
        })
      })
    }
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}  type="flex">
          <Col xxl={6} md={6} sm={24}>
            <FormItem label="代理商名称">
              {getFieldDecorator('agent',{
                initialValue: '',
              })(<Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} autoComplete="off" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col xxl={6} md={6} sm={24}>
            <FormItem label="客户名称">
              {getFieldDecorator('customer',{
                initialValue: '',
              })(<Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} autoComplete="off" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col xxl={3} md={5} sm={24}>
            <FormItem label="数据反馈">
              {getFieldDecorator('hasFeedback',{
                initialValue: '',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                <Select.Option value="">全部</Select.Option>
                <Select.Option value={true}>是</Select.Option>
                <Select.Option value={false}>否</Select.Option>
              </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={3} md={5} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status',{
                initialValue: '',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                   <Option value="">全部</Option>
                  <Option value="1">业务分析</Option>
                  <Option value="2">计算中</Option>
                  <Option value="3">已上传</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={3} md={2} sm={24}>
            <span className={style.submitButtons}>
              <Button type="primary"   htmlType="submit">
                搜索
              </Button>
             
            </span>
          </Col>
        
        </Row>
      </Form>
    );
    
  }
  componentWillMount(){
    this.getData()
  }
  toManageTask(row){
    const { dispatch } = this.props;
    if (dispatch) {
      console.log('?????????????')
      dispatch({
        type: 'demand/getDetail',
        payload: row.id,
      });
    }
    router.push({ pathname: '/taskProcess/' + row.id });
    
    
  }
  toDemandDetails(row) {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'demand/getDetail',
        payload: row.id,
        
      });
    }
    router.push({ pathname: '/demandDetailsY/' + row.id });
  }
  render(){
    // const {  modalVisible } = this.state;
    // const parentMethods = {
    //   handleAdd: this.handleAdd,
    //   handleModalVisible: this.handleModalVisible,
    // };
    const columns = [
      {
        title: '广告代理商',
        dataIndex: 'adAgent',
        width:200,
        render: (text, record) => (
        <a onClick={() => this.toDemandDetails(record)}>{text}</a>
        ),
      },
      {
        title: '客户名称',
        dataIndex: 'customer',
        width:200,
      
      },
      {
        title: '目标用户需求',
        dataIndex: 'demandInfo',
        render: (text, record) => {
          return (
          <div style={{}} title={text}>{text?text.length>20?text.toString().substring(0,20)+'...':text:''}</div>
          
          )
        },
      },
      {
        title: '投放媒体',
        dataIndex: 'pushMedia',
        width:110

      },
      {
        title: '优先级',
        dataIndex: 'priority',
        render:(value, row, index) => {
          switch(value){
            case 1:return '高';
            case 2:return '中';
            case 3:return '低';
          }
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        render:(value, row, index) => {
          switch(value){
            case 0:return '待发布';
            case 1:return '业务分析';
            case 2:return '计算中';
            case 3:return '已上传';
          }
        },
        width:120
      },
      {
        title: '数据反馈',
        dataIndex: 'feedback',
        render: (text, record) => {
          return (
          <div style={{}} title={text}>{text?text.length>20?text.toString().substring(0,20)+'...':text:''}</div>
          
          )
        },
      },
      {
        title:'管理',
        dataIndex:'id',
        render:(value, row, index) => {
          var that=this
          console.log(row)
          return (<div>
            { row.status!=3 &&
            <Button type="link" onClick={()=>this.toManageTask(row)} size="small">
            管理任务
          </Button>}
          { row.status==1 &&
            <Button type="link" onClick={()=>confirm({
      title: '是否确认删除?',
      content: '',
      cancelText: '取消',
      okText:'确定',
      onOk() {
        deleteDsdemand({
          id:value
        }).then(res=>{
          if(res.code==0){
            message.success("删除成功")
          }else{
            message.error(res.msg)
          }
          that.getData()
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    })} size="small">
            删除
          </Button>}
          </div>)
        }
      }
    ];
    const {  dataSource,pagination } = this.state;

    return (
      <div>
        <Card style={{margin:'0 30px',borderRadius:'10px'}}>
        <div className={style.tableList}>
           <div  className={style.tableListForm}>
              {this.renderForm()}
            </div>
    <Table
    dataSource={dataSource} columns={columns} className={style.tableBtn}/>
    </div>
    </Card>
    {/* <CreateForm {...parentMethods} modalVisible={modalVisible} /> */}

         </div>
    )
  }

}

  export default TableList 