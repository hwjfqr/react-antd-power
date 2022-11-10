import { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import { sendSmsCode, login } from './api';
// import { getCurrentUser } from '../../global-api';
import { CountdownButton } from 'ant-design-power';
import { useSetDocTitle } from '@/utils/hoots';

const TEL_REGEXP = /^1\d{10}$/;

type LoginArgsType = {
  username?: string;
  password?: string;
};
export default () => {
  useSetDocTitle('用户登录');

  const [mode, setMode] = useState<'accountLogin' | 'msgLogin'>('accountLogin');

  const [loginArgs, setLoginArgs] = useState<LoginArgsType>({});
  const [loading, setLoading] = useState({
    authCode: false,
  });

  // useEffect(() => {
  //   (async () => {
  //     const data = await getCurrentUser();
  //     if (Object.keys(data).length) history.push('/');
  //   })();
  // }, []);

  return (
    <div className={styles.login}>
      <div className={styles['login-container']}>
        <div className={styles['login-title']}>用户登录</div>
        <div>
          <Input
            placeholder={mode === 'accountLogin' ? '账号' : '手机号'}
            value={loginArgs.username}
            onChange={({ target: { value } }) =>
              setLoginArgs({
                ...loginArgs,
                username: value,
              })
            }
          ></Input>
        </div>
        <div className={styles['sms-code']}>
          <Input
            placeholder={mode === 'accountLogin' ? '密码' : '验证码'}
            type={mode === 'accountLogin' ? 'password' : 'text'}
            value={loginArgs.password}
            onChange={({ target: { value } }) =>
              setLoginArgs({
                ...loginArgs,
                password: value,
              })
            }
          ></Input>
          {mode === 'msgLogin' ? (
            <CountdownButton
              type="primary"
              style={{ width: 100, height: 40, marginLeft: 8 }}
              loading={loading.authCode}
              onClick={async (successCallback) => {
                const { username } = loginArgs;
                if (!(username && TEL_REGEXP.test(username))) {
                  message.warn('请输入正确的手机号！');
                  return;
                }
                setLoading({
                  ...loading,
                  authCode: true,
                });
                const b = await sendSmsCode(loginArgs.username as string);
                if (b) {
                  successCallback();
                  message.success('验证码发送成功！');
                }
                setLoading({
                  ...loading,
                  authCode: false,
                });
              }}
            />
          ) : null}
        </div>
        <div>
          <Button
            type="primary"
            block
            size="large"
            onClick={async () => {
              const { username, password } = loginArgs;
              if (mode === 'accountLogin') {
                if (!username) {
                  message.warn('请输入账号！');
                  return;
                }
                if (!password) {
                  message.warn('请输入密码！');
                  return;
                }
              } else {
                if (!(username && TEL_REGEXP.test(username))) {
                  message.warn('请输入正确的手机号！');
                  return;
                }
                if (!password) {
                  message.warn('请输入验证码！');
                  return;
                }
              }
              const b = await login(username, password);
              if (b) {
                message.success('登录成功！');
                history.push('/');
              }
            }}
          >
            登录
          </Button>
          <div style={{ paddingTop: 10, textAlign: 'right' }}>
            <a
              onClick={() => {
                if (mode === 'accountLogin') {
                  setMode('msgLogin');
                } else {
                  setMode('accountLogin');
                }
                setLoginArgs((d) => ({
                  ...d,
                  password: undefined,
                }));
              }}
            >
              {mode === 'accountLogin' ? '短信验证码登录' : '账号密码登录'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
