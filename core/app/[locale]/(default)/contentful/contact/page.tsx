import { z } from 'zod';

import { submitForm } from './_actions/submit-form';

export default async function ContactPage() {
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

  type TicketForm = z.infer<typeof TicketFormSchema>['ticket_form'];
  type TicketField = z.infer<typeof TicketFieldSchema>['ticket_field'];

  const ticketFormResponse = await fetch(
    `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/ticket_forms/${process.env.ZENDESK_TICKET_FORM_ID}.json`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ZENDESK_ACCESS_TOKEN}`,
      },
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

    
    // TODO if end_user_conditions.parent_field_id.value = field.value chosen, then show child_fields.id and make required if child_fields.required = true
    ticketForm.end_user_conditions.forEach((condition) => {
      console.log('end user conditons, child fields', condition.child_fields);
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1>Contact</h1>
      <form action={submitForm} className="mt-6 flex max-w-lg flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="email">
            Email address
          </label>
          <input
            className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            id="email"
            name="email"
            required
            type="email"
          />
        </div>
        {fields.map((field) => (
          <div className="flex flex-col gap-2" key={field.id}>
            <label className="text-sm font-medium text-gray-700" htmlFor={field.id.toString()}>
              {field.title_in_portal}
            </label>
            <p className="text-sm text-gray-500">{field.description}</p>
            {field.custom_field_options ? (
              <select
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                id={field.id.toString()}
                name={field.id.toString()}
                required={field.required}
              >
                {field.custom_field_options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                id={field.id.toString()}
                name={field.id.toString()}
                required={field.required}
                type="text"
              />
            )}
          </div>
        ))}
        <button
          className="mt-4 inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
