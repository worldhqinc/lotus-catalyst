import { Image } from '~/components/image';
import { WistiaPlayer } from '~/components/wistia-player';
import { type mediaBanner } from '~/contentful/schema';

export function MediaBanner({ image, wistiaId }: mediaBanner['fields']) {
  let mediaElement: React.ReactNode = null;

  const mediaUrl = image?.fields.file.url;
  const absoluteMediaUrl = mediaUrl?.startsWith('//') ? `https:${mediaUrl}` : mediaUrl;

  if (image) {
    mediaElement = (
      <figure className="absolute inset-0 h-full w-full">
        <Image
          alt={image.fields.description ?? image.fields.title ?? ''}
          className="h-full w-full object-cover object-center"
          fill
          src={absoluteMediaUrl ?? ''}
        />
      </figure>
    );
  } else if (wistiaId) {
    mediaElement = (
      <figure className="bg-surface-image absolute inset-0 h-full w-full after:absolute after:inset-0 after:bg-black after:opacity-30">
        <WistiaPlayer pageType="page" wistiaMediaId={wistiaId} />
      </figure>
    );
  }

  return <section className="relative isolate min-h-[622px]">{mediaElement}</section>;
}
