import { ValidatedForm, useField, useIsSubmitting } from "remix-validated-form";
import { createTodoValidator } from "~/routes/todos";

const TodoCreationInput = ({ name }: { name: string }) => {
  const { error, getInputProps } = useField(name);
  return (
    <div>
      <input {...getInputProps({ id: name })} />
      {error && <span>{error}</span>}
    </div>
  );
};

const TodoCreationSubmitButton = () => {
  const isSubmitting = useIsSubmitting();
  return (
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Saving..." : "Save"}
    </button>
  );
};

export const TodoCreationForm = () => {
  return (
    <ValidatedForm
      validator={createTodoValidator}
      action="/todos"
      method="post"
    >
      <TodoCreationInput name="text" />
      <TodoCreationSubmitButton />
    </ValidatedForm>
  );
};
