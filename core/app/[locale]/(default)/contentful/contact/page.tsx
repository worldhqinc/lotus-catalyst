import { z } from 'zod';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { revalidate } from '~/client/revalidate-target';
import CookiePreferencesNotice from '~/components/cookie-preferences-notice';

import { ChatWidgetButton } from './_components/chat-widget-button';
import { ContactForm } from './_components/contact-form';

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

export default async function ContactPage() {
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
      <div className="bg-primary py-8 text-center text-white md:py-16">
        <div className="container max-w-[300px] md:max-w-lg lg:max-w-2xl">
          <h1 className="font-heading text-4xl uppercase md:text-6xl">Contact Lotus</h1>
          <p className="mt-4">Have a question? Need a hand? Our team is ready to help.</p>
        </div>
      </div>
      <p className="text-contrast-400 mx-auto flex flex-col items-center justify-center pt-16 text-center">
        Our Customer Care team is available Monday through Friday 9:00 am - 4:30 pm ET.
      </p>
      <p className="text-contrast-400 mx-auto flex flex-col items-center justify-center pt-2 text-center">
        Closed on major US holidays.
      </p>
      <div className="container my-8 md:my-16 lg:max-w-[1142px]">
        <div className="border-contrast-200 divide-contrast-200 divide-y rounded-lg border lg:grid lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))] lg:divide-x lg:divide-y-0">
          <div className="flex flex-col items-center p-4 text-center lg:p-8">
            <div>
              <h2 className="text-lg font-medium tracking-[1.8px] uppercase md:text-2xl lg:leading-[120%]">
                Chat
              </h2>
              <p className="text-contrast-400 mt-4">Message us directly.</p>
            </div>
            <div className="mt-8">
              <ChatWidgetButton />
            </div>
          </div>
          {fields.length > 0 && (
            <div className="flex flex-col items-center p-4 text-center lg:p-8">
              <div>
                <h2 className="text-lg font-medium tracking-[1.8px] uppercase md:text-2xl lg:leading-[120%]">
                  Email
                </h2>
                <p className="text-contrast-400 mt-4">Don't have time to chat today?</p>
              </div>
              <div className="mt-8">
                <ContactForm fields={fields} />
                <CookiePreferencesNotice />
              </div>
            </div>
          )}
          <div className="flex flex-col items-center p-4 text-center lg:p-8">
            <div>
              <h2 className="text-lg font-medium tracking-[1.8px] uppercase md:text-2xl lg:leading-[120%]">
                Call
              </h2>
              <p className="text-contrast-400 mt-4">Talk to us live.</p>
            </div>
            <div className="mt-8">
              <ButtonLink className="w-full md:w-auto" href="tel:18885688761" size="medium">
                1-888-568-8761
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
