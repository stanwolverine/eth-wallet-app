import Toast, { ToastOptions } from 'react-native-root-toast';

export const showToast = (msg: string, options?: ToastOptions) => {
  return Toast.show(msg, options || { position: 450 });
};
