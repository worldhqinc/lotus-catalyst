'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef } from 'react';

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
  anchorIds,
  wistiaMediaId,
  wistiaMediaSegments,
}: {
  activeId?: string;
  anchorIds: string[];
  wistiaMediaId?: string | null;
  wistiaMediaSegments?: string[] | null;
}) {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoInitializedRef = useRef(false);

  const videoSegments = useRef<Record<string, VideoSegment>>({});

  // Setup video segments
  useEffect(() => {
    // Validate and parse wistiaMediaSegments
    const validSegments = (wistiaMediaSegments || [])
      .map((segment) => parseFloat(segment))
      .filter((time) => Number.isFinite(time));

    // Create segments for each accordion item
    const segmentsMap: Record<string, VideoSegment> = {};

    anchorIds.forEach((id, index) => {
      const startTime = index === 0 ? 0 : validSegments[index - 1] || 0;
      // If there's a next segment time, use it as end time, otherwise use a large number to play to the end
      const endTime = validSegments[index] || Number.MAX_SAFE_INTEGER;

      segmentsMap[id] = {
        start: startTime,
        end: endTime,
      };
    });

    videoSegments.current = segmentsMap;
  }, [anchorIds, wistiaMediaSegments]);

  // Get current segment based on active accordion item
  const getCurrentSegment = useCallback(() => {
    return activeId ? videoSegments.current[activeId] : undefined;
  }, [activeId]);

  // Function to play the current segment
  const playCurrentSegment = useCallback(() => {
    if (!('wistiaVideo' in window)) return;

    const video = window.wistiaVideo;

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
  }, [getCurrentSegment]);

  // Set up Intersection Observer to play video when it's in view
  useEffect(() => {
    const videoContainer = videoContainerRef.current;

    if (!videoContainer) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // 50% of the element must be visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // When video is 50% in view and we have wistiaVideo ready
          const segment = getCurrentSegment();
          const wistiaVideoAvailable = 'wistiaVideo' in window;

          if (wistiaVideoAvailable && segment && !videoInitializedRef.current) {
            // Only initialize once
            videoInitializedRef.current = true;
            playCurrentSegment();
          }
        } else if ('wistiaVideo' in window) {
          // Pause when out of view
          window.wistiaVideo.pause();
        }
      });
    }, options);

    observer.observe(videoContainer);

    return () => {
      observer.unobserve(videoContainer);
    };
  }, [getCurrentSegment, playCurrentSegment]);

  // Load Wistia scripts when component mounts
  useEffect(() => {
    // Set up Wistia API when scripts are loaded
    // eslint-disable-next-line no-underscore-dangle
    window._wq = window._wq || [];
    // eslint-disable-next-line no-underscore-dangle
    window._wq.push({
      id: wistiaMediaId,
      onReady(video: Window['wistiaVideo']) {
        window.wistiaVideo = video;

        // If video is already in view, play the initial segment
        if (videoInitializedRef.current) {
          playCurrentSegment();
        }
      },
    });

    // Clean up previous bindings when component unmounts
    return () => {
      if ('wistiaVideo' in window) {
        try {
          // Attempt to unbind timechange events
          window.wistiaVideo.unbind('timechange');
        } catch {
          // Do nothing
        }
      }
    };
  }, [wistiaMediaId, playCurrentSegment]);

  // Update segment when active item changes
  useEffect(() => {
    const hasWistiaVideo = 'wistiaVideo' in window;

    if (videoInitializedRef.current && hasWistiaVideo) {
      playCurrentSegment();
    }
  }, [activeId, playCurrentSegment]);

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
    <div className="overflow-hidden rounded-lg" ref={videoContainerRef}>
      {/* Add Wistia Scripts */}
      <Script src="https://fast.wistia.com/assets/external/E-v1.js" strategy="afterInteractive" />
      <Script id="wistia-setup-script" strategy="afterInteractive">{`
        window._wq = window._wq || [];
      `}</Script>
      {/* Wistia embed wrapper */}
      <div className="h-full w-full">
        <div
          className="wistia_responsive_padding"
          style={{
            padding: '125.0% 0 0 0',
            position: 'relative',
          }}
        >
          <div
            className="wistia_responsive_wrapper"
            style={{
              height: '100%',
              left: 0,
              position: 'absolute',
              top: 0,
              width: '100%',
            }}
          >
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
