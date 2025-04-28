import { Input } from '@/vibes/soul/form/input';
import { Label } from '@/vibes/soul/form/label';
import { Button } from '@/vibes/soul/primitives/button';

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
          <form className="mt-8 flex flex-col gap-4">
            <h2 className="mb-4 text-lg font-medium tracking-[1.8px] uppercase">About you</h2>
            <div className="flex flex-col gap-1">
              <Label htmlFor="name">First name</Label>
              <Input id="name" name="name" type="text" />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" name="last-name" type="text" />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" />
            </div>
            <Button size="medium" type="submit">
              Register
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
