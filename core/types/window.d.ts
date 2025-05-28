interface Window {
  Weglot: {
    initialize: (config: { api_key: string; hide_switcher?: boolean; cache?: boolean }) => void;
    switchTo: (locale: string) => void;
    on: (event: string, callback: () => void) => void;
    getCurrentLang: () => string;
  };
  truste: {
    eu: {
      clickListener: () => void;
    };
  };
}

declare function zE(action: string, command: string): void;
