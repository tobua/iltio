import React from 'react'
import { Label } from '../label'
import { Variables, Styles, ComponentTypes } from '../types'

// Generated with generate-country-map.mjs (a few countries with multiple prefix skipped for now).
const countries = {
  af: { prefix: '+93', name: 'Afghanistan', abbreviation: 'af', flag: '🇦🇫' },
  al: { prefix: '+355', name: 'Albania', abbreviation: 'al', flag: '🇦🇱' },
  dz: { prefix: '+213', name: 'Algeria', abbreviation: 'dz', flag: '🇩🇿' },
  as: { prefix: '+1684', name: 'American Samoa', abbreviation: 'as', flag: '🇦🇸' },
  ad: { prefix: '+376', name: 'Andorra', abbreviation: 'ad', flag: '🇦🇩' },
  ao: { prefix: '+244', name: 'Angola', abbreviation: 'ao', flag: '🇦🇴' },
  ai: { prefix: '+1264', name: 'Anguilla', abbreviation: 'ai', flag: '🇦🇮' },
  ag: { prefix: '+1268', name: 'Antigua and Barbuda', abbreviation: 'ag', flag: '🇦🇬' },
  ar: { prefix: '+54', name: 'Argentina', abbreviation: 'ar', flag: '🇦🇷' },
  am: { prefix: '+374', name: 'Armenia', abbreviation: 'am', flag: '🇦🇲' },
  aw: { prefix: '+297', name: 'Aruba', abbreviation: 'aw', flag: '🇦🇼' },
  au: { prefix: '+61', name: 'Australia', abbreviation: 'au', flag: '🇦🇺' },
  at: { prefix: '+43', name: 'Austria', abbreviation: 'at', flag: '🇦🇹' },
  az: { prefix: '+994', name: 'Azerbaijan', abbreviation: 'az', flag: '🇦🇿' },
  bs: { prefix: '+1242', name: 'Bahamas', abbreviation: 'bs', flag: '🇧🇸' },
  bh: { prefix: '+973', name: 'Bahrain', abbreviation: 'bh', flag: '🇧🇭' },
  bd: { prefix: '+880', name: 'Bangladesh', abbreviation: 'bd', flag: '🇧🇩' },
  bb: { prefix: '+1246', name: 'Barbados', abbreviation: 'bb', flag: '🇧🇧' },
  by: { prefix: '+375', name: 'Belarus', abbreviation: 'by', flag: '🇧🇾' },
  be: { prefix: '+32', name: 'Belgium', abbreviation: 'be', flag: '🇧🇪' },
  bz: { prefix: '+501', name: 'Belize', abbreviation: 'bz', flag: '🇧🇿' },
  bj: { prefix: '+229', name: 'Benin', abbreviation: 'bj', flag: '🇧🇯' },
  bm: { prefix: '+1441', name: 'Bermuda', abbreviation: 'bm', flag: '🇧🇲' },
  bt: { prefix: '+975', name: 'Bhutan', abbreviation: 'bt', flag: '🇧🇹' },
  bo: { prefix: '+591', name: 'Bolivia', abbreviation: 'bo', flag: '🇧🇴' },
  ba: { prefix: '+387', name: 'Bosnia and Herzegovina', abbreviation: 'ba', flag: '🇧🇦' },
  bw: { prefix: '+267', name: 'Botswana', abbreviation: 'bw', flag: '🇧🇼' },
  br: { prefix: '+55', name: 'Brazil', abbreviation: 'br', flag: '🇧🇷' },
  io: { prefix: '+246', name: 'British Indian Ocean Territory', abbreviation: 'io', flag: '🇮🇴' },
  vg: { prefix: '+1284', name: 'British Virgin Islands', abbreviation: 'vg', flag: '🇻🇬' },
  bn: { prefix: '+673', name: 'Brunei', abbreviation: 'bn', flag: '🇧🇳' },
  bg: { prefix: '+359', name: 'Bulgaria', abbreviation: 'bg', flag: '🇧🇬' },
  bf: { prefix: '+226', name: 'Burkina Faso', abbreviation: 'bf', flag: '🇧🇫' },
  bi: { prefix: '+257', name: 'Burundi', abbreviation: 'bi', flag: '🇧🇮' },
  kh: { prefix: '+855', name: 'Cambodia', abbreviation: 'kh', flag: '🇰🇭' },
  cm: { prefix: '+237', name: 'Cameroon', abbreviation: 'cm', flag: '🇨🇲' },
  ca: { prefix: '+1', name: 'Canada', abbreviation: 'ca', flag: '🇨🇦' },
  cv: { prefix: '+238', name: 'Cape Verde', abbreviation: 'cv', flag: '🇨🇻' },
  bq: { prefix: '+599', name: 'Caribbean Netherlands', abbreviation: 'bq', flag: '🇧🇶' },
  ky: { prefix: '+1345', name: 'Cayman Islands', abbreviation: 'ky', flag: '🇰🇾' },
  cf: { prefix: '+236', name: 'Central African Republic', abbreviation: 'cf', flag: '🇨🇫' },
  td: { prefix: '+235', name: 'Chad', abbreviation: 'td', flag: '🇹🇩' },
  cl: { prefix: '+56', name: 'Chile', abbreviation: 'cl', flag: '🇨🇱' },
  cn: { prefix: '+86', name: 'China', abbreviation: 'cn', flag: '🇨🇳' },
  cx: { prefix: '+61', name: 'Christmas Island', abbreviation: 'cx', flag: '🇨🇽' },
  cc: { prefix: '+61', name: 'Cocos (Keeling) Islands', abbreviation: 'cc', flag: '🇨🇨' },
  co: { prefix: '+57', name: 'Colombia', abbreviation: 'co', flag: '🇨🇴' },
  km: { prefix: '+269', name: 'Comoros', abbreviation: 'km', flag: '🇰🇲' },
  ck: { prefix: '+682', name: 'Cook Islands', abbreviation: 'ck', flag: '🇨🇰' },
  cr: { prefix: '+506', name: 'Costa Rica', abbreviation: 'cr', flag: '🇨🇷' },
  hr: { prefix: '+385', name: 'Croatia', abbreviation: 'hr', flag: '🇭🇷' },
  cu: { prefix: '+53', name: 'Cuba', abbreviation: 'cu', flag: '🇨🇺' },
  cw: { prefix: '+5999', name: 'Curaçao', abbreviation: 'cw', flag: '🇨🇼' },
  cy: { prefix: '+357', name: 'Cyprus', abbreviation: 'cy', flag: '🇨🇾' },
  cz: { prefix: '+420', name: 'Czechia', abbreviation: 'cz', flag: '🇨🇿' },
  cd: { prefix: '+243', name: 'DR Congo', abbreviation: 'cd', flag: '🇨🇩' },
  dk: { prefix: '+45', name: 'Denmark', abbreviation: 'dk', flag: '🇩🇰' },
  dj: { prefix: '+253', name: 'Djibouti', abbreviation: 'dj', flag: '🇩🇯' },
  dm: { prefix: '+1767', name: 'Dominica', abbreviation: 'dm', flag: '🇩🇲' },
  ec: { prefix: '+593', name: 'Ecuador', abbreviation: 'ec', flag: '🇪🇨' },
  eg: { prefix: '+20', name: 'Egypt', abbreviation: 'eg', flag: '🇪🇬' },
  sv: { prefix: '+503', name: 'El Salvador', abbreviation: 'sv', flag: '🇸🇻' },
  gq: { prefix: '+240', name: 'Equatorial Guinea', abbreviation: 'gq', flag: '🇬🇶' },
  er: { prefix: '+291', name: 'Eritrea', abbreviation: 'er', flag: '🇪🇷' },
  ee: { prefix: '+372', name: 'Estonia', abbreviation: 'ee', flag: '🇪🇪' },
  sz: { prefix: '+268', name: 'Eswatini', abbreviation: 'sz', flag: '🇸🇿' },
  et: { prefix: '+251', name: 'Ethiopia', abbreviation: 'et', flag: '🇪🇹' },
  fk: { prefix: '+500', name: 'Falkland Islands', abbreviation: 'fk', flag: '🇫🇰' },
  fo: { prefix: '+298', name: 'Faroe Islands', abbreviation: 'fo', flag: '🇫🇴' },
  fj: { prefix: '+679', name: 'Fiji', abbreviation: 'fj', flag: '🇫🇯' },
  fi: { prefix: '+358', name: 'Finland', abbreviation: 'fi', flag: '🇫🇮' },
  fr: { prefix: '+33', name: 'France', abbreviation: 'fr', flag: '🇫🇷' },
  gf: { prefix: '+594', name: 'French Guiana', abbreviation: 'gf', flag: '🇬🇫' },
  pf: { prefix: '+689', name: 'French Polynesia', abbreviation: 'pf', flag: '🇵🇫' },
  ga: { prefix: '+241', name: 'Gabon', abbreviation: 'ga', flag: '🇬🇦' },
  gm: { prefix: '+220', name: 'Gambia', abbreviation: 'gm', flag: '🇬🇲' },
  ge: { prefix: '+995', name: 'Georgia', abbreviation: 'ge', flag: '🇬🇪' },
  de: { prefix: '+49', name: 'Germany', abbreviation: 'de', flag: '🇩🇪' },
  gh: { prefix: '+233', name: 'Ghana', abbreviation: 'gh', flag: '🇬🇭' },
  gi: { prefix: '+350', name: 'Gibraltar', abbreviation: 'gi', flag: '🇬🇮' },
  gr: { prefix: '+30', name: 'Greece', abbreviation: 'gr', flag: '🇬🇷' },
  gl: { prefix: '+299', name: 'Greenland', abbreviation: 'gl', flag: '🇬🇱' },
  gd: { prefix: '+1473', name: 'Grenada', abbreviation: 'gd', flag: '🇬🇩' },
  gp: { prefix: '+590', name: 'Guadeloupe', abbreviation: 'gp', flag: '🇬🇵' },
  gu: { prefix: '+1671', name: 'Guam', abbreviation: 'gu', flag: '🇬🇺' },
  gt: { prefix: '+502', name: 'Guatemala', abbreviation: 'gt', flag: '🇬🇹' },
  gg: { prefix: '+44', name: 'Guernsey', abbreviation: 'gg', flag: '🇬🇬' },
  gn: { prefix: '+224', name: 'Guinea', abbreviation: 'gn', flag: '🇬🇳' },
  gw: { prefix: '+245', name: 'Guinea-Bissau', abbreviation: 'gw', flag: '🇬🇼' },
  gy: { prefix: '+592', name: 'Guyana', abbreviation: 'gy', flag: '🇬🇾' },
  ht: { prefix: '+509', name: 'Haiti', abbreviation: 'ht', flag: '🇭🇹' },
  hn: { prefix: '+504', name: 'Honduras', abbreviation: 'hn', flag: '🇭🇳' },
  hk: { prefix: '+852', name: 'Hong Kong', abbreviation: 'hk', flag: '🇭🇰' },
  hu: { prefix: '+36', name: 'Hungary', abbreviation: 'hu', flag: '🇭🇺' },
  is: { prefix: '+354', name: 'Iceland', abbreviation: 'is', flag: '🇮🇸' },
  in: { prefix: '+91', name: 'India', abbreviation: 'in', flag: '🇮🇳' },
  id: { prefix: '+62', name: 'Indonesia', abbreviation: 'id', flag: '🇮🇩' },
  ir: { prefix: '+98', name: 'Iran', abbreviation: 'ir', flag: '🇮🇷' },
  iq: { prefix: '+964', name: 'Iraq', abbreviation: 'iq', flag: '🇮🇶' },
  ie: { prefix: '+353', name: 'Ireland', abbreviation: 'ie', flag: '🇮🇪' },
  im: { prefix: '+44', name: 'Isle of Man', abbreviation: 'im', flag: '🇮🇲' },
  il: { prefix: '+972', name: 'Israel', abbreviation: 'il', flag: '🇮🇱' },
  it: { prefix: '+39', name: 'Italy', abbreviation: 'it', flag: '🇮🇹' },
  ci: { prefix: '+225', name: 'Ivory Coast', abbreviation: 'ci', flag: '🇨🇮' },
  jm: { prefix: '+1876', name: 'Jamaica', abbreviation: 'jm', flag: '🇯🇲' },
  jp: { prefix: '+81', name: 'Japan', abbreviation: 'jp', flag: '🇯🇵' },
  je: { prefix: '+44', name: 'Jersey', abbreviation: 'je', flag: '🇯🇪' },
  jo: { prefix: '+962', name: 'Jordan', abbreviation: 'jo', flag: '🇯🇴' },
  kz: { prefix: '+7', name: 'Kazakhstan', abbreviation: 'kz', flag: '🇰🇿' },
  ke: { prefix: '+254', name: 'Kenya', abbreviation: 'ke', flag: '🇰🇪' },
  ki: { prefix: '+686', name: 'Kiribati', abbreviation: 'ki', flag: '🇰🇮' },
  xk: { prefix: '+383', name: 'Kosovo', abbreviation: 'xk', flag: '🇽🇰' },
  kw: { prefix: '+965', name: 'Kuwait', abbreviation: 'kw', flag: '🇰🇼' },
  kg: { prefix: '+996', name: 'Kyrgyzstan', abbreviation: 'kg', flag: '🇰🇬' },
  la: { prefix: '+856', name: 'Laos', abbreviation: 'la', flag: '🇱🇦' },
  lv: { prefix: '+371', name: 'Latvia', abbreviation: 'lv', flag: '🇱🇻' },
  lb: { prefix: '+961', name: 'Lebanon', abbreviation: 'lb', flag: '🇱🇧' },
  ls: { prefix: '+266', name: 'Lesotho', abbreviation: 'ls', flag: '🇱🇸' },
  lr: { prefix: '+231', name: 'Liberia', abbreviation: 'lr', flag: '🇱🇷' },
  ly: { prefix: '+218', name: 'Libya', abbreviation: 'ly', flag: '🇱🇾' },
  li: { prefix: '+423', name: 'Liechtenstein', abbreviation: 'li', flag: '🇱🇮' },
  lt: { prefix: '+370', name: 'Lithuania', abbreviation: 'lt', flag: '🇱🇹' },
  lu: { prefix: '+352', name: 'Luxembourg', abbreviation: 'lu', flag: '🇱🇺' },
  mo: { prefix: '+853', name: 'Macau', abbreviation: 'mo', flag: '🇲🇴' },
  mk: { prefix: '+389', name: 'Macedonia', abbreviation: 'mk', flag: '🇲🇰' },
  mg: { prefix: '+261', name: 'Madagascar', abbreviation: 'mg', flag: '🇲🇬' },
  mw: { prefix: '+265', name: 'Malawi', abbreviation: 'mw', flag: '🇲🇼' },
  my: { prefix: '+60', name: 'Malaysia', abbreviation: 'my', flag: '🇲🇾' },
  mv: { prefix: '+960', name: 'Maldives', abbreviation: 'mv', flag: '🇲🇻' },
  ml: { prefix: '+223', name: 'Mali', abbreviation: 'ml', flag: '🇲🇱' },
  mt: { prefix: '+356', name: 'Malta', abbreviation: 'mt', flag: '🇲🇹' },
  mh: { prefix: '+692', name: 'Marshall Islands', abbreviation: 'mh', flag: '🇲🇭' },
  mq: { prefix: '+596', name: 'Martinique', abbreviation: 'mq', flag: '🇲🇶' },
  mr: { prefix: '+222', name: 'Mauritania', abbreviation: 'mr', flag: '🇲🇷' },
  mu: { prefix: '+230', name: 'Mauritius', abbreviation: 'mu', flag: '🇲🇺' },
  yt: { prefix: '+262', name: 'Mayotte', abbreviation: 'yt', flag: '🇾🇹' },
  mx: { prefix: '+52', name: 'Mexico', abbreviation: 'mx', flag: '🇲🇽' },
  fm: { prefix: '+691', name: 'Micronesia', abbreviation: 'fm', flag: '🇫🇲' },
  md: { prefix: '+373', name: 'Moldova', abbreviation: 'md', flag: '🇲🇩' },
  mc: { prefix: '+377', name: 'Monaco', abbreviation: 'mc', flag: '🇲🇨' },
  mn: { prefix: '+976', name: 'Mongolia', abbreviation: 'mn', flag: '🇲🇳' },
  me: { prefix: '+382', name: 'Montenegro', abbreviation: 'me', flag: '🇲🇪' },
  ms: { prefix: '+1664', name: 'Montserrat', abbreviation: 'ms', flag: '🇲🇸' },
  ma: { prefix: '+212', name: 'Morocco', abbreviation: 'ma', flag: '🇲🇦' },
  mz: { prefix: '+258', name: 'Mozambique', abbreviation: 'mz', flag: '🇲🇿' },
  mm: { prefix: '+95', name: 'Myanmar', abbreviation: 'mm', flag: '🇲🇲' },
  na: { prefix: '+264', name: 'Namibia', abbreviation: 'na', flag: '🇳🇦' },
  nr: { prefix: '+674', name: 'Nauru', abbreviation: 'nr', flag: '🇳🇷' },
  np: { prefix: '+977', name: 'Nepal', abbreviation: 'np', flag: '🇳🇵' },
  nl: { prefix: '+31', name: 'Netherlands', abbreviation: 'nl', flag: '🇳🇱' },
  nc: { prefix: '+687', name: 'New Caledonia', abbreviation: 'nc', flag: '🇳🇨' },
  nz: { prefix: '+64', name: 'New Zealand', abbreviation: 'nz', flag: '🇳🇿' },
  ni: { prefix: '+505', name: 'Nicaragua', abbreviation: 'ni', flag: '🇳🇮' },
  ne: { prefix: '+227', name: 'Niger', abbreviation: 'ne', flag: '🇳🇪' },
  ng: { prefix: '+234', name: 'Nigeria', abbreviation: 'ng', flag: '🇳🇬' },
  nu: { prefix: '+683', name: 'Niue', abbreviation: 'nu', flag: '🇳🇺' },
  nf: { prefix: '+672', name: 'Norfolk Island', abbreviation: 'nf', flag: '🇳🇫' },
  kp: { prefix: '+850', name: 'North Korea', abbreviation: 'kp', flag: '🇰🇵' },
  mp: { prefix: '+1670', name: 'Northern Mariana Islands', abbreviation: 'mp', flag: '🇲🇵' },
  no: { prefix: '+47', name: 'Norway', abbreviation: 'no', flag: '🇳🇴' },
  om: { prefix: '+968', name: 'Oman', abbreviation: 'om', flag: '🇴🇲' },
  pk: { prefix: '+92', name: 'Pakistan', abbreviation: 'pk', flag: '🇵🇰' },
  pw: { prefix: '+680', name: 'Palau', abbreviation: 'pw', flag: '🇵🇼' },
  ps: { prefix: '+970', name: 'Palestine', abbreviation: 'ps', flag: '🇵🇸' },
  pa: { prefix: '+507', name: 'Panama', abbreviation: 'pa', flag: '🇵🇦' },
  pg: { prefix: '+675', name: 'Papua New Guinea', abbreviation: 'pg', flag: '🇵🇬' },
  py: { prefix: '+595', name: 'Paraguay', abbreviation: 'py', flag: '🇵🇾' },
  pe: { prefix: '+51', name: 'Peru', abbreviation: 'pe', flag: '🇵🇪' },
  ph: { prefix: '+63', name: 'Philippines', abbreviation: 'ph', flag: '🇵🇭' },
  pn: { prefix: '+64', name: 'Pitcairn Islands', abbreviation: 'pn', flag: '🇵🇳' },
  pl: { prefix: '+48', name: 'Poland', abbreviation: 'pl', flag: '🇵🇱' },
  pt: { prefix: '+351', name: 'Portugal', abbreviation: 'pt', flag: '🇵🇹' },
  qa: { prefix: '+974', name: 'Qatar', abbreviation: 'qa', flag: '🇶🇦' },
  cg: { prefix: '+242', name: 'Republic of the Congo', abbreviation: 'cg', flag: '🇨🇬' },
  ro: { prefix: '+40', name: 'Romania', abbreviation: 'ro', flag: '🇷🇴' },
  ru: { prefix: '+7', name: 'Russia', abbreviation: 'ru', flag: '🇷🇺' },
  rw: { prefix: '+250', name: 'Rwanda', abbreviation: 'rw', flag: '🇷🇼' },
  re: { prefix: '+262', name: 'Réunion', abbreviation: 're', flag: '🇷🇪' },
  bl: { prefix: '+590', name: 'Saint Barthélemy', abbreviation: 'bl', flag: '🇧🇱' },
  kn: { prefix: '+1869', name: 'Saint Kitts and Nevis', abbreviation: 'kn', flag: '🇰🇳' },
  lc: { prefix: '+1758', name: 'Saint Lucia', abbreviation: 'lc', flag: '🇱🇨' },
  mf: { prefix: '+590', name: 'Saint Martin', abbreviation: 'mf', flag: '🇲🇫' },
  pm: { prefix: '+508', name: 'Saint Pierre and Miquelon', abbreviation: 'pm', flag: '🇵🇲' },
  vc: { prefix: '+1784', name: 'Saint Vincent and the Grenadines', abbreviation: 'vc', flag: '🇻🇨' },
  ws: { prefix: '+685', name: 'Samoa', abbreviation: 'ws', flag: '🇼🇸' },
  sm: { prefix: '+378', name: 'San Marino', abbreviation: 'sm', flag: '🇸🇲' },
  sa: { prefix: '+966', name: 'Saudi Arabia', abbreviation: 'sa', flag: '🇸🇦' },
  sn: { prefix: '+221', name: 'Senegal', abbreviation: 'sn', flag: '🇸🇳' },
  rs: { prefix: '+381', name: 'Serbia', abbreviation: 'rs', flag: '🇷🇸' },
  sc: { prefix: '+248', name: 'Seychelles', abbreviation: 'sc', flag: '🇸🇨' },
  sl: { prefix: '+232', name: 'Sierra Leone', abbreviation: 'sl', flag: '🇸🇱' },
  sg: { prefix: '+65', name: 'Singapore', abbreviation: 'sg', flag: '🇸🇬' },
  sx: { prefix: '+1721', name: 'Sint Maarten', abbreviation: 'sx', flag: '🇸🇽' },
  sk: { prefix: '+421', name: 'Slovakia', abbreviation: 'sk', flag: '🇸🇰' },
  si: { prefix: '+386', name: 'Slovenia', abbreviation: 'si', flag: '🇸🇮' },
  sb: { prefix: '+677', name: 'Solomon Islands', abbreviation: 'sb', flag: '🇸🇧' },
  so: { prefix: '+252', name: 'Somalia', abbreviation: 'so', flag: '🇸🇴' },
  za: { prefix: '+27', name: 'South Africa', abbreviation: 'za', flag: '🇿🇦' },
  gs: { prefix: '+500', name: 'South Georgia', abbreviation: 'gs', flag: '🇬🇸' },
  kr: { prefix: '+82', name: 'South Korea', abbreviation: 'kr', flag: '🇰🇷' },
  ss: { prefix: '+211', name: 'South Sudan', abbreviation: 'ss', flag: '🇸🇸' },
  es: { prefix: '+34', name: 'Spain', abbreviation: 'es', flag: '🇪🇸' },
  lk: { prefix: '+94', name: 'Sri Lanka', abbreviation: 'lk', flag: '🇱🇰' },
  sd: { prefix: '+249', name: 'Sudan', abbreviation: 'sd', flag: '🇸🇩' },
  sr: { prefix: '+597', name: 'Suriname', abbreviation: 'sr', flag: '🇸🇷' },
  sj: { prefix: '+4779', name: 'Svalbard and Jan Mayen', abbreviation: 'sj', flag: '🇸🇯' },
  se: { prefix: '+46', name: 'Sweden', abbreviation: 'se', flag: '🇸🇪' },
  ch: { prefix: '+41', name: 'Switzerland', abbreviation: 'ch', flag: '🇨🇭' },
  sy: { prefix: '+963', name: 'Syria', abbreviation: 'sy', flag: '🇸🇾' },
  st: { prefix: '+239', name: 'São Tomé and Príncipe', abbreviation: 'st', flag: '🇸🇹' },
  tw: { prefix: '+886', name: 'Taiwan', abbreviation: 'tw', flag: '🇹🇼' },
  tj: { prefix: '+992', name: 'Tajikistan', abbreviation: 'tj', flag: '🇹🇯' },
  tz: { prefix: '+255', name: 'Tanzania', abbreviation: 'tz', flag: '🇹🇿' },
  th: { prefix: '+66', name: 'Thailand', abbreviation: 'th', flag: '🇹🇭' },
  tl: { prefix: '+670', name: 'Timor-Leste', abbreviation: 'tl', flag: '🇹🇱' },
  tg: { prefix: '+228', name: 'Togo', abbreviation: 'tg', flag: '🇹🇬' },
  tk: { prefix: '+690', name: 'Tokelau', abbreviation: 'tk', flag: '🇹🇰' },
  to: { prefix: '+676', name: 'Tonga', abbreviation: 'to', flag: '🇹🇴' },
  tt: { prefix: '+1868', name: 'Trinidad and Tobago', abbreviation: 'tt', flag: '🇹🇹' },
  tn: { prefix: '+216', name: 'Tunisia', abbreviation: 'tn', flag: '🇹🇳' },
  tr: { prefix: '+90', name: 'Turkey', abbreviation: 'tr', flag: '🇹🇷' },
  tm: { prefix: '+993', name: 'Turkmenistan', abbreviation: 'tm', flag: '🇹🇲' },
  tc: { prefix: '+1649', name: 'Turks and Caicos Islands', abbreviation: 'tc', flag: '🇹🇨' },
  tv: { prefix: '+688', name: 'Tuvalu', abbreviation: 'tv', flag: '🇹🇻' },
  ug: { prefix: '+256', name: 'Uganda', abbreviation: 'ug', flag: '🇺🇬' },
  ua: { prefix: '+380', name: 'Ukraine', abbreviation: 'ua', flag: '🇺🇦' },
  ae: { prefix: '+971', name: 'United Arab Emirates', abbreviation: 'ae', flag: '🇦🇪' },
  gb: { prefix: '+44', name: 'United Kingdom', abbreviation: 'gb', flag: '🇬🇧' },
  us: { prefix: '+1', name: 'United States', abbreviation: 'us', flag: '🇺🇸' },
  vi: { prefix: '+1340', name: 'United States Virgin Islands', abbreviation: 'vi', flag: '🇻🇮' },
  uy: { prefix: '+598', name: 'Uruguay', abbreviation: 'uy', flag: '🇺🇾' },
  uz: { prefix: '+998', name: 'Uzbekistan', abbreviation: 'uz', flag: '🇺🇿' },
  vu: { prefix: '+678', name: 'Vanuatu', abbreviation: 'vu', flag: '🇻🇺' },
  ve: { prefix: '+58', name: 'Venezuela', abbreviation: 've', flag: '🇻🇪' },
  vn: { prefix: '+84', name: 'Vietnam', abbreviation: 'vn', flag: '🇻🇳' },
  wf: { prefix: '+681', name: 'Wallis and Futuna', abbreviation: 'wf', flag: '🇼🇫' },
  eh: { prefix: '+212', name: 'Western Sahara', abbreviation: 'eh', flag: '🇪🇭' },
  ye: { prefix: '+967', name: 'Yemen', abbreviation: 'ye', flag: '🇾🇪' },
  zm: { prefix: '+260', name: 'Zambia', abbreviation: 'zm', flag: '🇿🇲' },
  zw: { prefix: '+263', name: 'Zimbabwe', abbreviation: 'zw', flag: '🇿🇼' },
  ax: { prefix: '+358', name: 'Åland Islands', abbreviation: 'ax', flag: '🇦🇽' },
}

