export default {
  profile: [
    {
      name: 'Account',
      snapPoints: ['50%'],
      href: '/(settings)/profile',
      icon: 'at-circle-outline',
    },

    {
      href: '',
      name: 'Password',
      icon: 'key-outline',
      snapPoints: ['50%'],
      content: null,
    },
    {
      href: '',
      content: null,
      snapPoints: ['50%'],
      icon: 'mail-outline',
      name: 'Email',
    },
  ],
  others: [
    {
      href: '',
      content: null,
      icon: 'people-outline',
      snapPoints: ['50%'],
      name: 'Community',
    },
    {
      href: '/(modals)/health',
      icon: 'pulse-outline',
      snapPoints: ['50%'],
      name: 'System Check',
    },
  ],
  language: [
    {
      href: '',
      content: null,
      icon: 'language-outline',
      snapPoints: ['50%'],
      name: 'Currency',
    },
    {
      href: '',
      content: null,
      icon: 'globe-outline',
      snapPoints: ['50%'],
      name: 'Language',
    },
  ],
  session: [
    {
      href: '',
      content: null,
      icon: 'recording-outline',
      snapPoints: ['50%'],
      name: 'Devices',
    },
  ],
  code: [
    {
      href: '',
      content: null,
      icon: 'code',
      snapPoints: ['50%'],
      name: 'Developer',
    },
    {
      href: '',
      content: null,
      snapPoints: ['50%'],
      name: 'Source code',
      icon: 'laptop-outline',
    },
  ],
  help: [
    {
      href: '',
      name: 'Contact support',
      icon: 'chatbox-ellipses-outline',
      snapPoints: ['50%'],
      content: null,
    },
    {
      href: '',
      content: null,
      icon: 'information-circle-outline',
      snapPoints: ['50%'],
      name: 'About',
    },
  ],
} as const;
