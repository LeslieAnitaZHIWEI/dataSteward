import React, { PureComponent, Suspense } from 'react';
import { Route, Redirect } from 'umi';
import { getStatistics, getDsdemand, deleteDsdemand, getDetail } from '@/services/demand';
import { connect } from 'dva';
import { Table, Layout, Row, Col, Card, Form, Input, Select, Icon, Button, Modal, message } from 'antd';
import style from './style.less';
import { router } from 'umi';
import sucImg from '@/assets/success.png';
import failImg from '@/assets/fail.png';

const { confirm } = Modal;
const FormItem = Form.Item;
const { TextArea } = Input;
function toDemandDetails(row) {
  const { dispatch } = this.props;
  if (dispatch) {
    dispatch({
      type: 'demand/getDetail',
      payload: this.props.match.params.id,
    });
  }
  router.push({ pathname: '/demandDetails/' + row.id });
  //   getDetail({
  //     id:row.id
  //   }).then((data)=>{
  //     router.push({pathname:'/demandDetails/'+row.id,

  //     row:data.data
  // })
  //   })
}
function toEditDemand(id) {
  getDetail({
    id,
  }).then(data => {
    router.push({ pathname: '/addDemand', row: data.data });
  });
}

/**
 * 页面
 */
@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    dataSource: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    updateUser: false,
    visible: false,
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState(
        {
          formValues: values,
        },
        () => {
          this.getData();
        },
      );

      // dispatch({
      //   type: 'rule/fetch',
      //   payload: values,
      // });
    });
  };
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  addDemand = () => {
    router.push('/addDemand');
  };
  componentDidMount() {
    console.log('獲取需求管理', this.state.pagination);
    const { currentUser } = this.props;

    if (currentUser.userId) {
      console.log('zenm会执行');
      this.getData();
    } else {
      this.setState({
        updateUser: true,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps, 'nextProps');
    const { currentUser } = this.props;
    const { updateUser } = this.state;
    if (nextProps.currentUser.userId && currentUser.userId && updateUser) {
      console.log('zenm会执行');
      this.getData();
    }
  }
  getData = () => {
    const { currentUser } = this.props;
    const { formValues, pagination } = this.state;
    console.log(currentUser, 'currentUser,State有嗎');
    getDsdemand({
      agentId: currentUser.userId,
      current: pagination.current,
      size: pagination.pageSize,
      ...formValues,
    }).then(({ data }) => {
      console.log(data, 'getDsdemand');
      this.setState({
        dataSource: data.records,
        pagination: {
          current: data.current,
          pageSize: data.size,
          total: data.total,
        },
      });
    });
  };
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
  handleCancel() {
    this.setState({
      visible: false,
    });
  }
  onShowSizeChange(current, pageSize) {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          pageSize: pageSize,
        },
      },
      () => {
        this.getData();
      },
    );

    console.log(current, pageSize);
  }
  onSizeChange(page, size) {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          current: page,
        },
      },
      () => {
        this.getData();
      },
    );
  }
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex">
          <Col xxl={6} md={6} sm={24}>
            <FormItem label="客户名称">
              {getFieldDecorator('customer', {
                initialValue: '',
              })(
                <Input
                  prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  autoComplete="off"
                  placeholder="请输入"
                />,
              )}
            </FormItem>
          </Col>
          <Col xxl={3} md={5} sm={24}>
            <FormItem label="数据反馈">
              {getFieldDecorator('hasFeedback', {
                initialValue: '',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value={true}>是</Select.Option>
                  <Select.Option value={false}>否</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={3} md={5} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status', {
                initialValue: '',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="0">待发布</Option>
                  <Option value="1">业务分析</Option>
                  <Option value="2">计算中</Option>
                  <Option value="3">已上传</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xxl={3} md={2} sm={24}>
            <span className={style.submitButtons}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </span>
          </Col>
          <Col xxl={5} md={3} sm={24} style={{ textAlign: 'right' }}>
            <Button icon="plus" onClick={() => this.addDemand()} htmlType="submit">
              添加需求
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
  toDemandDetails(row) {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'demand/getDetail',
        payload: row.id,
      });
    }
    router.push({ pathname: '/demandDetails/' + row.id });
  }
  render() {
    const columns = [
      {
        title: '客户名称',
        dataIndex: 'customer',
        width: 200,
        render: (text, record) => <a onClick={() => this.toDemandDetails(record)}>{text}</a>,
      },
      {
        title: '目标用户需求',
        dataIndex: 'demandInfo',
        render: (text, record) => {
          return (
             <div style={{}} title={text}>{text?text.length>20?text.toString().substring(0,20)+'...':text:''}</div>
         
          )
        }

      },
      {
        title: '投放媒体',
        dataIndex: 'pushMedia',
        width:120
      },
      {
        title: '优先级',
        dataIndex: 'priority',
        render: (value, row, index) => {
          switch (value) {
            case 1:
              return '高';
            case 2:
              return '中';
            case 3:
              return '低';
          }
        },
        width: 80,
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (value, row, index) => {
          switch (value) {
            case 0:
              return '待发布';
            case 1:
              return '业务分析';
            case 2:
              return '计算中';
            case 3:
              return '已上传';
          }
        },
        width: 120,
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
        title: '管理',
        dataIndex: 'id',
        render: (value, row, index) => {
          var that = this;
          console.log(row);
          return (
            <div>
              {row.status == 0 && (
                <Button type="link" onClick={() => toEditDemand(value)} size="small">
                  编辑
                </Button>
              )}
              {row.status == 0 && (
              <Button
                type="link"
                onClick={() =>
                  confirm({
                    title: '是否确认删除?',
                    content: '',
                    cancelText: '取消',
                    okText: '确定',
                    onOk() {
                      deleteDsdemand({
                        id: value,
                      }).then(res => {
                        if(res.code==0){
                          that.setState({
                          visible: true,
                        });
                        }else{
                          message.error(res.msg)
                        }
                        
                        that.getData();
                      });
                    },
                    onCancel() {
                      console.log('Cancel');
                    },
                  })
                }
                size="small"
              >
                删除
              </Button>)}
            </div>
          );
        },
      },
    ];
    const paginationProps = {
      showSizeChanger: true,

      pageSize: this.state.pagination.pageSize,
      current: this.state.pagination.current,
      total: this.state.pagination.total,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      onChange: (current, pageSize) => this.onSizeChange(current, pageSize),
    };
    const { dataSource, pagination } = this.state;
    // const parentMethods = {
    //   handleAdd: this.handleAdd,
    //   handleModalVisible: this.handleModalVisible,
    // };
    return (
      <div>
        <Card style={{ margin: '0 30px', borderRadius: '10px' }}>
          <div className={style.tableList}>
            <div className={style.tableListForm}>{this.renderForm()}</div>
            <Table dataSource={dataSource} columns={columns} pagination={paginationProps} />
            <Modal
              footer={null}
              visible={this.state.visible}
              onCancel={this.handleCancel.bind(this)}
            >
              <div style={{ width: '71px', margin: '0 auto', textAlign: 'center' }}>
                <img src={sucImg} alt="" />
                删除成功
              </div>
            </Modal>
          </div>
        </Card>
        {/* <CreateForm {...parentMethods} modalVisible={modalVisible} /> */}
      </div>
    );
  }
}

export default TableList;
