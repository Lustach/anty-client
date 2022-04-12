export default {
  name: '',
  tags: [],
  platform: '',
  browserType: 'anty',
  mainWebsite: 'none',
  useragent: {
    mode: 'manual',
    value: null
  },
  webrtc: {
    mode: 'altered',
    ipAddress: null
  },
  webgl: {
    mode: 'real'
  },
  webglInfo: {
    mode: 'random',
    vendor: null,
    renderer: null
  },
  canvas: {
    mode: 'real'
  },
  notes: {
    content: '',
    color: 'blue',
    style: 'text',
    icon: null
  },
  timezone: {
    mode: 'auto',
    value: null
  },
  locale: {
    mode: 'auto',
    value: null
  },
  geolocation: {
    mode: 'auto',
    latitude: null,
    longitude: null,
    accuracy: null,
    marker: {
      lng: '',
      ltd: ''
    }
  },
  cpu: {
    mode: 'random',
    value: null
  },
  clientRect: {
    mode: 'real'
  },
  memory: {
    mode: 'random',
    value: null
  },
  screen: {
    mode: 'real',
    resolution: null,
    colorDepth: null
  },
  mediaDevices: {
    mode: 'real',
    audioInputs: null,
    videoInputs: null,
    audioOutputs: null
  },
  ports: {
    mode: 'protect',
    blacklist: '3389,5900,5800,7070,6568,5938'
  },
  doNotTrack: false,
  args: [],
  // userFields: [],
  // userFieldsForMainDialog: [],
  forEdit: false,
  status: 0,
  proxy: null,
  proxyId: 0,
  proxyMode: 0,
  proxyInput: '',
  proxyNew: {
    name: '',
    host: '',
    port: '',
    type: '',
    login: '',
    password: '',
    changeIpUrl: ''
  },
  cookies: null,
  platformVersion: null
}
