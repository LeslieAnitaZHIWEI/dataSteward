import React, { PureComponent, Fragment } from 'react';

import { Table,Layout,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Modal,
  Popover,
  Button,
  message,
  } from 'antd';
import style from './style.less';const { confirm } = Modal;
const FormItem = Form.Item;
import {getMessage,getMessageDetail, allreadMessage,deleteMessage} from '@/services/Message'
const SearchRow = React.lazy(() => import('./searchRow'));


  
 
@Form.create()
class TableList extends PureComponent {
    state = {
      modalVisible: false,
      updateModalVisible: false,
      expandForm: false,
      selectedRows: [],
      formValues: {},
      stepFormValues: {},
      content:{
        title:'',
        createTime:'',
        content:'',
        sender:'',
        receiver:''
      },
      pagination:{
        current:1,
        pageSize:10,
        total:0,
       
      },
    };
    getData(){
      const {pagination}=this.state
      getMessage({
        current:pagination.current,
        size:pagination.pageSize,
      }).then(({data})=>{
        console.log(data)
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
    componentWillMount(){
      this.getData()
    }
    showContent(record){
      getMessageDetail({
        id:record.id
      }).then(({data})=>{
        this.setState({
          content:data
        })
        this.getData()
      })
    }
     messageTable(){
       const {content}=this.state
     return (<div style={{width:'500px'}}>
       
       <Form labelAlign="left">
        <Row>
          <Col span={12}>
  <FormItem key={1} labelCol={{ span:5 }} label="标题">{content.title}</FormItem>
          </Col>
          <Col span={12}>
  <FormItem key={2} labelCol={{ span:7 }} label="发送时间">{content.createTime}</FormItem>
          </Col>
          </Row>
          <FormItem key={3} labelCol={{ span:3 }} label="内容">{content.content}</FormItem>
          <FormItem key={4} labelCol={{ span:3 }} label="发送人">{content.sender}</FormItem>
          <FormItem key={5} labelCol={{ span:3 }} label="接收人">{content.receiver}</FormItem>

          </Form>
       
       </div>)
    }
     columns = [
      {
        title: '内容',
        dataIndex: 'title',
        render: (text, record) => (
          <Popover placement="bottomLeft" content={this.messageTable()} trigger="click">
      <a onClick={() => this.showContent(record)}>{text}</a>
      </Popover>
            
          
        ),
        
      },
      {
        title: '时间',
        dataIndex: 'sendTime',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (value, row, index) => {
          switch (value) {
            case 0:
              return '未读';
            case 1:
              return '已读';
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleDelete(text, record)}>删除</a>
            {/* <Divider type="vertical" /> */}
          </Fragment>
        ),
      },
    ];
   
    handleDelete = (id, record) => {
      var that=this
      confirm({
        title: '提示',
        content: '确认删除吗?',
        onOk() {
          deleteMessage({
            id
          }).then(res=>{
            if(res.code==0){
              message.success('删除成功')
            }
            that.getData()
          })
        },
        onCancel() {},
      });
    };
    handleSearch = e => {
      e.preventDefault();
  
      const { dispatch, form } = this.props;
  
      form.validateFields((err, fieldsValue) => {
        if (err) return;
  
        const values = {
          ...fieldsValue,
          updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        };
  
        this.setState({
          formValues: values,
        });
  
        dispatch({
          type: 'rule/fetch',
          payload: values,
        });
      });
    };
    allRead(){
      allreadMessage().then(res=>{
        console.log(res)
        this.getData()
      })
    }
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}  type="flex" justify="end">
          <Col xxl={3} md={4} sm={24}>
          <Button size="large" onClick={()=>this.allRead()}>全部标记为已读</Button>
          </Col>
         
        </Row>
     
    );
    
  }
  onShowSizeChange(current,pageSize) {
    this.setState({
      pagination:{
        ...this.state.pagination,
        pageSize:pageSize
      }
    },()=>{
    this.getData()
      
    })

    console.log(current, pageSize);
  }
  onSizeChange(page,size){
    this.setState({
      pagination:{
        ...this.state.pagination,
        current:page
      }
    },()=>{
    this.getData()
      
    })

  }
  render(){
    const {  dataSource,pagination } = this.state;
    const paginationProps = {
      showSizeChanger: true,
     
      pageSize: this.state.pagination.pageSize,
      current: this.state.pagination.current,
      total: this.state.pagination.total,
      onShowSizeChange: (current,pageSize) => this.onShowSizeChange(current,pageSize),
      onChange:(current,pageSize) => this.onSizeChange(current,pageSize),
    }
    return (
      <div>
        
           
        <Card style={{margin:'0 30px',borderRadius:'10px'}}>
        <div className={style.tableList}>
           <div  className={style.tableListForm}>
              {this.renderForm()}
            </div>
    <Table
      rowKey={record=>record.id}
    dataSource={dataSource} columns={this.columns} pagination={paginationProps}/>
    </div>
    </Card>
         </div>
    )
  }

}

  export default TableList 