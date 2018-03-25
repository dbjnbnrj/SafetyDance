import { Constants } from 'expo'

const isDev = process.env.NODE_ENV === 'development'

const getHostMachine = () => {
  const ip = Constants.manifest.debuggerHost.split(':')[0]
  return `http://${ip}:8080`
}

export const theme = {
  colors: {
    blue: '#2892D7',
    blueDark: '#1B3B6F',
    blueLight: '#6DAEDB',
    green: '#00a33e',
    grayDark: '#121923',
    grayMedium: '#273242',
    gray: '#D3D3D3',
    grayLight: '#b7b7b7',
    red: '#f9576c'
  },
  space: 10
}

export default {
  api: isDev ? getHostMachine() : Constants.manifest.extra.api,
  verificationCodeLength: 4,
  theme,
  posts_per_page: 10,
  INVITE_MESSAGE: `hello world`
}
