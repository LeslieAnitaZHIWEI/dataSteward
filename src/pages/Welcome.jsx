import React, { Component, Suspense, PureComponent,memo } from 'react';
import { getStatistics, getDsdemand,getDetail } from '@/services/demand';
import { Table, Card, Button, Row, Col } from 'antd';
import style from './home/style.less';
import { router } from 'umi';
import { connect } from 'dva';
const IntroduceRow = React.lazy(() => import('./home/IntroduceRow'));
import moment from 'moment';
import { queryCurrent } from '@/services/user';



const SuperMarket = memo(props => {
  console.log(props,'SuperMarket')
  const {dstagcategory}=props
  return (
  <Row  gutter={20}>
    {dstagcategory.filter(itm=>itm.title!='自定义标签').map(ant=>{
      return (<Col key={ant.id} span={Math.floor(24/dstagcategory.filter(itm=>itm.title!='自定义标签').length)}>
        <b>{ant.title}</b>
        <div >
      {ant.children.map((ele,index)=>{
        if(index==9){
        return (<span key={index} style={{cursor:'pointer'}} onClick={()=>props.goTag(ele.id)}><span style={{color:'rgb(0, 0, 255)','textDecoration':'underline'}}>...</span> </span>)

        }
        if(index>8){
          return false
        }
        return (<span key={index} style={{cursor:'pointer'}} onClick={()=>props.goTag(ele.id)}><span style={{color:'rgb(0, 0, 255)','textDecoration':'underline'}}>{ele.title}</span> </span>)
      })}
    </div>
      </Col>)
    })}

  </Row>
  )
})

@connect(({ user, loading,demand }) => ({
  currentUser: user.currentUser,
  dstagcategory:demand.dstagcategory
}))
class Welcome extends PureComponent {
  state = {
    date1: '',
    audiencePackageTotal: 0,
    dataMatching: 0,
    executingTaskTotal: 0,
    unreadMessageTotal: 0,
    dataSource: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  };
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
  goTag(id){
    router.push({ pathname: '/chooseTag' ,
  query:{chooseId:id.toString() }});
    this.props.dispatch({
      type: 'demand/deleteAll'
      
    })
  }
  getDate() {
    var date = new Date();
    //格式化为本地时间格式
    var date1 = moment().format('YYYY-MM-DD HH:mm:ss');
    //获取div
    this.setState({
      date1: date1,
    });
  }
  componentWillMount() {
    const { dispatch } = this.props;
    console.log(this.props,'this.props')
    dispatch({
      type: 'demand/getCategory',
    })
    const {currentUser}=this.props
    getStatistics().then(({ data }) => {
      console.log(data, 'getStatistics');
      this.setState({
        audiencePackageTotal: data.audiencePackageTotal,
    dataMatching: data.dataMatching,
    executingTaskTotal: data.executingTaskTotal,
    unreadMessageTotal: data.unreadMessageTotal,
      })
    });
    if(currentUser.userId){
     
        getDsdemand({
          agentId: currentUser.userId,
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
      
    }else{
      queryCurrent().then(({ data }) => {
      console.log(data);
      getDsdemand({
        agentId: data.sysUser.userId,
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
    });
    }
    
  }
  timeouter=setInterval(() => {
    this.getDate();
  }, 1000);
  componentDidMount() {
    
  }
 
  componentWillUnMount = () => {
    console.log(this.timeouter,'正常卸载')
    clearTimeout(this.timeouter)
    this.setState = (state, callback) => {
      return;
    };
  };
  render() {
    const columns = [
      {
        title: '客户名称',
        dataIndex: 'customer',
        render: (text, record) => (
          <a onClick={() => this.toDemandDetails(record)}>{text}</a>
          )
      },
      {
        title: '目标用户需求',
        dataIndex: 'demandInfo',
        render:(text,record)=>{
          return <div style={{}} title={text}>{text?text.length>20?text.toString().substring(0,20)+'...':text:''}</div>
        
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
        render:(value, row, index) => {
          switch(value){
            case 1:return '高';
            case 2:return '中';
            case 3:return '低';
          }
        },
        width: 80,
    
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
        width: 120,
    
      },
      {
        title: '数据反馈',
        dataIndex: 'feedback',
        render:(text)=>{
         return <div style={{}} title={text}>{text?text.length>20?text.toString().substring(0,20)+'...':text:''}</div>

        }
      },
    ];
    const {
      pagination,
      unreadMessageTotal,
      audiencePackageTotal,
      dataMatching,
      executingTaskTotal,
      dataSource,
    } = this.state;
    const { currentUser ,dstagcategory} = this.props;
    const toDmand=()=>{
      router.push('/demandManage')
    }
    const footer = () => (
      <div style={{textAlign:'center'}}>
        {
          dataSource.length>=10 &&
        <Button type="link" onClick={()=>toDmand()}>查看全部...</Button> 
      }
      </div>
    );
    return (
      <div>
        <Suspense fallback={null}>
          <Row type="flex" justify="space-between" style={{ height: '60px', marginLeft: '40px' }}>
            <Col span={4}>
              <div className={style.leftCol}>{currentUser.username}</div>
              <span className={style.leftSpan}>欢迎使用数据管家</span>
            </Col>
            <Col xxl={3} md={5}>
              <span className={style.leftSpan}>星期三</span>
              <div className={style.leftCol}>{this.state.date1}</div>
            </Col>
          </Row>
          <IntroduceRow
            unreadMessageTotal={unreadMessageTotal}
            audiencePackageTotal={audiencePackageTotal}
            executingTaskTotal={executingTaskTotal}
            dataMatching={dataMatching}
          />
        </Suspense>
        <Card style={{ margin: '5px 30px', borderRadius: '10px' }}>
    <h3><b>标签超市</b></h3>
      <SuperMarket dstagcategory={dstagcategory} goTag={this.goTag.bind(this)}></SuperMarket>
  </Card>
        <Card style={{ margin: '0 30px', borderRadius: '10px' }}>
          <Table dataSource={dataSource} columns={columns} footer={footer} pagination={false} />
        </Card>
      </div>
    );
  }
}
export default Welcome;
