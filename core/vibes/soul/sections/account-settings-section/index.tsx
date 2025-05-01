import { ChangePasswordAction, ChangePasswordForm } from './change-password-form';
import { Account, UpdateAccountAction, UpdateAccountForm } from './update-account-form';

interface Props {
  title?: string;
  account: Account;
  updateAccountAction: UpdateAccountAction;
  updateAccountSubmitLabel?: string;
  changePasswordTitle?: string;
  changePasswordAction: ChangePasswordAction;
  changePasswordSubmitLabel?: string;
  currentPasswordLabel?: string;
  newPasswordLabel?: string;
  confirmPasswordLabel?: string;
}

export function AccountSettingsSection({
  title = 'Account Settings',
  account,
  updateAccountAction,
  updateAccountSubmitLabel,
  changePasswordTitle = 'Change Password',
  changePasswordAction,
  changePasswordSubmitLabel,
}: Props) {
  return (
    <div className="@container">
      <div className="flex flex-col gap-y-24 @xl:flex-row">
        <div className="flex w-full flex-col @xl:max-w-lg">
          <div className="pb-12">
            <h1 className="mb-8 hidden text-4xl leading-[120%] @2xl:block">{title}</h1>
            <UpdateAccountForm
              account={account}
              action={updateAccountAction}
              submitLabel={updateAccountSubmitLabel}
            />
          </div>
          <div className="border-contrast-200 border-t pt-12">
            <h1 className="mb-8 text-4xl leading-[120%] @2xl:block">{changePasswordTitle}</h1>
            <ChangePasswordForm
              action={changePasswordAction}
              submitLabel={changePasswordSubmitLabel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
