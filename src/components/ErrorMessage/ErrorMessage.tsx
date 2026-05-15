import type { ReactElement } from 'react';

interface Props {
  message: string;
}

function ErrorMessage({ message }: Props): ReactElement {
  return <p className="error-message">{message}</p>;
}

export default ErrorMessage;
