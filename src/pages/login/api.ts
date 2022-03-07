import request from '@/utils/request';

export async function sendSmsCode(phone: string) {
  const { isError } = await request('/sendSmsCode', {
    method: 'post',
    requestType: 'form',
    data: {
      phone,
    },
  });
  return !isError;
}

export async function login(phone: string, code: string) {
  const { isError } = await request('/login', {
    params: {
      phone,
      sms_code: code,
    },
  });
  return !isError;
}
