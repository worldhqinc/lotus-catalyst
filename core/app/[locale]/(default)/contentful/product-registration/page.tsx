import { Checkbox } from '@/vibes/soul/form/checkbox';
import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { Button } from '@/vibes/soul/primitives/button';
import { Link } from '~/components/link';

export default function ProductRegistration() {
  return (
    <div>
      <div className="py-8 md:py-16">
        <div className="container max-w-[300px] text-center md:max-w-lg lg:max-w-2xl">
          <h1 className="font-heading text-4xl uppercase md:text-6xl">Product Registration</h1>
        </div>
      </div>
      <div className="bg-contrast-100 px-4 py-8 md:py-16">
        <div className="mx-auto max-w-2xl rounded bg-white p-4 md:p-8">
          <p>
            Sweepstakes for United States customers only. Register for a monthly chance to win $100
            to spend on lotuscooking.com. Receive information on products, discounts, recipes,
            sweepstakes, and more!
          </p>
          <form className="mt-8 flex flex-col gap-8">
            <div>
              <h2 className="mb-6 text-lg font-medium tracking-[1.8px] uppercase">About you</h2>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex flex-1 flex-col gap-1">
                  <Label htmlFor="name">First name</Label>
                  <Input id="name" name="name" type="text" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" name="last-name" type="text" />
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" />
              </div>
            </div>
            <div>
              <h2 className="mb-6 text-lg font-medium tracking-[1.8px] uppercase">Your product</h2>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex flex-1 flex-col gap-1">
                  <Label htmlFor="product-type">Product type</Label>
                  <Input id="product-type" name="product-type" type="text" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <Label htmlFor="model-number">Model number</Label>
                  <Input id="model-number" name="model-number" type="text" />
                </div>
              </div>
            </div>
            {/* <div>
              <h2 className="mb-6 text-lg font-medium tracking-[1.8px] uppercase">
                Sweepstakes eligibility
              </h2>
              <div className="flex flex-col gap-4">
                <Label htmlFor="birthday">Birthday (Are you old enough to win?)</Label>
                <Input id="birthday" name="birthday" type="date" />
              </div>
            </div> */}
            <div>
              <div className="flex gap-4">
                <Checkbox id="email-opt-in" name="email-opt-in" />
                <Label htmlFor="email-opt-in">
                  Yes! Please add me to your mailing list to be entered into your monthly
                  sweepstakes
                </Label>
              </div>
              <div className="mt-2 flex gap-4">
                <Checkbox id="terms" name="terms" />
                <Label htmlFor="terms">
                  I agree to the Official Rules, Terms and Conditions and Privacy Policy
                </Label>
              </div>
            </div>
            <Button className="md:self-start" size="medium" type="submit">
              Register
            </Button>
            <div>
              <p className="text-xs leading-[26px]">
                Lotus Cooking needs the contact information you provide to us to contact you about
                our products and services. You may unsubscribe from these communications at any
                time. For information on how to unsubscribe, as well as our privacy practices and
                commitment to protecting your privacy, please review our{' '}
                <Link className="text-primary" href="/privacy-policy">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
