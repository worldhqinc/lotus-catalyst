import { Link } from '~/components/link';

import { SignInAction, SignInForm } from './sign-in-form';

interface Props {
  children?: React.ReactNode;
  title?: string;
  action: SignInAction;
  submitLabel?: string;
  emailLabel?: string;
  passwordLabel?: string;
  forgotPasswordHref?: string;
  forgotPasswordLabel?: string;
}

export function SignInSection({
  title = 'Sign In',
  children,
  action,
  submitLabel,
  emailLabel,
  passwordLabel,
  forgotPasswordHref = '/forgot-password',
  forgotPasswordLabel = 'Forgot Password?',
}: Props) {
  return (
    <div className="@container px-4 py-8 xl:py-16 @xl:px-8">
      <div className="border-contrast-200 divide-contrast-200 mx-auto grid max-w-[1076px] grid-cols-1 divide-y rounded-lg border p-4 @xl:grid-cols-2 @xl:divide-x @xl:divide-y-0 @xl:p-8">
        <div className="flex w-full flex-col pb-4 @xl:pr-8 @xl:pb-0">
          <h1 className="mb-8 text-2xl leading-[120%] @5xl:text-4xl">{title}</h1>
          <SignInForm
            action={action}
            emailLabel={emailLabel}
            passwordLabel={passwordLabel}
            submitLabel={submitLabel}
          />
          <div className="mt-4 flex items-center gap-x-2">
            <Link className="link text-primary block self-start" href={forgotPasswordHref}>
              {forgotPasswordLabel}
            </Link>
          </div>
        </div>

        <div className="flex w-full flex-col pt-4 @xl:pt-0 @xl:pl-8">{children}</div>
      </div>
    </div>
  );
}
