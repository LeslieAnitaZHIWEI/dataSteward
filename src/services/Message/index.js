import request from '@/utils/request';
import host from '../host'
export async function getMessage(params) {
    return request(host+'/dsmessage/page', {
      method: 'get',
      params: params,
    });
  }
  export async function allreadMessage(params) {
    return request(host+'/dsmessage/allread', {
      method: 'put',
      data: params,
    });
  }
  export async function deleteMessage(params) {
    return request(host+'/dsmessage/'+params.id, {
      method: 'delete',
    });
  }
  export async function getMessageDetail(params) {
    return request(host+'/dsmessage/'+params.id, {
      method: 'get',
    });
  }