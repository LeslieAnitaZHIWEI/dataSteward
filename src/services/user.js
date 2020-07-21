import request from '@/utils/request';
export async function query() {
  return request('/users');
}
export async function queryCurrent() {
  return request('/admin/user/info',{
    headers:window.localStorage.getItem("ggToken")
  });
}
export async function queryNotices() {
  return request('/notices');
}
