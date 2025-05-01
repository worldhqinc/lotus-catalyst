import { ForgotPasswordAction, ForgotPasswordForm } from './forgot-password-form';

interface Props {
  title?: string;
  subtitle?: string;
  action: ForgotPasswordAction;
  emailLabel?: string;
  submitLabel?: string;
}

export function ForgotPasswordSection({
  title = 'Forgot your password?',
  subtitle = 'Enter the email associated with your account below. We’ll send you instructions to reset your password.',
  emailLabel,
  submitLabel,
  action,
}: Props) {
  return (
    <div className="@container">
      <div className="flex flex-col justify-center gap-y-4 px-3 py-10 @xl:flex-row @xl:gap-x-4 @xl:px-6 @4xl:gap-x-8 @4xl:py-16 @5xl:px-16">
        <div className="border-contrast-200 flex w-full flex-col gap-8 rounded-lg border p-4 @xl:max-w-2xl @xl:p-8">
          <div>
            <h1 className="mb-2 text-2xl leading-[120%] @xl:text-4xl">{title}</h1>
            <p className="text-contrast-400 leading-8 @4xl:text-xl">{subtitle}</p>
          </div>
          <ForgotPasswordForm action={action} emailLabel={emailLabel} submitLabel={submitLabel} />
        </div>
      </div>
    </div>
  );
}
