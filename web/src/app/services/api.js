/*
Copyright 2015 Gravitational, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import $ from 'jQuery';
import localStorage from './localStorage';

const api = {

  put(path, data, withToken){
    return api.ajax({url: path, data: JSON.stringify(data), type: 'PUT'}, withToken);
  },

  post(path, data, withToken){
    return api.ajax({url: path, data: JSON.stringify(data), type: 'POST'}, withToken);
  },

  delete(path, data, withToken){
    return api.ajax({url: path, data: JSON.stringify(data), type: 'DELETE'}, withToken);
  },

  get(path){
    return api.ajax({url: path});
  },

  ajax(cfg, withToken = true){
    var defaultCfg = {            
      cache: false,
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      beforeSend: function (xhr) {                
        xhr.setRequestHeader('X-CSRF-Token', getXCSRFToken());
        if (withToken) {
          const bearerToken = localStorage.getBearerToken() || {};
          const { accessToken } = bearerToken;
          xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);                    
        }
      }
    }

    return $.ajax($.extend({}, defaultCfg, cfg));
  },

  getErrorText(err){
    let msg = 'Unknown error';                  
    
    if (err instanceof Error) {
      return err.message || msg;
    }
      
    if(err.responseJSON && err.responseJSON.message){
      return err.responseJSON.message;
    }
      
    if (err.responseJSON && err.responseJSON.error) {
      return err.responseJSON.error.message || msg;
    }
    
    if (err.responseText) {
      return err.responseText;
    }

    return msg;
  }    
}

const getXCSRFToken = () => {
  const metaTag = document.querySelector('[name=grv_csrf_token]'); 
  return metaTag ? metaTag.content : ''
}

export default api;
