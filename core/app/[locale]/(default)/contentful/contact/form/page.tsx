import { z } from 'zod';

import { revalidate } from '~/client/revalidate-target';
import CookiePreferencesNotice from '~/components/cookie-preferences-notice';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import BrandArtwork from '~/public/images/Lotus-Pattern.svg';

import { ContactForm } from '../_components/contact-form';

const TicketFormSchema = z.object({
  ticket_form: z.object({
    id: z.number(),
    raw_name: z.string(),
    raw_display_name: z.string(),
    end_user_visible: z.boolean(),
    position: z.number(),
    ticket_field_ids: z.array(z.number()),
    active: z.boolean(),
    default: z.boolean(),
    in_all_brands: z.boolean(),
    restricted_brand_ids: z.array(z.number()),
    end_user_conditions: z.array(
      z.object({
        parent_field_id: z.number(),
        parent_field_type: z.string(),
        value: z.string(),
        child_fields: z.array(
          z.object({
            id: z.number(),
            is_required: z.boolean(),
          }),
        ),
      }),
    ),
    agent_conditions: z.array(z.any()),
    url: z.string(),
    name: z.string(),
    display_name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
});

const TicketFieldSchema = z.object({
  ticket_field: z.object({
    url: z.string(),
    id: z.number(),
    type: z.string(),
    title: z.string(),
    raw_title: z.string(),
    description: z.string(),
    raw_description: z.string(),
    position: z.number(),
    active: z.boolean(),
    required: z.boolean(),
    collapsed_for_agents: z.boolean(),
    regexp_for_validation: z.string().nullable(),
    title_in_portal: z.string(),
    raw_title_in_portal: z.string(),
    visible_in_portal: z.boolean(),
    editable_in_portal: z.boolean(),
    required_in_portal: z.boolean(),
    agent_can_edit: z.boolean(),
    tag: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    removable: z.boolean(),
    key: z.string().nullable(),
    agent_description: z.string().nullable(),
    custom_field_options: z
      .array(
        z.object({
          id: z.number(),
          name: z.string(),
          raw_name: z.string(),
          value: z.string(),
          default: z.boolean(),
        }),
      )
      .nullable()
      .optional(),
    hidden: z.boolean().optional(),
    conditions: z
      .array(
        z.object({
          parent_field_id: z.number(),
          parent_field_type: z.string(),
          value: z.string(),
          child_fields: z.array(
            z.object({
              id: z.number(),
              is_required: z.boolean(),
            }),
          ),
        }),
      )
      .optional(),
  }),
});

export type TicketForm = z.infer<typeof TicketFormSchema>['ticket_form'];
export type TicketField = z.infer<typeof TicketFieldSchema>['ticket_field'];

export default async function ContactFormPage() {
  const ticketFormResponse = await fetch(
    `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/ticket_forms/${process.env.ZENDESK_TICKET_FORM_ID}.json`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ZENDESK_ACCESS_TOKEN}`,
      },
      next: { revalidate },
    },
  );

  let fields: TicketField[] = [];

  if (ticketFormResponse.ok) {
    const ticketFormData = TicketFormSchema.parse(await ticketFormResponse.json());
    const ticketForm: TicketForm = ticketFormData.ticket_form;

    fields = await Promise.all(
      ticketForm.ticket_field_ids.map(async (fieldId) => {
        const TicketFieldResponse = await fetch(
          `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/ticket_fields/${fieldId}.json`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.ZENDESK_ACCESS_TOKEN}`,
            },
            next: { revalidate },
          },
        );

        if (TicketFieldResponse.ok) {
          const ticketFieldData = TicketFieldSchema.parse(await TicketFieldResponse.json());
          const ticketField: TicketField = ticketFieldData.ticket_field;

          if (ticketField.visible_in_portal) {
            const conditions = ticketForm.end_user_conditions.filter((condition) =>
              condition.child_fields.some((childField) => childField.id === ticketField.id),
            );

            if (conditions.length > 0) {
              ticketField.hidden = true;
            }

            return ticketField;
          }
        }
      }),
    ).then((results) => results.filter((field): field is TicketField => field !== undefined));

    const fieldsWithConditions = fields.map((field) => {
      const conditions = ticketForm.end_user_conditions.filter(
        (condition) => condition.parent_field_id === field.id,
      );

      return {
        ...field,
        conditions,
      };
    });

    fields = fieldsWithConditions;
  }

  return (
    <>
      <div className="bg-primary relative isolate overflow-hidden py-8 text-center text-white md:py-16">
        <Image
          alt="Lotus Pattern"
          className="absolute inset-0 top-1/2 left-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          src={BrandArtwork}
        />
        <div className="container max-w-[300px] md:max-w-lg lg:max-w-2xl">
          <h1 className="font-heading text-4xl uppercase md:text-6xl">Contact Lotus</h1>
          <p className="mt-4">Have a question? Need a hand? Our team is ready to help.</p>
        </div>
      </div>
      <div className="container py-8 lg:py-16">
        <div className="text-center">
          <p className="text-contrast-400 text-center">
            Our Customer Care team is available Monday through Friday 9:00 am - 4:30 pm ET.
          </p>
          <p className="text-contrast-400 pt-2 text-center">Closed on major US holidays.</p>
        </div>
        <div className="border-contrast-200 mx-auto mt-8 max-w-2xl rounded-lg border p-4 lg:mt-16 lg:p-8">
          {fields.length > 0 ? (
            <ContactForm fields={fields} />
          ) : (
            <p>
              Unable to load form, please contact support at{' '}
              <Link className="underline" href="mailto:customercare@lotuscooking.com">
                customercare@lotuscooking.com
              </Link>
            </p>
          )}
          <CookiePreferencesNotice />
        </div>
      </div>
    </>
  );
}
