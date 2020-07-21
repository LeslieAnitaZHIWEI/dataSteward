const scope = 'server'
import request from '@/utils/request';
export async function fakeAccountLogin(params) {
  return request('/login/account', {
    method: 'POST',
    data: params,
  });
}
export async function  loginByUsername ({username, password, code, randomStr})  {
  const grant_type = 'password'
  return request(
     '/auth/oauth/token',{
    headers: {
      isToken: 'true',
      'TENANT_ID': '1',
      'Authorization': 'Basic cGFtaXI6cGFtaXI='
    },
    method: 'post',
    params: { username, password, randomStr, code, grant_type, scope }
  })
}
export async function getFakeCaptcha(mobile) {
  return request(`/login/captcha?mobile=${mobile}`);
}
