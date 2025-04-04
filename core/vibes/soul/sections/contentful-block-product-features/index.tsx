// eslint-disable-next-line
export default function ContentfulBlockProductFeatures(entry: any) {
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