export const getNumberCountryPrefix = (countryCode: string) => countries[countryCode].prefix

interface Props {
  phoneValid: boolean
  variables: Variables
  countryCode: string
  setCountryCode: Function
  phone: string
  setPhone: Function
  Components: ComponentTypes
  style: Styles
}

export function Phone({
  phoneValid,
  variables,
  countryCode,
  setCountryCode,
  phone,
  setPhone,
  Components,
  style,
}: Props) {
  return (
    <Components.PhoneWrapper style={style.phoneWrapper} variables={variables} valid={phoneValid}>
      <Components.PhoneFlag style={style.phoneFlag} variables={variables}>
        {countries[countryCode].flag}
      </Components.PhoneFlag>
      <Components.PhonePrefix
        aria-label={Label.phonePrefix}
        style={style.phonePrefix}
        variables={variables}
      >
        {countries[countryCode].prefix}
      </Components.PhonePrefix>
      <Components.PhoneSelect
        aria-label={Label.phoneCountry}
        style={style.phoneSelect}
        value={countryCode}
        variables={variables}
        onChange={(event) => setCountryCode(event.target.value)}
      >
        {Object.values(countries).map((country) => (
          <Components.PhoneOption
            key={country.abbreviation}
            value={country.abbreviation}
            style={style.phoneOption}
            variables={variables}
          >
            {country.name}
          </Components.PhoneOption>
        ))}
      </Components.PhoneSelect>
      <Components.PhoneInput
        aria-label={Label.inputPhone}
        aria-invalid={!phoneValid}
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        style={style.phoneInput}
        required
        valid={phoneValid}
        placeholder="Phone"
        type="tel"
      />
    </Components.PhoneWrapper>
  )
}
