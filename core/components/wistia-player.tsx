'use client';

import { clsx } from 'clsx';
import { PauseIcon, PlayIcon } from 'lucide-react';
import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/vibes/soul/primitives/button';
import { Image } from '~/components/image';

declare global {
  interface Window {
    _wq?: unknown[];
    wistiaVideos: Record<
      string,
      {
        time: (seconds: number) => void;
        play: () => void;
        pause: () => void;
        bind: (event: string, callback: (time: number) => void) => void;
        unbind: (event: string) => void;
      }
    >;
  }
}

// Define the video segments for each accordion item
interface VideoSegment {
  start: number;
  end: number;
}

export function WistiaPlayer({
  activeId,
  anchorIds = [],
  pageType = 'product',
  buttonPosition = 'right',
  wistiaMediaId,
  wistiaMediaSegments,
}: {
  activeId?: string;
  anchorIds?: string[];
  pageType?: 'product' | 'page' | 'tutorial';
  buttonPosition?: 'right' | 'left';
  wistiaMediaId?: string | null;
  wistiaMediaSegments?: string[] | null;
}) {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoInitializedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const userPausedRef = useRef(false);

  const videoSegments = useRef<Record<string, VideoSegment>>({});

  // Get current video instance
  const getVideo = useCallback(() => {
    if (!wistiaMediaId) return null;

    return window.wistiaVideos[wistiaMediaId];
  }, [wistiaMediaId]);

  // Setup video segments
  useEffect(() => {
    // Only setup segments for product pages
    if (pageType === 'product') {
      // Validate and parse wistiaMediaSegments
      const validSegments = (wistiaMediaSegments || [])
        .map((segment) => parseFloat(segment))
        .filter((time) => Number.isFinite(time));

      // Create segments for each accordion item
      const segmentsMap: Record<string, VideoSegment> = {};

      anchorIds.forEach((id, index) => {
        const startTime = index === 0 ? 0 : validSegments[index - 1] || 0;
        const endTime = validSegments[index] || Number.MAX_SAFE_INTEGER;

        segmentsMap[id] = {
          start: startTime,
          end: endTime,
        };
      });

      videoSegments.current = segmentsMap;
    }
  }, [anchorIds, wistiaMediaSegments, pageType]);

  // Get current segment based on active accordion item
  const getCurrentSegment = useCallback(() => {
    if (pageType !== 'product') return undefined;

    return activeId ? videoSegments.current[activeId] : undefined;
  }, [activeId, pageType]);

  // Function to play the current segment
  const playCurrentSegment = useCallback(() => {
    const video = getVideo();

    if (!video) return;

    if (pageType !== 'product') {
      video.play();

      return;
    }

    const currentSegment = getCurrentSegment();

    if (!currentSegment) return;

    // Clean up any previous timechange bindings
    video.unbind('timechange');

    // Set video to segment start time
    video.time(currentSegment.start);

    // Add a binding to pause the video at the end time
    video.bind('timechange', (time) => {
      if (time >= currentSegment.end) {
        video.pause();
      }
    });

    // Play the video segment
    video.play();
  }, [getCurrentSegment, getVideo, pageType]);

  const handlePlay = useCallback(() => {
    const video = getVideo();

    if (!video) return;
    video.play();
    setIsPlaying(true);
    userPausedRef.current = false;
  }, [getVideo]);

  const handlePause = useCallback(() => {
    const video = getVideo();

    if (!video) return;
    video.pause();
    setIsPlaying(false);
    userPausedRef.current = true;
  }, [getVideo]);

  // Load Wistia scripts when component mounts
  useEffect(() => {
    if (!wistiaMediaId) return;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    window.wistiaVideos = window.wistiaVideos || {};

    // eslint-disable-next-line no-underscore-dangle
    window._wq = window._wq || [];
    // eslint-disable-next-line no-underscore-dangle
    window._wq.push({
      id: wistiaMediaId,
      options: {
        autoplay: pageType !== 'tutorial',
        playsinline: true,
      },
      onReady(video: Window['wistiaVideos'][string]) {
        window.wistiaVideos[wistiaMediaId] = video;

        if (videoInitializedRef.current) {
          playCurrentSegment();
        }

        video.bind('play', () => setIsPlaying(true));
        video.bind('pause', () => setIsPlaying(false));

        if (pageType !== 'product') {
          video.bind('end', () => {
            video.time(0);
            video.play();
          });
        }
      },
    });

    return () => {
      const video = getVideo();

      if (video) {
        try {
          video.unbind('timechange');
          video.unbind('play');
          video.unbind('pause');
        } catch {
          // Do nothing
        }
      }
    };
  }, [wistiaMediaId, playCurrentSegment, pageType, getVideo]);

  // Set up Intersection Observer to play video when it's in view
  useEffect(() => {
    // Don't set up intersection observer for tutorial videos at all
    if (pageType === 'tutorial') return;

    const videoContainer = videoContainerRef.current;

    if (!videoContainer) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = getVideo();

        if (!video) return;

        if (entry.isIntersecting) {
          if (!videoInitializedRef.current) {
            videoInitializedRef.current = true;
          }

          if (!userPausedRef.current) {
            playCurrentSegment();
          }
        } else {
          video.pause();
        }
      });
    }, options);

    observer.observe(videoContainer);

    return () => observer.unobserve(videoContainer);
  }, [getCurrentSegment, playCurrentSegment, pageType, getVideo]);

  // Update segment when active item changes
  useEffect(() => {
    if (pageType !== 'product') return;

    const video = getVideo();

    if (videoInitializedRef.current && video) {
      playCurrentSegment();
    }
  }, [activeId, playCurrentSegment, pageType, getVideo]);

  const renderWistiaImage = () => {
    if (!wistiaMediaId) return null;

    return (
      <Image
        alt=""
        aria-hidden="true"
        fill
        src={`https://fast.wistia.com/embed/medias/${wistiaMediaId}/swatch`}
        style={{
          filter: 'blur(5px)',
          height: '100%',
          objectFit: 'contain',
          width: '100%',
        }}
      />
    );
  };

  return (
    <div
      className={clsx(
        'overflow-hidden rounded-lg',
        pageType !== 'tutorial' && '[&_.click-for-sound-btn]:!hidden',
      )}
      ref={videoContainerRef}
    >
      {pageType !== 'product' && (
        <div
          className={clsx(
            'wistia-player-control absolute bottom-0 z-20 flex items-center justify-center',
            buttonPosition === 'left' ? 'left-0' : 'right-0',
          )}
        >
          {!isPlaying ? (
            <Button className="text-white" onClick={handlePlay} shape="link" variant="link">
              <PlayIcon />
            </Button>
          ) : (
            <Button className="text-white" onClick={handlePause} shape="link" variant="link">
              <PauseIcon />
            </Button>
          )}
        </div>
      )}
      {/* Add Wistia Scripts */}
      <Script src="https://fast.wistia.com/assets/external/E-v1.js" strategy="afterInteractive" />
      <Script id="wistia-setup-script" strategy="afterInteractive">{`
        window._wq = window._wq || [];
      `}</Script>
      {/* Wistia embed wrapper */}
      <div className="h-full w-full">
        <div className="wistia_responsive_padding">
          <div className="wistia_responsive_wrapper">
            <div
              className={`wistia_embed wistia_async_${wistiaMediaId} videoFoam=true`}
              style={{
                height: '100%',
                position: 'relative',
                width: '100%',
              }}
            >
              <div
                className="wistia_swatch"
                style={{
                  height: '100%',
                  left: 0,
                  opacity: 1,
                  overflow: 'hidden',
                  position: 'absolute',
                  top: 0,
                  transition: 'opacity 200ms',
                  width: '100%',
                }}
              >
                {renderWistiaImage()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
