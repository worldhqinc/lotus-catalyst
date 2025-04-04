export default function ContentfulBlockProductFeaturesAccordion(entry) {
  return (
    <div>
      <h2>
        {
          // eslint-disable-next-line
          entry.entry.fields.heading
        }
      </h2>
    </div>
  );
}
