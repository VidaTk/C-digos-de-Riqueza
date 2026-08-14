import RegisterForm, { type RegisterFormProps } from "./RegisterForm";

interface RegisterFormSectionProps extends RegisterFormProps {
  id?: string;
  className?: string;
}

export default function RegisterFormSection({
  id,
  className,
  ...formProps
}: RegisterFormSectionProps) {
  return (
    <section id={id} className={className ?? "bg-white px-6 py-16 sm:py-20"}>
      <RegisterForm {...formProps} />
    </section>
  );
}
