/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Image } from '~/components/image';
import { Link } from '~/components/link';
import LogoIconSvg from '~/images/Logo-icon.svg';
import LogoSvg from '~/images/Logo.svg';

interface Props {
  type?: 'full' | 'icon';
  width?: number;
  height?: number;
}

export function LogoLotus({ type = 'full', width = 100, height = 60 }: Props) {
  return (
    <Link className="relative" href="/" style={{ width, height }}>
      {type === 'icon' ? (
        <Image
          alt="Lotus"
          className="object-contain object-left"
          fill
          sizes={`${width}px`}
          src={LogoIconSvg}
        />
      ) : (
        <Image
          alt="Lotus"
          className="object-contain object-left"
          fill
          sizes={`${width}px`}
          src={LogoSvg}
        />
      )}
    </Link>
  );
}
