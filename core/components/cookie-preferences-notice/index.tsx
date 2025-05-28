import { Link } from '~/components/link';

import CookiePreferencesCta from '../cookie-preferences-cta';

interface CookiePreferencesNoticeProps {
  message?: string | React.ReactNode;
}

export default function CookiePreferencesNotice({ message }: CookiePreferencesNoticeProps) {
  let messageToDisplay: React.ReactNode = (
    <p className="text-left">
      We use cookies to ensure you get the best experience on our website. Please enable "Functional
      cookies" in your <CookiePreferencesCta variant="link" /> or email us at{' '}
      <Link className="underline" href="mailto:customercare@lotuscooking.com">
        customercare@lotuscooking.com
      </Link>
      .
    </p>
  );

  if (message) {
    messageToDisplay = message;
  }

  return (
    <div className="msg-to-opt-out-users" style={{ display: 'none' }}>
      {messageToDisplay}
    </div>
  );
}
