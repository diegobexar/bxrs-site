export function MultilineText({ value }: { value: string | null | undefined }) {
  if (!value) return null;
  return (
    <>
      {value.split("\n").map((line, i) => (
        <span key={i} style={{ display: "block" }}>
          {line}
        </span>
      ))}
    </>
  );
}
