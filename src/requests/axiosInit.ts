import {default as axios} from 'axios';

axios.defaults.timeout = 30000;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post.Accept = 'application/json';

export {axios};
