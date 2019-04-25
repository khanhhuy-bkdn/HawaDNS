import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: 'Phê duyệt tài khoản',
  //   icon: 'fa fa-user-plus',
  //   link: '/pages/account-approval',
  // },
  {
    title: 'Người dùng',
    icon: 'fa fa-user',
    link: '/pages/buyer',
    // home: true,
  },
  {
    title: 'Người cung cấp gỗ',
    icon: 'fa fa-users',
    link: '/pages/provider',
  },
  {
    title: 'Liên hệ gián tiếp đóng góp',
    icon: 'fa fa-pencil-square-o',
    link: '/pages/contribute-information',
  },
  {
    title: 'Liên hệ gián tiếp cố định',
    icon: 'fa fa-pencil-square-o',
    link: '/pages/contribute-information/permanent',
  },
  // {
  //   title: 'Thông tin đóng góp',
  //   icon: 'fa fa-pencil-square-o',
  //   children: [
  //     {
  //       title: 'Liên hệ gián tiếp đóng góp',
  //       icon: 'fa fa-circle',
  //       link: '/pages/contribute-information',
  //     },
  //     {
  //       title: 'Liên hệ gián tiếp cố định',
  //       icon: 'fa fa-circle',
  //       link: '/pages/contribute-information/permanent',
  //     },
  //   ],
  // },
  {
    title: 'Phản hồi đánh giá',
    icon: 'fa fa-pencil',
    link: '/pages/dashboard',
  },
];
