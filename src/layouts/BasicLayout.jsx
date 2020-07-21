/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { Icon, Result, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
// import logo from '../assets/logo.svg';
import logoImg from '@/assets/indexLogo.png'
const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
const logo=()=>{
  return (<div style={{height:'250px',padding:'30px 0',textAlign:'center'}}>
   
    <img src={logoImg} style={{width:'75px',marginBottom:'30px',height:'92px',textAlign:'center'}} />
     
  </div>)
}
/**
 * use Authorized check all menu item
 */

// const menuDataRender= async (menuList)=>{
//   const res=await getMenu()
//   .then(({data})=>{
//   //    menuList= data.map(item=>({
//   //   path:item.path,
//   //   name:item.name,
//   //   icon:item.icon
//   // }))
//   return data
// })
// console.log(res,'什么东西s')

// return res
// }

  // menuList.map(item => {
  //   // const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
  //   // return Authorized.check(item.authority, localItem, null);
  // });

const defaultFooterDom = (
  <footer className="ant-layout-footer" style={{padding: '0px'}}></footer>
);

const footerRender = () => {
  if (!isAntDesignPro()) {
    return defaultFooterDom;
  }

  return (
    <>
      {defaultFooterDom}
      
    </>
  );
};

const BasicLayout = props => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    menu
  } = props;
  /**
   * constructor
   */
 
  useEffect(() => {
    if (dispatch) {
      
      dispatch({
        type: 'settings/getSetting',
      });
    }
  }, []);
  /**
   * init variables
   */
  const menuDataRender= (menuList)=>{
    return menu
  }
  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  return (
    <ProLayout
      logo={logo}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
            defaultMessage: 'Home',
          }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={footerRender}
      menuDataRender={menuDataRender}
      formatMessage={formatMessage}
     
      rightContentRender={rightProps => <RightContent {...rightProps} />}
     
      {...props}
      {...settings}
    >
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings,menu }) => ({
  collapsed: global.collapsed,
  menu:menu.menu,
  settings,
}))(BasicLayout);
