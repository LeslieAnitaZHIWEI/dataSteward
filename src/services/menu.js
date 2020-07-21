import request from '@/utils/request';
export async function getMenu(params) {
    return request('/admin/menu', {
      method: 'get',
      data: params,
    });
  }