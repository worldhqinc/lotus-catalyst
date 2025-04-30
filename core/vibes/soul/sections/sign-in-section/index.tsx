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
  forgotPasswordLabel = 'Reset password',
}: Props) {
  return (
    <div className="@container">
      <div className="flex flex-col justify-center gap-y-4 px-3 py-10 @xl:flex-row @xl:gap-x-4 @xl:px-6 @4xl:gap-x-8 @4xl:py-16 @5xl:px-16">
        <div className="border-contrast-200 flex w-full flex-col rounded-lg border p-4 @xl:max-w-md @5xl:p-8">
          <h1 className="mb-8 text-2xl leading-[120%] @5xl:text-4xl">{title}</h1>
          <SignInForm
            action={action}
            emailLabel={emailLabel}
            passwordLabel={passwordLabel}
            submitLabel={submitLabel}
          />
          <div className="mt-4 flex items-center gap-x-2">
            <p>Forgot Password?</p>
            <Link className="link text-primary block self-start" href={forgotPasswordHref}>
              {forgotPasswordLabel}
            </Link>
          </div>
        </div>

        <div className="border-contrast-200 flex w-full flex-col rounded-lg border p-4 @xl:max-w-md @5xl:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
