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
    wistiaVideo: {
      time: (seconds: number) => void;
      play: () => void;
      pause: () => void;
      bind: (event: string, callback: (time: number) => void) => void;
      unbind: (event: string) => void;
    };
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
  wistiaMediaId,
  wistiaMediaSegments,
}: {
  activeId?: string;
  anchorIds?: string[];
  pageType?: 'product' | 'page' | 'tutorial';
  wistiaMediaId?: string | null;
  wistiaMediaSegments?: string[] | null;
}) {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoInitializedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoSegments = useRef<Record<string, VideoSegment>>({});

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
    if (!('wistiaVideo' in window)) return;

    const video = window.wistiaVideo;

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
  }, [getCurrentSegment, pageType]);

  const handlePlay = useCallback(() => {
    if (!('wistiaVideo' in window)) return;
    window.wistiaVideo.play();
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    if (!('wistiaVideo' in window)) return;
    window.wistiaVideo.pause();
    setIsPlaying(false);
  }, []);

  // Load Wistia scripts when component mounts
  useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    window._wq = window._wq || [];
    // eslint-disable-next-line no-underscore-dangle
    window._wq.push({
      id: wistiaMediaId,
      options: {
        autoplay: true,
        playsinline: true,
      },
      onReady(video: Window['wistiaVideo']) {
        window.wistiaVideo = video;

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
      if ('wistiaVideo' in window) {
        try {
          window.wistiaVideo.unbind('timechange');
          window.wistiaVideo.unbind('play');
          window.wistiaVideo.unbind('pause');
        } catch {
          // Do nothing
        }
      }
    };
  }, [wistiaMediaId, playCurrentSegment, pageType]);

  // Set up Intersection Observer to play video when it's in view
  useEffect(() => {
    const videoContainer = videoContainerRef.current;

    if (!videoContainer) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const wistiaVideoAvailable = 'wistiaVideo' in window;

          if (wistiaVideoAvailable) {
            if (!videoInitializedRef.current) {
              videoInitializedRef.current = true;
            }

            playCurrentSegment();
          }
        } else if ('wistiaVideo' in window) {
          window.wistiaVideo.pause();
        }
      });
    }, options);

    observer.observe(videoContainer);

    return () => observer.unobserve(videoContainer);
  }, [getCurrentSegment, playCurrentSegment, pageType]);

  // Update segment when active item changes
  useEffect(() => {
    if (pageType !== 'product') return;

    const hasWistiaVideo = 'wistiaVideo' in window;

    if (videoInitializedRef.current && hasWistiaVideo) {
      playCurrentSegment();
    }
  }, [activeId, playCurrentSegment, pageType]);

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
        <div className="wistia-player-control absolute right-0 bottom-0 z-20 flex items-center justify-center">
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
