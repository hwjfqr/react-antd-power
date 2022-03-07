import { createContext } from 'react';
const Context = createContext<{ deviceType?: 'web' | 'mobile' }>({});
export default Context;
