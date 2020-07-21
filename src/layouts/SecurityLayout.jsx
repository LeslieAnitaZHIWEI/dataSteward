import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import PageLoading from '@/components/PageLoading';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    console.log(dispatch,'dispatch')
   
    
  }
  componentWillMount(){
    const { dispatch,menu } = this.props;
    console.log('登录页有吗',this.props)
    if(this.props.location.pathname!='/'){
      if(dispatch){
      dispatch({
            type: 'login/detection',
          });
      
            dispatch({
              type: 'user/fetchCurrent',
            });
          
    }
    if(menu.length==0){
      dispatch({
        type:"menu/menu"
      })
    }
    }
    
  }
  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser,token } = this.props; // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    console.log(token,'token')
    console.log(currentUser,'currentUserLayout')
    const isLogin = token 
    const queryString = stringify({
      redirect: window.location.href,
    });

    // if ((!isLogin && loading) || !isReady) {
    //   console.log('???')
    //   return <PageLoading />;
    // }
    console.log('是不是这里')
    // if (!isLogin) {
    //   return <Redirect to={`/user/login?${queryString}`}></Redirect>;
    // }

    return children;
  }
}

export default connect(({ user, loading,login,menu }) => ({
  currentUser: user.currentUser,
  token:login.token,
  loading: loading.models.user,
  menu:menu.menu
}))(SecurityLayout);
