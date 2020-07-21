import request from '@/utils/request';
import host from '../host'
export async function getStatistics(params) {
    return request(host+'/dsdemand/statistics', {
      method: 'get',
      data: params,
    });
  }
  export async function getDsdemand(params) {
    return request(host+'/dsdemand/page', {
      method: 'get',
      params: params,
    });
  }
  export async function getDspushmedia(params) {
    return request(host+'/dspushmedia/list', {
      method: 'get',
      params: params,
    });
  }
  export async function addDsdemand(params) {
    return request(host+'/dsdemand', {
      method: 'post',
      data: params,
    });
  }
  export async function getDetail(params) {
    return request(host+'/dsdemand/'+params.id, {
      method: 'get',
      // data: params,
    });
  }
  export async function getCategory(params) {
    return request(host+'/dstagcategory/tree', {
      method: 'get',
      // data: params,
    });
  }
  export async function getDstag(params) {
    return request(host+'/dstag/list', {
      method: 'get',
      params: params,
    });
  }

  export async function areaPredictNum(params) {
    return request(host+'/dsdemand/areaPredictNum', {
      method: 'post',
      data: params,
    });
  }

  export async function dsproductkeyword(params) {
    return request(host+'/dsproductkeyword/list', {
      method: 'get',
      params: params,
    });
  }
  export async function isAdMaster(params) {
    return request(host+'/dsdemand/isAdMaster', {
      method: 'get',
      params: params,
    });
  }

  
  export async function customizeTag(params) {
    return request(host+'/dstag/customizeTag', {
      method: 'post',
      params: params,
    });
  }
  
  export async function deleteDsdemand(params) {
    return request(host+'/dsdemand/'+params.id, {
      method: 'delete',
      // data: params,
    });
  }
  export async function process(params) {
    return request(host+'/dsdemand/process', {
      method: 'post',
      data: params,
    });
  }
  export async function downloadDemand(params) {
    return request(host+'/dsdemand/download', {
      method: 'post',
      params: params,
      responseType: 'blob',
      // getResponse:true
    });
  }
  