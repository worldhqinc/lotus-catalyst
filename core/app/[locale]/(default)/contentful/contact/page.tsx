import { z } from 'zod';

import { revalidate } from '~/client/revalidate-target';

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
        child_fields: z.array(z.any()),
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

    // console.log(fields);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1>Contact</h1>
      <ContactForm fields={fields} />
    </div>
  );
}
