import { Alert, Checkbox,Row,Col } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';
const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;
import { Form, Icon, Input, Button } from 'antd';
import img from '@/assets/login.png'
import logo from '@/assets/logo.png'
import {randomLenNum} from '../../../utils/utils'

@connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))
class Login extends Component {
  loginForm = undefined;
  state = {
    randomStr:''
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { dispatch } = this.props;
        values.randomStr=this.state.randomStr
dispatch({
        type: 'login/login',
        payload: { ...values, type:'account' },
      }).then(res=>{
        this.refreshCode()
        
      })
        
      
      }
    });
  };
  // handleSubmit = (err, values) => {
  //   const { type } = this.state;

  //   if (!err) {
  //     const { dispatch } = this.props;
  //     dispatch({
  //       type: 'login/login',
  //       payload: { ...values, type },
  //     });
  //   }
  // };
  onTabChange = type => {
    this.setState({
      type,
    });
  };
  
  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
  refreshCode() {
    var randomStr=randomLenNum(4, true)
    this.setState({
      randomStr : randomStr
    })
    if(process.env.NODE_ENV !== 'production'){
    
this.setState({
      // src:`${window.location.origin}/code?randomStr=${randomStr}`
      src:`/api/code?randomStr=${randomStr}`
    })
    }else{
      this.setState({
        src:`/code?randomStr=${randomStr}`
      })
    }
  }
      componentWillMount(){
      }
      componentDidMount(){
        this.refreshCode()

      }
  render() {
    const { userLogin, submitting,refreshCode } = this.props;
    const { status, type: loginType } = userLogin;
    const { type, src } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Row className={styles.wrapper}>
       <Col style={{float:'left',width:'475px'}}>
       <img style={{width:'100%',borderRadius:'10px 0 0 10px '}} src={img} alt=""/>
       </Col>
      <Col className={styles.main}>
        <div style={{textAlign:'center',marginBottom:'20px'}}>
         {/* <span className={styles.datapic}></span> 数据管家 */}
          <img style={{width:'110px'}} src={logo}></img>
        </div>
        {/* <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          onCreate={form => {
            this.loginForm = form;
          }}
        >
         
            <span className={styles.zi}>用户名</span>
            <UserName
              name="userName"
              placeholder="请输入用户名"
              rules={[
                {
                  required: true,
                  message: "请输入用户名",
                },
              ]}
              size="small"
            />
            <span className={styles.zi}>密码</span>
            <Password
              name="password"
              placeholder="请输入密码"
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'user-login.password.required',
                  }),
                },
              ]}
               size="small"
              onPressEnter={e => {
                e.preventDefault();

                if (this.loginForm) {
                  this.loginForm.validateFields(this.handleSubmit);
                }
              }}
            />
        
         
          <Submit size="middle" loading={submitting}>
            <FormattedMessage id="user-login.login.login" />
          </Submit>
         
        </LoginComponents> */}
        <div>
        <Form onSubmit={this.handleSubmit} className="login-form">
        <span className={styles.zi}>用户名</span>

        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
              size="middle"
            />,
          )}
        </Form.Item>
            <span className={styles.zi}>密码</span>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
              size="middle"
              />,
          )}
        </Form.Item>
        <span className={styles.zi}>验证码</span>
        <Form.Item>
          {getFieldDecorator('code', {
            rules: [{ required: true, message: '请输入验证码' }],
          })(
            <div>
            <Input
              type="code"
              name="code"
              allowClear="true"
              placeholder="请输入验证码"
              size="middle"
              style={{width:'180px'}}
              /> <img
              src={src}
              style={{height:'35px'}}
              
              onClick={()=>this.refreshCode()} /></div>,
          )}
        </Form.Item>
        <Form.Item>
          
          <Button type="primary"  size="large" loading={submitting} htmlType="submit" className={styles.login}>
            登录
          </Button>
        </Form.Item>
      </Form>
        </div>
      </Col></Row>
    );
  }
}

export default Form.create()(Login);
