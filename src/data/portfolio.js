import butterflySeal from '../../images/butterfly.png';

export function asset(fileName) {
  if (fileName === 'butterfly.png') return butterflySeal;
  return `./images/${fileName}`;
}

export const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/lyzelmae133' },
  { label: 'Instagram', href: 'https://www.instagram.com/itz133zel' },
  { label: 'GitHub', href: 'https://github.com/lee231-gia' },
];
